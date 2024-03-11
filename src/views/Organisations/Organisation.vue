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
        <!-- TODO: This image refuses to go anywhere but centrally on the page -->
        <v-img
          v-if="logoUrl"
          :src="logoUrl"
          contain
          aspect-ratio="1"
          height="120px"
        />
        <h2
          class="mt-3"
        >
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
          <a
            :href="organisation.rorLink"
          >
            {{ organisation.rorLink }}
          </a>
        </p>

        <!-- edit -->
        <p
          v-if="user().is_curator"
        >
          <v-btn
            class="warning"
            @click="startEditing"
          >
            Edit Organisation
          </v-btn>
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
    <!-- Edit existing organisation -->
    <v-expand-transition>
      <v-overlay
        v-if="showEditDialog"
        :dark="false"
        :absolute="false"
        opacity="0.8"
      >
        <v-form
          id="editOrganisation"
          ref="editOrganisation"
          v-model="editFormValid"
        >
          <v-card>
            <v-card-text>
              <v-container fluid>
                <v-row>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="editedOrganisation.name"
                      label="Name"
                      outlined
                      :rules="[rules.isRequired()]"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="editedOrganisation.homepage"
                      label="Homepage"
                      outlined
                      :rules="[rules.isRequired(), rules.isURL()]"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="editedOrganisation.rorLink"
                      label="ROR Link"
                      outlined
                      :rules="[rules.isURL()]"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <v-autocomplete
                      v-model="editedOrganisation.types"
                      :items="organisationsTypes"
                      multiple
                      outlined
                      item-text="name"
                      item-value="id"
                      return-object
                      label="Select an organisation type(s)"
                      :rules="[rules.isRequired()]"
                    >
                      <!-- autocomplete selected -->
                      <template #selection="data">
                        <v-chip
                          class="blue white--text removeStyle"
                          close
                          @click:close="removeType(data.item)"
                        >
                          {{ data.item.name }}
                        </v-chip>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <v-file-input
                      v-model="editedOrganisation.logo"
                      :rules="[rules.isImage(), imageSizeCorrect]"
                      clearable
                      :loading="logoLoading"
                      accept="images/png,image/jpeg"
                      label="Logo"
                      prepend-icon="fa-image"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="error"
                @click="showEditDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                class="success"
                :disabled="!editFormValid || imageTooBig"
                @click="editOrganisation()"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-overlay>
    </v-expand-transition>
  </v-container>
</template>

<script>
import {mapActions, mapState} from "vuex";

import Loaders from "@/components/Navigation/Loaders";
import SearchOrganisationRecords from "@/components/Organisations/SearchOrganisationRecords.vue";
import SectionTitle from "@/components/Records/Record/SectionTitle.vue";
import GraphClient from "@/lib/GraphClient/GraphClient.js"
import getOrganisationQuery from "@/lib/GraphClient/queries/Organisations/getOrganisation.json"
import { isImage, isRequired, isUrl } from "@/utils/rules.js"
import { cleanString } from "@/utils/stringUtils"
import NotFound from "@/views/Errors/404"

let graphClient = new GraphClient();
import RestClient from "@/lib/Client/RESTClient.js"
import {toBase64} from "@/utils/generalUtils";

const restClient = new RestClient();

