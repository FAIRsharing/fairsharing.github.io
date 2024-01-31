<template>
  <v-container
    id="organisationPage"
    fluid
    class="standard grey lighten-3 pb-10"
  >
    <div v-if="error && !loading">
      <NotFound />
    </div>
    <div v-else>
      <!-- new stuff below here -->
      <v-card
        class="pa-4 mt-2 ml-7 mr-7 d-flex flex-column"
        outlined
        :color="$vuetify.theme.themes.bg_organisation_record_card"
        tile
        elevation="3"
      >
        <SectionTitle title="Organisation" />

        <!-- TODO: Replace with a component including a logo, when we have an edit form -->
        <!-- TODO: This can be refactored to a new component at that time -->
        <v-img
          v-if="logoUrl"
          :src="logoUrl"
          contain
          aspect-ratio="1"
          height="100px"
        />
        <h2 class="mt-3">
          {{ organisation.name }}
        </h2>
        <!-- alternative names -->
        <div
          v-if="getAltNames(organisation)"
          class="d-flex flex-row mt-4 align-center"
        >
          <b class="width-15-percent-flex">Also known as</b>
          <p class="ma-0 full-width ml-md-12 ml-13">
            {{ getAltNames(organisation) }}
          </p>
        </div>
        <!-- homepage -->
        <div class="d-flex flex-row mt-4 align-center">
          <b class="width-15-percent-flex">Homepage</b>
          <p class="ma-0 full-width ml-md-12 ml-13">
            <a :href="organisation.homepage">{{ organisation.homepage }}</a>
          </p>
        </div>
        <!-- types -->
        <div class="d-flex flex-row mt-4 align-center">
          <b class="width-15-percent-flex">Types</b>
          <p class="ma-0 full-width ml-md-12 ml-13">
            <v-chip
              v-for="type in organisation.types"
              :key="type + '_type'"
              variant="elevated"
              class="ma-1"
            >
              {{ type }}
            </v-chip>
          </p>
        </div>
        <!--- parent organisations -->
        <div
          v-if="organisation.parentOrganisations.length > 0"
          class="d-flex flex-row mt-4 align-center"
        >
          <b class="width-15-percent-flex">Member of</b>
          <p class="ma-0 full-width ml-md-12 ml-13">
            <v-chip
              v-for="parent in organisation.parentOrganisations"
              :key="'parent_' + parent.id"
              :href="orgUrl() + parent.id"
              color="light-blue"
              variant="elevated"
              class="ma-1"
            >
              {{ parent.name }}
            </v-chip>
          </p>
        </div>
        <!--- child organisations -->
        <div
          v-if="organisation.childOrganisations.length > 0"
          class="d-flex flex-row mt-4 align-center"
        >
          <b class="width-15-percent-flex">Has members</b>
          <p class="ma-0 full-width ml-md-12 ml-13">
            <v-chip
              v-for="child in organisation.childOrganisations"
              :key="'child_' + child.id"
              :href="orgUrl() + child.id"
              color="light-blue"
              variant="elevated"
              class="ma-1"
            >
              {{ child.name }}
            </v-chip>
          </p>
        </div>
        <!--- users -->
        <div
          v-if="organisation.users.length > 0"
          class="d-flex flex-row mt-4 align-center"
        >
          <b class="width-15-percent-flex">Users</b>
          <p class="ma-0 full-width ml-md-12 ml-13">
            <v-chip
              v-for="user in organisation.users"
              :key="'user_' + user.id"
              :href="getUserLink() + user.id"
              color="light-blue"
              variant="elevated"
              class="ma-1"
            >
              {{ formatUser(user) }}
            </v-chip>
          </p>
        </div>
        <!--- countries -->
        <div
          v-if="organisation.countries.length > 0"
          class="d-flex flex-row mt-4 align-center"
        >
          <b class="width-15-percent-flex">Countries</b>
          <p class="ma-0 full-width ml-md-12 ml-13">
            <v-chip
              v-for="country in organisation.countries"
              :key="'country_' + country.id"
              variant="elevated"
              class="ma-1"
            >
              {{ country.name }}
            </v-chip>
          </p>
        </div>

        <!-- ror link -->
        <p
          v-if="organisation.rorLink"
          class="d-flex flex-row mt-4 align-center"
        >
          <img
            src="/assets/icons/ror-icon-rbg-32.png"
            class="mr-1"
          >
          <a :href="organisation.rorLink">
            {{ organisation.rorLink }}
          </a>
        </p>
      </v-card>

      <SearchOrganisationRecords
        id="searchOrganisationRecords"
        class="mb-10 ma-4"
        :organisation="organisation"
      />

      <v-col
        v-if="!loading"
        cols="12"
      >
        <v-container
          fluid
          class="py-0"
        />

        <v-fade-transition>
          <v-overlay
            v-if="loading"
            :absolute="false"
            opacity="0.8"
          >
            <loaders />
          </v-overlay>
        </v-fade-transition>
      </v-col>
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

