<template>
  <v-overlay
    v-model="editOrganisationLink.showOverlay"
    :absolute="false"
    opacity="0.8"
    class="align-center justify-center"
  >
    <v-form
      id="editOrganisationLink"
      ref="editOrganisationLink"
      v-model="formValid"
      class="full-width"
    >
      <v-card
        key="edit"
        class="flexCard text-black full-width"
        height="100%"
        width="1000"
        :class="{
          'bg-grey-lighten-0': menus.show,
          'bg-grey-lighten-3': !menus.show,
        }"
      >
        <v-card-title class="bg-green text-white">
          <span v-if="editOrganisationLink.id > -1"> Edit relationship </span>
          <span v-else> Create a new relationship </span>
        </v-card-title>
        <v-card-text class="pt-3">
          <!-- ORGANISATIONS -->
          <div>
            <v-card
              class="d-flex flex-row bg-transparent elevation-0"
              :disabled="!!menus.show"
            >
              <v-autocomplete
                v-model="editOrganisationLink.data.organisation"
                :items="organisations"
                :custom-filter="customFilter"
                item-title="name"
                item-value="id"
                variant="outlined"
                color="primary"
                return-object
                class="text-capitalize mt-2"
                chips
                label="Select an organisation"
                :rules="[rules.isRequired()]"
              >
                <template #chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :text="item.raw.name"
                    color="blue"
                    variant="flat"
                  ></v-chip>
                </template>
                <template #item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    class="mb-2"
                    style="max-width: 870px"
                  >
                    <template #prepend>
                      <v-avatar class="mr-4">
                        <img
                          v-if="item.raw['urlForLogo']"
                          :src="fairSharingEndpoint + item.raw['urlForLogo']"
                        />
                        <v-icon v-else> fas fa-sitemap </v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-subtitle>
                      {{ item.raw.homepage }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle v-if="item.raw.types.length > 0">
                      Types: {{ item.raw.types.join(", ") }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-autocomplete>
              <div class="mt-2 ml-2">
                <v-btn
                  class="bg-green text-white mt-2"
                  @click="addNewOrganisation"
                >
                  <v-icon size="medium"> fas fa-plus </v-icon>
                  <span class="ml-1">Add New</span>
                </v-btn>
              </div>
            </v-card>
            <v-card
              v-if="menus.show === 'organisation'"
              class="elevation-0 bg-grey-lighten-3 mb-10 pb-3 px-3"
              style="border: 2px dashed grey !important; border-radius: 5px"
            >
              <v-card-title>Create a new organisation</v-card-title>
              <v-card-text v-if="menus.newOrganisation.error" class="mb-0 pb-0">
                <v-alert type="error" class="mb-0">
                  {{ menus.newOrganisation.error.response.data }}
                </v-alert>
              </v-card-text>
              <v-card-text v-if="!validName" class="mb-0 pb-0">
                <v-alert type="error" class="mb-0">
                  No matching organisation found.
                </v-alert>
              </v-card-text>
              <v-card-text v-if="!enterName" class="mb-0 pb-0">
                <v-alert type="success" class="mb-0">
                  Select an organisation
                </v-alert>
              </v-card-text>
              <!-- new organisation -->
              <v-card-text>
                <v-form
                  id="createNewOrganisation"
                  ref="createNewOrganisation"
                  v-model="menus.newOrganisation.formValid"
                >
                  <v-container fluid>
                    <v-row>
                      <v-col cols="12" class="pb-0">
                        <!-- Enter name of organisation -->
                        <v-text-field
                          v-if="enterName"
                          v-model="menus.newOrganisation.data.name"
                          label="Organisation Name"
                          variant="outlined"
                          :rules="[rules.isRequired()]"
                          @keydown="validName = true"
                        />
                        <v-autocomplete
                          v-else
                          v-model="menus.newOrganisation.selectOrganisation"
                          :items="organisationsList"
                          variant="outlined"
                          item-title="name"
                          item-value="id"
                          return-object
                          label="Select an organisation"
                          :rules="[rules.isRequired()]"
                          @update:model-value="selectOrganisationFromList()"
                        />
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-text-field
                          v-model="menus.newOrganisation.data.homepage"
                          label="Organisation Homepage"
                          variant="outlined"
                          :rules="[rules.isRequired(), rules.isURL()]"
                        />
                      </v-col>
                      <v-col cols="12" class="pb-0">
                        <v-autocomplete
                          v-model="
                            menus.newOrganisation.data.organisation_type_ids
                          "
                          :items="organisationsTypes"
                          multiple
                          variant="outlined"
                          item-title="name"
                          item-value="id"
                          return-object
                          label="Select an organisation type(s)"
                          :rules="[rules.isRequired()]"
                          clearable
                          closable-chips
                          chips
                        >
                          <template #chip="{ props, item }">
                            <v-chip
                              v-bind="props"
                              :text="item.raw.title"
                              color="blue"
                              variant="flat"
                            ></v-chip>
                          </template>
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-file-input
                          v-model="menus.newOrganisation.data.logo"
                          :rules="[rules.isImage(), imageSizeCorrect]"
                          clearable
                          :loading="logoLoading"
                          accept="image/png,image/jpeg"
                          label="Organisation Logo"
                          show-size
                          counter
                          prepend-inner-icon="fas fa-image"
                          variant="outlined"
                        />
                        <span class="ml-10"
                          >JPEG or PNG, max. file size 3MB.</span
                        >
                      </v-col>
                      <!-- countries -->
                      <v-col cols="12" class="pb-0">
                        <v-autocomplete
                          v-model="menus.newOrganisation.data.country_ids"
                          label="Countries"
                          chips
                          clearable
                          closable-chips
                          :items="countries"
                          item-title="name"
                          item-value="name"
                          multiple
                          variant="outlined"
                          return-object
                          :rules="[
                            menus.newOrganisation.data.country_ids &&
                              !(
                                menus.newOrganisation.data.country_ids
                                  .length === 0
                              ),
                          ]"
                        >
                          <template #prepend>
                            <v-tooltip
                              location="bottom"
                              max-width="300px"
                              class="text-justify"
                            >
                              <template #activator="{ props }">
                                <v-icon v-bind="props">
                                  fas fa-question-circle
                                </v-icon>
                              </template>
                              {{ tooltips["countries"] }}
                            </v-tooltip>
                          </template>
                          <!-- autocomplete selected -->
                          <template #chip="{ props, item }">
                            <v-chip
                              v-bind="props"
                              :text="item.raw.name"
                              color="blue"
                              variant="flat"
                            ></v-chip>
                          </template>

                          <!-- autocomplete data -->
                          <template #item="{ props, item }">
                            <v-list-item v-bind="props">
                              <template #prepend>
                                <v-avatar class="mt-n3">
                                  <country-flag
                                    v-if="item.raw.code !== null"
                                    :country="item.raw.code"
                                    size="normal"
                                  />
                                  <img
                                    v-else
                                    src="@/assets/placeholders/country.png"
                                  />
                                </v-avatar>
                              </template>
                            </v-list-item>
                          </template>
                        </v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-tooltip location="bottom">
                  <template #activator="{ props }">
                    <v-btn
                      class="bg-green"
                      :disabled="importROR"
                      :loading="menus.newOrganisation.rorLoader"
                      v-bind="props"
                      variant="elevated"
                      @click="getOrganisations()"
                    >
                      Import from ROR
                    </v-btn>
                  </template>
                  {{ tooltips["ror_import"] }}
                </v-tooltip>
                <v-spacer />
                <v-btn
                  class="bg-warning"
                  variant="elevated"
                  @click="clearForm()"
                >
                  Clear Form
                </v-btn>
                <v-btn
                  class="bg-success"
                  variant="elevated"
                  :disabled="!menus.newOrganisation.formValid"
                  :loading="menus.newOrganisation.loading"
                  @click="createNewOrganisation()"
                >
                  Save new organisation
                </v-btn>
                <v-btn
                  class="bg-error"
                  variant="elevated"
                  @click="menus.show = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>

          <!-- RELATIONSHIP -->
          <div class="mb-3">
            <v-card
              class="d-flex flex-row bg-transparent elevation-0"
              :disabled="!!menus.show"
            >
              <v-autocomplete
                v-model="editOrganisationLink.data.relation"
                :items="organisationsRelations"
                variant="outlined"
                label="Select a type of relationship"
                :disabled="!!menus.show"
                class="mt-4"
                chips
                color="primary"
                :rules="[rules.isRequired()]"
              >
                <template #chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :text="cleanString(item.title)"
                    color="blue"
                    variant="flat"
                    class="text-capitalize"
                  ></v-chip>
                </template>
              </v-autocomplete>
            </v-card>
          </div>
          <!-- GRANT -->
          <div v-if="editOrganisationLink.data.relation === 'funds'">
            <v-card
              class="d-flex flex-row bg-transparent elevation-0 align-center"
              :disabled="!!menus.show"
            >
              <v-autocomplete
                v-model="editOrganisationLink.data.grant"
                :items="grants"
                item-title="name"
                item-value="id"
                variant="outlined"
                return-object
                class="mt-2"
                label="Select an optional grant for funding organisations"
              >
                <template #chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :text="item.raw.name"
                    color="blue"
                    variant="flat"
                  ></v-chip>
                </template>
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-avatar>
                        <v-icon>fas fa-funnel-dollar</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-subtitle>
                      {{ item.raw.description }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </template>
              </v-autocomplete>
              <v-btn
                class="bg-green text-white mt-n4 ml-2"
                @click="menus.show = 'grant'"
              >
                <v-icon size="small"> fas fa-plus </v-icon>
              </v-btn>
            </v-card>
            <v-card
              v-if="menus.show === 'grant'"
              class="elevation-0 bg-grey-lighten-3 mb-10 pb-3 px-3"
              style="border: 2px dashed grey !important; border-radius: 5px"
            >
              <v-card-title>Create a new grant</v-card-title>
              <v-card-text v-if="menus.newGrant.error" class="mb-0 pb-0">
                <v-alert type="error" class="mb-0">
                  {{ menus.newGrant.error.response.data }}
                </v-alert>
              </v-card-text>
              <v-card-text>
                <v-form
                  id="createNewGrant"
                  ref="createNewGrant"
                  v-model="menus.newGrant.formValid"
                >
                  <v-text-field
                    v-model="menus.newGrant.data.name"
                    label="Grant Name"
                    variant="outlined"
                    :rules="[rules.isRequired()]"
                  />
                  <v-text-field
                    v-model="menus.newGrant.data.description"
                    label="Grant Description"
                    variant="outlined"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  class="bg-success"
                  :disabled="!menus.newGrant.formValid"
                  :loading="menus.newGrant.loading"
                  @click="createNewGrant()"
                >
                  Save new grant
                </v-btn>
                <v-btn class="bg-error" @click="menus.show = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="bg-success"
            :disabled="!!menus.show || !formValid"
            @click="confirmModifications()"
          >
            Confirm
          </v-btn>
          <v-btn class="bg-error" @click="hideMenu()"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-overlay>
</template>

<script>
import CountryFlag from "vue-country-flag-next";
import { mapGetters, mapState } from "vuex";

import PublicationClient from "@/lib/Client/ExternalClients.js";
import RestClient from "@/lib/Client/RESTClient.js";
import { toBase64 } from "@/utils/generalUtils";
import { isImage, isRequired, isUrl } from "@/utils/rules.js";
import { capitalize } from "lodash";
const restClient = new RestClient();
const pubClient = new PublicationClient();
import stringUtils from "@/utils/stringUtils";

export default {
  name: "LinkOverlay",
  components: { CountryFlag },
  mixins: [stringUtils],
  data() {
    return {
      formValid: false,
      allowedFileSize: 3145728,
      imageTooBig: false,
      logoLoading: false,
      menus: {
        show: false,
        newOrganisation: {
          data: {
            organisation_type_ids: [],
            country_ids: [],
            parent_ror_links: [],
            child_ror_links: [],
            logo: null,
          },
          loading: false,
          formValid: false,
          logoData: null,
          error: false,
          selectOrganisation: null,
          rorLoader: false,
        },
        newGrant: {
          data: {},
          formValid: false,
          loading: false,
          error: false,
        },
      },
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
      organisationsList: [],
      organisationsNameList: [],
      enterName: true,
      importROR: false,
      validName: true,
      fairSharingEndpoint: import.meta.env.VITE_API_ENDPOINT,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    ...mapState("record", ["editOrganisationLink", "sections"]),
    ...mapState("editor", [
      "organisations",
      "organisationsTypes",
      "grants",
      "organisationsRelations",
    ]),
    ...mapState("editor", [
      "countries",
      "years",
      "tooltips",
      "recordTypes",
      "status",
    ]),
    ...mapGetters("record", ["getSection", "getCreatingNewRecord"]),
    organisationLinks() {
      return this.sections["organisations"].data;
    },
    cleanTextList() {
      return this.organisationsRelations.map((item) =>
        capitalize(this.cleanString(item)),
      );
    },
  },
  watch: {
    "menus.newOrganisation.data.logo": {
      async handler(logo) {
        let _module = this;
        // this.menus.newOrganisation.logoData
        if (logo === null || logo === undefined) {
          // This is to prevent a logo being deleted if a user fiddles about with the form and then
          // submits with no image uploaded.
          if (_module.organisations.urlForLogo) {
            _module.menus.newOrganisation.delete("logoData");
          }
          else {
            _module.menus.newOrganisation.logoData = {};
          }
          return;
        }
        _module.logoLoading = true;
        let convertedFile = await toBase64(logo);
        _module.menus.newOrganisation.logoData = {
          filename: logo.name,
          content_type: logo.type,
          data: convertedFile,
        };
        _module.logoLoading = false;
      },
    },
    "editOrganisationLink.showOverlay": function () {
      this.$nextTick(() => {
        /* istanbul ignore next */
        if (this.$refs["editOrganisationLink"])
          this.$refs["editOrganisationLink"].validate();
      });
    },
    "menus.show": function (val) {
      /* istanbul ignore next */
      if (val === "grant")
        this.$nextTick(() => {
          if (this.$refs["createNewGrant"])
            this.$refs["createNewGrant"].validate();
        });
      /* istanbul ignore next */
      if (val === "organisation")
        this.$nextTick(() => {
          if (this.$refs["createNewOrganisation"])
            this.$refs["createNewOrganisation"].validate();
        });
    },
  },
  methods: {
    capitalize,
    removeCountry(country) {
      this.menus.newOrganisation.data.country_ids =
        this.menus.newOrganisation.data.country_ids.filter(
          (obj) => obj.label !== country.name && obj.id !== country.id,
        );
    },
    removeType(type) {
      this.menus.newOrganisation.data.organisation_type_ids =
        this.menus.newOrganisation.data.organisation_type_ids.filter(
          (obj) => obj.label !== type.name && obj.id !== type.id,
        );
    },
    hideMenu() {
      this.menus.show = false;
      this.editOrganisationLink.data = {};
      this.editOrganisationLink.id = null;
      this.editOrganisationLink.showOverlay = false;
    },
    createNewOrganisation: async function () {
      this.menus.newOrganisation.loading = true;
      this.menus.newOrganisation.error = false;
      let organisationInput = JSON.parse(
        JSON.stringify(this.menus.newOrganisation.data),
      );
      if (this.menus.newOrganisation.logoData) {
        organisationInput.logo = this.menus.newOrganisation.logoData;
        organisationInput.logo.data = organisationInput.logo.data.replace(
          "data:image/png;base64,",
          "",
        );
      }
      let organisation_type_ids = JSON.parse(
        JSON.stringify(organisationInput.organisation_type_ids),
      );
      organisationInput.organisation_type_ids =
        organisationInput.organisation_type_ids.map((obj) => obj.id);
      /* istanbul ignore next */
      if (organisationInput.country_ids) {
        organisationInput.country_ids = organisationInput.country_ids.map(
          (obj) => obj.id,
        );
      }
      if (organisationInput.parent_ror_links) {
        organisationInput.parent_ror_links =
          organisationInput.parent_ror_links.map((obj) => obj.id);
      }
      if (organisationInput.child_ror_links) {
        organisationInput.child_ror_links =
          organisationInput.child_ror_links.map((obj) => obj.id);
      }
      let data = await restClient.createOrganisation(
        organisationInput,
        this.user().credentials.token,
      );
      if (!data.error) {
        let newOrganisation = {
          id: data.data.id,
          name: data.data.attributes.name,
          homepage: data.data.attributes.homepage,
          types: organisation_type_ids.map((obj) => obj.name),
          urlForLogo: data.data.attributes.url_for_logo,
        };
        this.$store.commit(
          "record/setEditOrganisationLinkOrganisation",
          newOrganisation,
        );
        this.organisations[this.organisations.length] = newOrganisation;
        this.menus.show = null;
        this.menus.newOrganisation.data = {
          organisation_type_ids: [],
          country_ids: [],
        };
      }
      else {
        this.menus.newOrganisation.error = data.error;
      }
      this.menus.newOrganisation.loading = false;
    },
    async createNewGrant() {
      this.menus.newGrant.loading = true;
      this.menus.newGrant.error = false;
      let data = await restClient.createGrant(
        this.menus.newGrant.data,
        this.user().credentials.token,
      );
      if (!data.error) {
        let newGrant = {
          name: data.name,
          description: data.description,
          id: data.id,
        };
        this.$store.commit("record/setEditOrganisationLinkGrant", newGrant);
        this.grants[this.grants.length] = newGrant;
        this.menus.show = null;
        this.menus.newGrant.data = {};
      }
      else {
        this.menus.newGrant.error = data.error;
      }
      this.menus.newGrant.loading = false;
    },
    confirmModifications() {
      let data = JSON.parse(JSON.stringify(this.editOrganisationLink.data));
      if (this.editOrganisationLink.id > -1) {
        this.organisationLinks[this.editOrganisationLink.id] = data;
      }
      else this.organisationLinks[this.organisationLinks.length] = data;
      this.editOrganisationLink.showOverlay = false;
    },
    customFilter(item, queryText) {
      let textToSearch = item.name;
      // A newly-created organisation in memory may have no alternativeNames.
      // See: https://github.com/FAIRsharing/fairsharing.github.io/issues/1799
      /* istanbul ignore else */
      if (item.alternativeNames) {
        textToSearch = textToSearch + " " + item.alternativeNames.join(" ");
      }
      const searchText = queryText.toLowerCase();

      return textToSearch.toLowerCase().indexOf(searchText) > -1;
    },

    addNewOrganisation() {
      this.menus.show = "organisation";
      this.enterName = true;
      this.importROR = false;
    },

    async getOrganisations() {
      this.menus.newOrganisation.rorLoader = true;
      let orgName = (" " + this.menus.newOrganisation.data.name)
        .slice(1)
        .trim(); // make a copy of the string and trim it
      let data = await pubClient.getROROrganisation(orgName);
      if (data.items && data.items.length) {
        this.enterName = false;
        this.importROR = true;
        this.validName = true;
        data.items.forEach((it) => {
          it.names.every((e) => {
            if (e.types.includes("ror_display")) {
              it.name = e.value;
              return false;
            }
            else {
              return true;
            }
          });
        });
        this.organisationsList = data.items;
        this.organisationsNameList = data.items.map((item) => item.name);
      }
      else {
        this.enterName = true;
        this.importROR = false;
        this.validName = false;
      }
      this.menus.newOrganisation.rorLoader = false;
    },

    selectOrganisationFromList() {
      if (
        this.menus.newOrganisation.selectOrganisation &&
        Object.keys(this.menus.newOrganisation.selectOrganisation).length
      ) {
        /************  Organisation Name ************/
        this.menus.newOrganisation.data.name =
          this.menus.newOrganisation.selectOrganisation.name;
        /**************  Homepage Link **************/
        this.menus.newOrganisation.data.homepage =
          this.menus.newOrganisation.selectOrganisation.links.filter(
            (link) => link.type === "website",
          )[0].value;
        /***************  ROR Link ***************/
        this.menus.newOrganisation.data.ror_link =
          this.menus.newOrganisation.selectOrganisation.id;
        /***************  Alternative Names ***************/
        this.menus.newOrganisation.data.alternative_names = [];
        this.menus.newOrganisation.selectOrganisation.names.forEach((it) => {
          if (!it.types.includes("ror_display")) {
            this.menus.newOrganisation.data.alternative_names.push(it.value);
          }
        });
        /***************  Type Select ***************/
        this.selectTypes();
        /*************  Country Select *************/
        this.menus.newOrganisation.data.country_ids = this.countries.filter(
          (country) =>
            country.name ===
            this.menus.newOrganisation.selectOrganisation.locations[0]
              .geonames_details["country_name"],
        );
        /*************  Parent ror relationship *************/
        this.menus.newOrganisation.data.parent_ror_links =
          this.menus.newOrganisation.selectOrganisation.relationships.filter(
            (obj) => obj.type === "parent",
          );
        this.menus.newOrganisation.data.child_ror_links =
          this.menus.newOrganisation.selectOrganisation.relationships.filter(
            (obj) => obj.type === "child",
          );
      }
    },

    selectTypes() {
      const selectedType =
        this.menus.newOrganisation.selectOrganisation.types[0];
      const matchedType = this.organisationsTypes.filter(
        (type) =>
          type.name === this.menus.newOrganisation.selectOrganisation.types[0],
      );
      if (matchedType && matchedType.length) {
        this.menus.newOrganisation.data.organisation_type_ids = matchedType;
      }
      else {
        switch (selectedType.toLowerCase()) {
        case "government":
          this.menus.newOrganisation.data.organisation_type_ids = [
            this.organisationsTypes[0],
          ];
          break;
        case "nonprofit":
          this.menus.newOrganisation.data.organisation_type_ids = [
            this.organisationsTypes[1],
          ];
          break;
        case "education":
          this.menus.newOrganisation.data.organisation_type_ids = [
            this.organisationsTypes[2],
          ];
          break;
        case "company":
          this.menus.newOrganisation.data.organisation_type_ids = [
            this.organisationsTypes[5],
          ];
          break;
        case "healthcare":
        case "archive":
        case "facility":
        case "other":
        default:
          this.menus.newOrganisation.data.organisation_type_ids = [
            this.organisationsTypes[8],
          ];
        }
      }
    },

    clearForm() {
      this.enterName = true;
      this.importROR = false;
      this.validName = true;
      this.menus.newOrganisation.data.name = "";
      this.menus.newOrganisation.data.ror_link = null;
      this.menus.newOrganisation.data.parent_ror_links = [];
      this.menus.newOrganisation.data.child_ror_links = [];
      this.$refs.createNewOrganisation.reset();
    },
    imageSizeCorrect() {
      if (!this.menus.newOrganisation.logo) {
        this.imageTooBig = false;
        return true;
      }
      if (this.menus.newOrganisation.logo.size < this.allowedFileSize) {
        this.$emit("imageTooBig", false);
        this.imageTooBig = false;
        return true;
      }
      this.$emit("imageTooBig", true);
      this.imageTooBig = true;
      return false;
    },
  },
};
</script>