export default {
  name: "Organisation",
  components: {SearchOrganisationRecords, SectionTitle, NotFound, Loaders},
  mixins: [cleanString],
  data: () => {
    return {
      error: true,
      allowedFileSize: 1048576,
      organisation: {
        alternativeNames: [],
        types: [],
        users: [],
        parentOrganisations: [],
        childOrganisations: [],
        countries: []
      },
      editedOrganisation: {
        name: '',
        homepage: '',
        types: [],
        logo: null,
        alternativeNames: [],
        parentOrganisations: [],
        childOrganisations: [],
        countries: [],
        rorLink: []
      },
      loading: false,
      logoLoading: false,
      imageTooBig: true,
      perPage: 10,
      footer: {'items-per-page-options': [10]},
      showOverlay: false,
      targetID: null,
      testEnvironment: false,
      headers: [
        {text: 'Name', value: 'name', align: 'center'},
        {text: 'Status', value: 'status', align: 'center'},
        {text: 'Relation', value: 'relation', align: 'center'},
        {text: 'Grant', value: 'grant', align: 'center'},
        {text: 'Actions', value: 'actions', align: 'center', sortable: false}
      ],
      userHeaders: [
        {text: 'Username', value: 'username', align: 'center'},
        {text: 'Email address', value: 'email', align: 'center'},
        {text: 'ORCID ID', value: 'orcid', align: 'center'},
        {text: 'Twitter', value: 'twitter', align: 'center'},
      ],
      showEditDialog: false,
      editFormValid: false,
      rules: {
        isRequired: function(){return isRequired() },
        isURL: function(){ return isUrl() },
        isImage: function(){ return isImage() }
      },
    }
  },
  computed: {
    ...mapState('users', ['user']),
    ...mapState("editor", ["organisationsTypes"]),
    currentRoute() {
      return this.$route.params['id'];
    },
    logoUrl() {
      if (this.organisation.urlForLogo) {
        return process.env.VUE_APP_API_ENDPOINT + this.organisation.urlForLogo;
      }
      return null;
    }
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
    ...mapActions("editor", ["getOrganisationsTypes"]),
    async getOrganisation() {
      try {
        // testEnvironment variable is only for test case.
        if (this.testEnvironment) throw new Error("an error occurred while fetching data")
        this.loading = true;
        getOrganisationQuery.queryParam.id = parseInt(this.$route.params.id);
        let org = await graphClient.executeQuery(getOrganisationQuery);
        if (org.organisation != null) {
          this.organisation = JSON.parse(JSON.stringify(org.organisation));
          this.editedOrganisation.name = this.organisation.name;
          this.editedOrganisation.homepage = this.organisation.homepage;
          this.editedOrganisation.rorLink = this.organisation.rorLink;
          this.error = false;
        }
        this.loading = false;
      } catch (e) {
        this.errors = e.message;
      }
    },
    async editOrganisation() {
      // TODO complete organisation input
      // A Ruby-style map would be better here. Please feel free to refactor if you know how! ;-)
      let type_ids = []
      this.editedOrganisation.types.forEach((type) => {
        type_ids.push(type.id)
      })
      this.logoLoading = true;
      let organisationInput = {
        name: this.editedOrganisation.name,
        homepage: this.editedOrganisation.homepage,
        organisation_type_ids: type_ids,
        ror_link: this.editedOrganisation.rorLink
      }
      if (this.editedOrganisation.logo) {
        let convertedFile = await toBase64(this.editedOrganisation.logo);
        organisationInput.logo = {
          filename: this.editedOrganisation.logo.name,
          content_type: this.editedOrganisation.logo.type,
          data: convertedFile
        }
      }
      let data = await restClient.editOrganisation(organisationInput, this.organisation.id, this.user().credentials.token);
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
      this.$emit('imageTooBig', true);
      this.imageTooBig = true;
      return false;
    },
    goToEdit(id) {
      this.$router.push({path: `/${id}/edit`})
    },
    previewRecord(id) {
      this.targetID = id;
      this.showOverlay = true;
    },
    goToRecord(id) {
      window.open("/" + id, '_blank');
    },
    hideOverlay() {
      this.showOverlay = false;
      this.targetID = null;
    },
    filterRecords() {
      const params = {organisations: encodeURIComponent(this.organisation.name.toLowerCase())}
      this.$router.push({
        name: 'search',
        query: params
      });
    },
    getAltNames(org) {
      if (org.alternativeNames.length > 0) {
        return org.alternativeNames.join(', ');
      }
      return null;
    },
    formatUser(user) {
      if (user.orcid) {
        return `${user.username} (${user.orcid})`
      }
      else {
        return user.username;
      }
    },
    getUserLink() {
      return process.env.VUE_APP_HOSTNAME + 'users/'
    },
    orgUrl() {
      return process.env.VUE_APP_HOSTNAME + 'organisations/'
    },
    removeType(type) {
      this.editedOrganisation.types = this.editedOrganisation.types.filter(obj =>
          obj.label !== type.name && obj.id !== type.id
      );
    },
    async startEditing() {
      this.showEditDialog = true;
      await this.getOrganisationsTypes();
      this.editedOrganisation.types = this.organisationsTypes.filter(obj =>
          this.organisation.types.indexOf(obj.name) > -1
      );
    }
  }
}
</script>

<style scoped>
.card-class {
  min-width: 500px;
  overflow-x: scroll;
  overflow-y: hidden;
}
</style>
