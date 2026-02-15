<template>
  <v-container
    id="organisationPage"
    class="standard bg-grey-lighten-3 pb-10"
    fluid
  >
    <v-fade-transition>
      <div>
        <v-overlay
          v-model="loading"
          :absolute="false"
          class="align-center justify-center"
          opacity="0.8"
        >
          <loaders />
        </v-overlay>
      </div>
    </v-fade-transition>
    <div v-if="error && !loading">
      <NotFound />
    </div>
    <div v-else>
      <!-- new stuff below here -->
      <v-card
        :color="$vuetify.theme.themes.bg_organisation_record_card"
        class="pa-4 mt-2 ml-7 mr-7 d-flex flex-column overflow-initial"
        elevation="3"
        rounded="0"
        tile
        variant="outlined"
      >
        <SectionTitle title="Organisation" />
        <!-- TODO: This image refuses to go anywhere but centrally on the page -->
        <v-img
          v-if="logoUrl"
          :src="logoUrl"
          aspect-ratio="1"
          class="contain"
          height="120px"
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
              class="ma-1"
              variant="flat"
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
              class="ma-1"
              color="light-blue"
              variant="elevated"
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
              class="ma-1"
              color="light-blue"
              variant="elevated"
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
              class="ma-1"
              color="light-blue"
              variant="elevated"
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
              class="ma-1"
              variant="flat"
            >
              {{ country.name }}
            </v-chip>
          </p>
        </div>

        <!--- saved searches -->
        <div
          v-if="organisation.savedSearches && organisation.savedSearches.length"
          class="d-flex flex-row mt-4 align-center"
        >
          <b class="width-15-percent-flex">Saved Search</b>
          <div class="d-flex ml-md-12 ml-13">
            <v-chip
              v-for="search in organisation.savedSearches"
              :key="search.id"
              class="ma-1"
              variant="elevated"
            >
              <a :href="search.url" class="text-black">
                {{ search.name }}
              </a>
              <v-icon
                v-if="user().is_super_curator ? true : false"
                class="ml-4"
                color="error"
                end
                size="20"
                @click="confirmUnlinkSavedSearch(search)"
              >
                mdi-link-off
              </v-icon>
            </v-chip>
          </div>
        </div>

        <!-- ror link -->
        <p
          v-if="organisation.rorLink"
          class="d-flex flex-row mt-4 mb-0 align-center"
        >
          <img class="mr-1" src="/assets/icons/ror-icon-rbg-32.png" />
          <a :href="organisation.rorLink">
            {{ organisation.rorLink }}
          </a>
        </p>

        <!-- edit -->
        <p v-if="user().is_curator" class="mt-4">
          <v-btn class="bg-warning" @click="startEditing">
            Edit Organisation
          </v-btn>
          <v-btn class="bg-error ml-2" @click="confirmDeleteOrganisation">
            Delete Organisation
          </v-btn>
        </p>
      </v-card>

      <SearchOrganisationRecords
        id="searchOrganisationRecords"
        :organisation="organisation"
        class="mb-10 ma-4"
      />

      <v-col v-if="!loading" cols="12">
        <v-container class="py-0" fluid />

        <v-fade-transition>
          <div>
            <v-overlay
              v-model="loading"
              :absolute="false"
              class="align-center justify-center"
              opacity="0.8"
            >
              <loaders />
            </v-overlay>
          </div>
        </v-fade-transition>
      </v-col>
    </div>
    <!-- Edit existing organisation -->
    <v-dialog v-model="showEditDialog" height="100%">
      <v-form
        id="editOrganisation"
        ref="editOrganisation"
        v-model="editFormValid"
      >
        <v-card>
          <v-card-text>
            <v-container fluid>
              <v-row>
                <v-col class="pb-0" cols="12">
                  <v-text-field
                    v-model="editedOrganisation.name"
                    :rules="[rules.isRequired()]"
                    label="Name"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12">
                  <v-text-field
                    v-model="editedOrganisation.homepage"
                    :rules="[rules.isRequired(), rules.isURL()]"
                    label="Homepage"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12">
                  <v-text-field
                    v-model="editedOrganisation.rorLink"
                    :rules="[rules.isURL()]"
                    label="ROR Link"
                    variant="outlined"
                  />
                </v-col>
                <v-col class="pb-0" cols="12">
                  <v-text-field
                    v-model="editedOrganisation.alternativeNames"
                    :rules="[]"
                    item-text="name"
                    item-value="id"
                    label="Alternative names"
                    return-object
                    variant="outlined"
                  />
                </v-col>
                <!-- TODO insert parent and child organisations here -->
                <v-col class="pb-0" cols="12">
                  <v-autocomplete
                    v-model="editedOrganisation.types"
                    :items="organisationsTypes"
                    :rules="[rules.isRequired()]"
                    chips
                    clearable
                    closable-chips
                    item-title="name"
                    item-value="id"
                    label="Select an organisation type(s)"
                    multiple
                    return-object
                    variant="outlined"
                  >
                    <!-- autocomplete selected -->
                    <template #chip="{ props, item }">
                      <v-chip
                        :text="item.raw.name"
                        color="blue"
                        v-bind="props"
                        variant="flat"
                      ></v-chip>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col class="pb-0" cols="12">
                  <v-autocomplete
                    v-model="editedOrganisation.countries"
                    :items="countries"
                    :rules="[
                      editedOrganisation.countries &&
                        !(editedOrganisation.countries === 0),
                    ]"
                    item-title="name"
                    item-value="name"
                    label="Countries"
                    multiple
                    return-object
                    variant="outlined"
                  >
                    <template #prepend>
                      <v-tooltip
                        class="text-justify"
                        location="bottom"
                        max-width="300px"
                      >
                        <template #activator="{ props }">
                          <v-icon v-bind="props">
                            fas fa-question-circle
                          </v-icon>
                        </template>
                        {{ tooltips["countries"] }}
                      </v-tooltip>
                    </template>

                    <!-- Item selected -->
                    <template #chip="data">
                      <v-chip
                        class="bg-blue text-white removeStyle"
                        closable
                        @click:close="removeCountry(data.item.raw)"
                      >
                        {{ data.item.raw.name }}
                      </v-chip>
                    </template>

                    <!-- autocomplete data -->
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props">
                        <template #prepend>
                          <country-flag
                            v-if="item.raw.code !== null"
                            :country="item.raw.code"
                            class="mr-1 mt-n2"
                            size="normal"
                          />
                          <v-img
                            v-else
                            class="ml-4 mr-3"
                            src="@/assets/placeholders/country.png"
                          />
                        </template>
                        <span>{{ item.raw.name }}</span>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col class="pb-0" cols="12">
                  <v-file-input
                    v-model="editedOrganisation.logo"
                    :loading="logoLoading"
                    :rules="[rules.isImage(), imageSizeCorrect]"
                    accept="image/png,image/jpeg"
                    clearable
                    label="Logo"
                    prepend-icon="fas fa-image"
                  />
                  <span>JPEG or PNG, max. file size 3MB.</span>
                </v-col>
                <v-col class="pb-0" cols="12">
                  <v-img
                    v-if="logoUrl"
                    :src="logoUrl"
                    aspect-ratio="1"
                    class="contain"
                    height="120px"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              class="bg-error"
              variant="elevated"
              width="200"
              @click="showEditDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="!editFormValid || imageTooBig"
              class="bg-success"
              variant="elevated"
              width="200"
              @click="editOrganisation()"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <!-- Delete dialog box -->
    <v-dialog v-model="confirmDelete" max-width="500px" persistent>
      <!-- Delete organisation -->
      <v-card v-if="deleteOrganisationCard">
        <v-card-title class="text-h5 font-weight-bold">
          Deleting organisation!</v-card-title
        >
        <v-card-text class="font-weight-bold">
          Are you sure you want to do that? It will be permanently deleted.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="bg-info text-white"
            variant="elevated"
            @click="deleteOrganisation(false)"
          >
            Cancel
          </v-btn>
          <v-btn
            class="bg-error text-white"
            variant="elevated"
            @click="deleteOrganisation(true)"
          >
            Delete
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
      <!-- Unlink saved search -->
      <v-card v-if="unlinkSavedSearchCard">
        <v-card-title class="text-h5"> Unlinking saved search</v-card-title>
        <v-card-text
          >This will unlink the saved search from this organisation.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="bg-grey-darken-1 text-white"
            @click="unlinkSavedSearch(false)"
          >
            Cancel
          </v-btn>
          <v-btn
            :loading="deleteLoader"
            class="bg-success text-white"
            @click="unlinkSavedSearch(true)"
          >
            OK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

