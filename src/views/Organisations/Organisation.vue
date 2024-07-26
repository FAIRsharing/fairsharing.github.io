<template>
  <v-container
    id="organisationPage"
    fluid
    class="standard grey lighten-3 pb-10"
  >
    <Loaders
      v-if="loading"
    />
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
              variant="elevated"
              :close="user().is_super_curator? true:false"
              close-icon="mdi-link-off"
              class="ma-1"
              @click:close="confirmUnlinkSavedSearch(search)"
            >
              <a
                class="black--text"
                :href="search.url"
              >
                {{ search.name }}
              </a>
            </v-chip>
          </div>
        </div>

        
        <!-- ror link -->
        <p
          v-if="organisation.rorLink"
          class="d-flex flex-row mt-4 mb-0 align-center"
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
          class="mt-4"
        >
          <v-btn
            class="warning"
            @click="startEditing"
          >
            Edit Organisation
          </v-btn>
          <v-btn
            class="error ml-2"
            @click="confirmDeleteOrganisation"
          >
            Delete Organisation
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
      <v-dialog
        v-model="showEditDialog"
        height="100%"
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
                    <v-text-field
                      v-model="editedOrganisation.alternativeNames"
                      outlined
                      item-text="name"
                      item-value="id"
                      return-object
                      label="Alternative names"
                      :rules="[]"
                    />
                  </v-col>
                  <!-- TODO insert parent and child organisations here -->
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
                    <v-autocomplete
                      v-model="editedOrganisation.countries"
                      label="Countries"
                      :items="countries"
                      item-text="name"
                      item-value="name"
                      multiple
                      outlined
                      return-object
                      :rules="[editedOrganisation.countries &&
                        !(editedOrganisation.countries === 0)]"
                    >
                      <template #prepend>
                        <v-tooltip
                          bottom
                          max-width="300px"
                          class="text-justify"
                        >
                          <template #activator="{ on }">
                            <v-icon v-on="on">
                              fa-question-circle
                            </v-icon>
                          </template>
                          {{ tooltips['countries'] }}
                        </v-tooltip>
                      </template>

                      <!-- autocomplete selected -->
                      <template #selection="data">
                        <v-chip
                          class="blue white--text removeStyle"
                          close
                          @click:close="removeCountry( data.item )"
                        >
                          {{ data.item.name }}
                        </v-chip>
                      </template>

                      <!-- autocomplete data -->
                      <template #item="data">
                        <country-flag
                          v-if="data.item.code !== null"
                          :country="data.item.code"
                          size="normal"
                        />
                        <img
                          v-else
                          src="@/assets/placeholders/country.png"
                          class="ml-4 mr-3"
                        >
                        <div> {{ data.item.name }} </div>
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
                    <span>JPEG or PNG, max. file size 3MB.</span>
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <v-img
                      v-if="logoUrl"
                      :src="logoUrl"
                      contain
                      aspect-ratio="1"
                      height="120px"
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
      </v-dialog>
    </v-expand-transition>
    <!-- Delete dialog box -->
    <v-dialog
      v-model="confirmDelete"
      max-width="700px"
      persistent
    >
      <!-- Delete organisation -->
      <v-card v-if="deleteOrganisationCard">
        <v-card-title
          class="headline"
        >
          Deleting organisation!
        </v-card-title>
        <v-card-text>
          <p>
            <b>Are you sure you want to do that? It will be permanently deleted.</b>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="info"
            @click="deleteOrganisation(false)"
          >
            Cancel
          </v-btn>
          <v-btn
            class="error"
            @click="deleteOrganisation(true)"
          >
            Delete
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
      <!-- Unlink saved search -->
      <v-card v-if="unlinkSavedSearchCard">
        <v-card-title class="text-h5">
          Unlinking saved search
        </v-card-title>
        <v-card-text>This is will unlink saved search from this organisaton</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="white--text"
            color="accent3"
            @click="unlinkSavedSearch(false)"
          >
            Cancel
          </v-btn>
          <v-btn
            class="white--text"
            color="success"
            :loading="deleteLoader"
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
import {mapActions, mapState} from "vuex";

import Loaders from "@/components/Navigation/Loaders";
import SearchOrganisationRecords from "@/components/Organisations/SearchOrganisationRecords.vue";
import SectionTitle from "@/components/Records/Record/SectionTitle.vue";
import GraphClient from "@/lib/GraphClient/GraphClient.js"
import getOrganisationQuery from "@/lib/GraphClient/queries/Organisations/getOrganisation.json"
import saveSearch from "@/store";
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
      allowedFileSize: 3145728,
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
      confirmDelete: false,
      deleteOrganisationCard: false,
      unlinkSavedSearchCard: false,
      selectedItem: {},
      deleteLoader: false
    }
  },
  computed: {
    ...mapState('users', ['user']),
    ...mapState("editor", ["organisationsTypes", "countries", "tooltips"]),
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
    ...mapActions("editor", ["getOrganisationsTypes", "getCountries"]),
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
          this.editedOrganisation.countries = this.organisation.countries;
          this.editedOrganisation.alternativeNames = this.organisation.alternativeNames;
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
      let country_ids = []
      this.editedOrganisation.countries.forEach((country) => {
        country_ids.push(country.id)
      })
      let alt_names;
      try {
        alt_names = this.editedOrganisation.alternativeNames.split(',');
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
        alternative_names: alt_names
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
    removeCountry(country) {
      this.editedOrganisation.countries = this.editedOrganisation.countries.filter(obj =>
          obj.label !== country.name && obj.id !== country.id
      );
    },
    async startEditing() {
      this.loading = true;
      this.showEditDialog = true;
      await this.getOrganisationsTypes();
      this.editedOrganisation.types = this.organisationsTypes.filter(obj =>
          this.organisation.types.indexOf(obj.name) > -1
      );
      await this.getCountries();
      this.loading = false;
    },

    /**
     * Confirmation dialog to delete the organisation
     */
    confirmDeleteOrganisation(){
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
        let data = await restClient.deleteOrganisation(this.organisation.id, this.user().credentials.token);

        if (!data.error) {
          // Redirects to organisations page.
          window.location.pathname = '/organisations'
        }
      }
      this.deleteOrganisationCard = false;
      this.confirmDelete = false;
    },

    /**
     * Confirmation dialog to unlink the saved search
     */
    confirmUnlinkSavedSearch(item){
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
        let linkOrganisation = this.organisation.savedSearches
            .filter(({id}) => id !== this.selectedItem.id);

        //Array of id of the remaining organisation
        linkOrganisation = linkOrganisation.map(({id}) => id)
        let saveSearchObj = {
          organisation_ids: linkOrganisation,
        };

        let updatedSearchResult = await restClient.updateSaveSearch(
            this.selectedItem["id"],
            saveSearchObj,
            this.user().credentials.token
        );
        //Commit the updated result to store
        saveSearch.commit("saveSearch/setSaveSearchResult", updatedSearchResult);
          await this.getOrganisation();
      }
      this.deleteLoader = false;
      this.unlinkSavedSearchCard = false;
      this.confirmDelete = false;
    },
  },


}
</script>

<style scoped>
.card-class {
  min-width: 500px;
  overflow-x: scroll;
  overflow-y: hidden;
}
</style>