import Loaders from "@/components/Navigation/Loaders";
import SearchOrganisationRecords from "@/components/Organisations/SearchOrganisationRecords.vue";
import SectionTitle from "@/components/Records/Record/SectionTitle.vue";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getOrganisationQuery from "@/lib/GraphClient/queries/Organisations/getOrganisation.json";
import { cleanString } from "@/utils/stringUtils";
import NotFound from "@/views/Errors/404";

let graphClient = new GraphClient();

export default {
  name: "Organisation",
  components: { SearchOrganisationRecords, SectionTitle, NotFound, Loaders },
  mixins: [cleanString],
  data: () => {
    return {
      error: true,
      organisation: {
        alternativeNames: [],
        types: [],
        users: [],
        parentOrganisations: [],
        childOrganisations: [],
        countries: [],
      },
      loading: false,
      perPage: 10,
      footer: { "items-per-page-options": [10] },
      showOverlay: false,
      targetID: null,
      testEnvironment: false,
      headers: [
        { text: "Name", value: "name", align: "center" },
        { text: "Status", value: "status", align: "center" },
        { text: "Relation", value: "relation", align: "center" },
        { text: "Grant", value: "grant", align: "center" },
        { text: "Actions", value: "actions", align: "center", sortable: false },
      ],
      userHeaders: [
        { text: "Username", value: "username", align: "center" },
        { text: "Email address", value: "email", align: "center" },
        { text: "ORCID ID", value: "orcid", align: "center" },
        { text: "Twitter", value: "twitter", align: "center" },
      ],
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    currentRoute() {
      return this.$route.params["id"];
    },
    logoUrl() {
      if (this.organisation.urlForLogo) {
        return process.env.VUE_APP_API_ENDPOINT + this.organisation.urlForLogo;
      }
      return null;
    },
  },
  watch: {
    async currentRoute() {
      await this.getOrganisation();
    },
  },
  async created() {
    await this.getOrganisation();
  },
  methods: {
    async getOrganisation() {
      try {
        // testEnvironment variable is only for test case.
        if (this.testEnvironment)
          throw new Error("an error occurred while fetching data");
        this.loading = true;
        getOrganisationQuery.queryParam.id = parseInt(this.$route.params.id);
        let org = await graphClient.executeQuery(getOrganisationQuery);
        if (org.organisation != null) {
          this.organisation = JSON.parse(JSON.stringify(org.organisation));
          this.error = false;
        }
        this.loading = false;
      } catch (e) {
        this.errors = e.message;
      }
    },
    goToEdit(id) {
      this.$router.push({ path: `/${id}/edit` });
    },
    previewRecord(id) {
      this.targetID = id;
      this.showOverlay = true;
    },
    goToRecord(id) {
      window.open("/" + id, "_blank");
    },
    hideOverlay() {
      this.showOverlay = false;
      this.targetID = null;
    },
    filterRecords() {
      const params = {
        organisations: encodeURIComponent(this.organisation.name.toLowerCase()),
      };
      this.$router.push({
        name: "search",
        query: params,
      });
    },
    getAltNames(org) {
      if (org.alternativeNames.length > 0) {
        return org.alternativeNames.join(", ");
      }
      return null;
    },
    formatUser(user) {
      if (user.orcid) {
        return `${user.username} (${user.orcid})`;
      } else {
        return user.username;
      }
    },
    getUserLink() {
      return process.env.VUE_APP_HOSTNAME + "users/";
    },
    orgUrl() {
      return process.env.VUE_APP_HOSTNAME + "organisations/";
    },
  },
};
</script>

<style scoped>
.card-class {
  min-width: 500px;
  overflow-x: scroll;
  overflow-y: hidden;
}
</style>