import Loaders from "@/components/Navigation/Loaders";
import SearchOrganisationRecords from "@/components/Organisations/SearchOrganisationRecords.vue";
import SectionTitle from "@/components/Records/Record/SectionTitle.vue";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getOrganisationQuery from "@/lib/GraphClient/queries/Organisations/getOrganisation.json";
import saveSearch from "@/store";
import { isImage, isRequired, isUrl } from "@/utils/rules.js";
import stringUtils from "@/utils/stringUtils";
import NotFound from "@/views/Errors/404";
import RestClient from "@/lib/Client/RESTClient.js";
import { toBase64 } from "@/utils/generalUtils";
import CountryFlag from "vue-country-flag-next";

let graphClient = new GraphClient();

const restClient = new RestClient();

export default {
  name: "Organisation",
  components: {
    CountryFlag,
    SearchOrganisationRecords,
    SectionTitle,
    NotFound,
    Loaders,
  },
  mixins: [stringUtils],
  data: () => {
    return {
      error: true,
      allowedFileSize: 3145728,
      organisation: {
        alternativeNames: [],
        types: [],
        users: [],
        parentOrganisations: [],
        childOrganisations: [],
        countries: [],
      },
      editedOrganisation: {
        name: "",
        homepage: "",
        types: [],
        logo: null,
        countries: [],
        rorLink: [],
        alternativeNames: [],
        parentOrganisations: [],
        childOrganisations: [],
      },
      loading: false,
      logoLoading: false,
      imageTooBig: true,
      perPage: 10,
      footer: { "items-per-page-options": [10] },
      showOverlay: false,
      targetID: null,
      testEnvironment: false,
      headers: [
        { title: "Name", value: "name", align: "center" },
        { title: "Status", value: "status", align: "center" },
        { title: "Relation", value: "relation", align: "center" },
        { title: "Grant", value: "grant", align: "center" },
        {
          title: "Actions",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
      userHeaders: [
        { title: "Username", value: "username", align: "center" },
        { title: "Email address", value: "email", align: "center" },
        { title: "ORCID ID", value: "orcid", align: "center" },
        { title: "Twitter", value: "twitter", align: "center" },
      ],
      showEditDialog: false,
      editFormValid: false,
      rules: {
        isRequired: function () {
          return isRequired();
        },
        isURL: function () {
          return isUrl();
        },
        isImage: function () {
          return isImage();
        },
      },
      confirmDelete: false,
      deleteOrganisationCard: false,
      unlinkSavedSearchCard: false,
      selectedItem: {},
      deleteLoader: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    ...mapState("editor", ["organisationsTypes", "countries", "tooltips"]),
    currentRoute() {
      return this.$route.params["id"];
    },
    logoUrl() {
      if (this.organisation.urlForLogo) {
        return import.meta.env.VITE_API_ENDPOINT + this.organisation.urlForLogo;
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
  async mounted() {
    await Promise.all([
      await this.getOrganisationsTypes(),
      await this.getCountries(),
    ]);
  },
  methods: {
    ...mapActions("editor", ["getOrganisationsTypes", "getCountries"]),
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
          this.editedOrganisation.name = this.organisation.name;
          this.editedOrganisation.homepage = this.organisation.homepage;
          this.editedOrganisation.rorLink = this.organisation.rorLink;
          this.editedOrganisation.countries = this.organisation.countries;
          // In Vuetify 3, text fields usually expect a string, not an array of objects
          this.editedOrganisation.alternativeNames = this.organisation
            .alternativeNames
            ? this.organisation.alternativeNames.join(", ")
            : "";
          this.error = false;
          this.error = false;
        }
        this.loading = false;
      }
      catch (e) {
        this.errors = e.message;
        this.loading = false;
      }
    },
    async editOrganisation() {
      // TODO complete organisation input
      // A Ruby-style map would be better here. Please feel free to refactor if you know how! ;-)
      let type_ids = [];
      this.editedOrganisation.types.forEach((type) => {
        type_ids.push(type.id);
      });
      let country_ids = [];
      if (this.editedOrganisation.countries) {
        this.editedOrganisation.countries.forEach((country) => {
          country_ids.push(country.id);
        });
      }
      let alt_names;
      try {
        alt_names = this.editedOrganisation.alternativeNames
          .split(",")
          .map((item) => item.trim());
      }
      catch {
        alt_names = [];
      }
      this.logoLoading = true;
      let organisationInput = {
        name: this.editedOrganisation.name,
        homepage: this.editedOrganisation.homepage,
        organisation_type_ids: type_ids,
        country_ids: country_ids,
        ror_link: this.editedOrganisation.rorLink,
        alternative_names: alt_names,
      };

      if (this.editedOrganisation.logo) {
        let convertedFile = await toBase64(this.editedOrganisation.logo);
        organisationInput.logo = {
          filename: this.editedOrganisation.logo.name,
          content_type: this.editedOrganisation.logo.type,
          data: convertedFile,
        };
      }
      let data = await restClient.editOrganisation(
        organisationInput,
        this.organisation.id,
        this.user().credentials.token,
      );
      if (!data.error) {
        // Reload to get the new data.
        await this.getOrganisation();
        this.showEditDialog = false;
      }
      this.logoLoading = false;
    },
    imageSizeCorrect() {
      if (!this.editedOrganisation.logo) {
        this.imageTooBig = false;
        return true;
      }
      if (this.editedOrganisation.logo.size < this.allowedFileSize) {
        this.imageTooBig = false;
        return true;
      }
      this.$emit("imageTooBig", true);
      this.imageTooBig = true;
      return "Image is too large (max 3MB).";
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
      if (org.alternativeNames && org.alternativeNames.length > 0) {
        return org.alternativeNames.join(", ");
      }
      return null;
    },
    formatUser(user) {
      if (user.orcid) {
        return `${user.username} (${user.orcid})`;
      }
      else {
        return user.username;
      }
    },
    getUserLink() {
      return import.meta.env.VITE_HOSTNAME + "users/";
    },
    orgUrl() {
      return import.meta.env.VITE_HOSTNAME + "organisations/";
    },
    removeType(type) {
      this.editedOrganisation.types = this.editedOrganisation.types.filter(
        (obj) => obj.label !== type.name && obj.id !== type.id,
      );
    },
    removeCountry(country) {
      this.editedOrganisation.countries =
        this.editedOrganisation.countries.filter(
          (obj) => obj.label !== country.name && obj.id !== country.id,
        );
    },
    async startEditing() {
      this.loading = true;
      this.showEditDialog = true;
      // await this.getOrganisationsTypes();
      this.editedOrganisation.types = this.organisationsTypes.filter(
        (obj) => this.organisation.types.indexOf(obj.name) > -1,
      );
      // await this.getCountries();
      this.loading = false;
    },

    /**
     * Confirmation dialog to delete the organisation
     */
    confirmDeleteOrganisation() {
      this.confirmDelete = true;
      this.deleteOrganisationCard = true;
      this.unlinkSavedSearchCard = false;
    },
    /**
     * Delete the organisation and redirect to organisation search page after deletion
     * @param del - Boolean
     */
    async deleteOrganisation(del) {
      this.unlinkSavedSearchCard = false;
      if (del) {
        let data = await restClient.deleteOrganisation(
          this.organisation.id,
          this.user().credentials.token,
        );

        if (!data.error) {
          // Redirects to organisations page.
          window.location.pathname = "/organisations";
        }
      }
      this.deleteOrganisationCard = false;
      this.confirmDelete = false;
    },

    /**
     * Confirmation dialog to unlink the saved search
     */
    confirmUnlinkSavedSearch(item) {
      this.selectedItem = item;
      this.confirmDelete = true;
      this.deleteOrganisationCard = false;
      this.unlinkSavedSearchCard = true;
    },
    /**
     * Unlink the saved search
     * @param del - Boolean
     */
    async unlinkSavedSearch(del) {
      this.deleteOrganisationCard = false;
      if (del) {
        this.deleteLoader = true;
        //Filter the currentOrganisation to unlink
        let linkOrganisation = this.selectedItem.organisations.filter(
          ({ id }) => id !== this.organisation.id,
        );

        //Array of id of the remaining organisation
        linkOrganisation = linkOrganisation.map(({ id }) => id);
        let saveSearchObj = {
          organisation_ids: linkOrganisation,
        };

        let updatedSearchResult = await restClient.updateSaveSearch(
          this.selectedItem["id"],
          saveSearchObj,
          this.user().credentials.token,
        );
        //Commit the updated result to store
        saveSearch.commit(
          "saveSearch/setSaveSearchResult",
          updatedSearchResult,
        );
        await this.getOrganisation();
      }
      this.deleteLoader = false;
      this.unlinkSavedSearchCard = false;
      this.confirmDelete = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-class {
  min-width: 500px;
  overflow-x: scroll;
  overflow-y: hidden;
}

:deep(.v-list-item-title) {
  display: none;
}
</style>
