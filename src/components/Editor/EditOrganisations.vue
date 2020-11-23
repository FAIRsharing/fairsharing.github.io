<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card id="editOrganisations">
    <!-- EDITING EXISTING RELATIONSHIPS -->
    <v-form
      ref="editOrganisations"
      v-model="saving.validity"
    >
      <v-card-title class="grey lighten-4 blue--text">
        <v-btn
          class="blue mr-4"
          fab
          x-small
        >
          <v-icon
            class="white--text"
            small
          >
            fa fa-info
          </v-icon>
        </v-btn>
        <b> EDIT ORGANISATIONS & GRANTS </b>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row v-if="saving.errors">
            <v-col cols-12>
              <v-alert type="error">
                {{ saving.errors.response.data }}
              </v-alert>
            </v-col>
          </v-row>
          <v-row v-if="saving.success">
            <v-col cols-12>
              <v-alert type="success">
                Your record was successfully updated!
              </v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              v-for="(orga, orgaIndex) in currentOrganisations"
              :key="'organisation_' + orgaIndex"
              class="col-xs-12 col-sm-12 col-md-12 col-lg-4 col-xl-3"
            >
              <v-skeleton-loader
                height="100%"
                :loading="loading.organisations"
                type="image"
              >
                <v-card
                  height="100%"
                  class="flexCard"
                >
                  <v-card-text style="flex-grow: 1;">
                    <div :id="'editOrganisation_' + orgaIndex">
                      <v-autocomplete
                        v-model="orga.organisation"
                        :items="existingOrganisations"
                        item-text="name"
                        item-value="id"
                        outlined
                        return-object
                        label="Select an organisation"
                        :search-input.sync="searches.organisations[orgaIndex]"
                        :rules="[rules.isRequired()]"
                      >
                        <template slot="no-data">
                          <v-container>
                            <v-row>
                              <v-row justify="center">
                                <div>No organisation found.</div>
                              </v-row>
                            </v-row>
                            <v-row justify="center">
                              <v-btn
                                class="green white--text my-3"
                                @click="openOrganisationMenu(orgaIndex, searches.organisations[orgaIndex])"
                              >
                                Create a new organisation
                              </v-btn>
                            </v-row>
                          </v-container>
                        </template>
                        <template v-slot:selection="data">
                          <v-chip class="blue white--text px-3 py-1">
                            {{ data.item.name }}
                          </v-chip>
                        </template>
                        <template v-slot:item="data">
                          <v-list-item-avatar>
                            <img
                              v-if="data.item['urlForLogo']"
                              :src="'https://api.fairsharing.org' + data.item['urlForLogo']"
                            >
                            <v-icon v-else>
                              fas fa-sitemap
                            </v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content class="mb-2">
                            <v-list-item-title> {{ data.item.name }} </v-list-item-title>
                            <v-list-item-subtitle> {{ data.item.homepage }} </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="data.item.types.length > 0">
                              Types: {{ data.item.types.join(", ") }}
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="data.item['alternativeNames'].length > 0">
                              Alternative names: {{ data.item['alternativeNames'].join(", ") }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                    </div>

                    <div :id="'editRelation_' + orgaIndex">
                      <v-autocomplete
                        v-model="orga.relation"
                        :items="relations"
                        outlined
                        label="Select a type of relationship"
                        :rules="[rules.isRequired()]"
                      >
                        <template v-slot:selection="data">
                          <v-chip class="blue white--text px-3 py-1">
                            {{ data.item }}
                          </v-chip>
                        </template>
                        <template v-slot:item="data">
                          <v-list-item-content
                            style="width:100%;height:100%"
                            @click="cleanGrant(orgaIndex, data.item)"
                          >
                            {{ data.item }}
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                    </div>

                    <div :id="'editGrant_' + orgaIndex">
                      <v-autocomplete
                        v-model="orga.grant"
                        :items="grants"
                        :loading="loading.grants"
                        item-text="name"
                        item-value="id"
                        outlined
                        return-object
                        label="Select an optional grant for funding organisations"
                        :disabled="orga.relation !== 'funds'"
                      >
                        <template slot="no-data">
                          <v-container>
                            <v-row>
                              <v-row justify="center">
                                <div>No grant found.</div>
                              </v-row>
                            </v-row>
                            <v-row justify="center">
                              <v-btn
                                class="green white--text my-3"
                                @click="menus.visibility.newGrant = true"
                              >
                                Create a new grant
                              </v-btn>
                            </v-row>
                          </v-container>
                        </template>
                        <template v-slot:selection="data">
                          <v-chip class="blue white--text px-3 py-1">
                            {{ data.item.name }}
                          </v-chip>
                        </template>

                        <template v-slot:item="data">
                          <div>
                            <v-list-item class="px-0 py-3">
                              <v-list-item-avatar>
                                <v-icon>fas fa-funnel-dollar</v-icon>
                              </v-list-item-avatar>
                              <v-list-item-content class="py-0">
                                <v-list-item-title> {{ data.item.name }} </v-list-item-title>
                                <v-list-item-subtitle> {{ data.item.description }} </v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </div>
                        </template>
                      </v-autocomplete>
                    </div>
                  </v-card-text>

                  <v-divider />

                  <v-card-actions>
                    <v-btn
                      class="error mb-3 ml-2"
                      @click="removeRelationship(orgaIndex)"
                    >
                      <v-icon left>
                        fa-minus-circle
                      </v-icon>
                      Remove relationship
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-skeleton-loader>
              <v-divider v-if="$vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly || $vuetify.breakpoint.mdOnly" />
            </v-col>

            <!-- ADDING NEW ITEMS -->
            <v-col class="col-sm-12 col-md-12 col-lg-4 col-xl-3">
              <v-card
                height="100%"
                class="newRel green--text"
                style="cursor: pointer"
                min-height="383px"
                :disabled="loading.organisations"
                @click="addRelationship()"
              >
                <div class="mb-4">
                  <v-icon
                    x-large
                    class="green--text icon--xxl"
                  >
                    fa-plus-circle
                  </v-icon>
                </div>
                <div class="text-h4 text-center">
                  Add a new relationship
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pb-5">
        <v-btn
          class="primary ml-4"
          :loading="loading.saving"
          :disabled="!saving.validity"
          @click="saveRelations"
        >
          Save Organisations and Grants
        </v-btn>
      </v-card-actions>
    </v-form>

    <!-- CREATE A NEW ORGANISATION -->
    <v-dialog
      v-model="menus.visibility.newOrganisation"
      max-width="1000px"
      class="pa-0"
      persistent
      no-click-animation
    >
      <v-container
        fluid
        class="py-0"
      >
        <v-row justify="center">
          <v-card width="100%">
            <v-card-title class="green white--text">
              Create a new organisation
            </v-card-title>
            <v-card-text
              v-if="menus.data"
              class="pt-4"
            >
              <v-alert
                v-if="menus.errors.newOrganisation"
                type="error"
                class="mb-8"
              >
                {{ menus.errors.newOrganisation.response.data }}
              </v-alert>
              <v-form
                ref="newOrganisation"
                v-model="menus.validity.newOrganisation"
              >
                <v-container fluid>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="menus.data.name"
                        label="Organisation Name"
                        outlined
                        :rules="[rules.isRequired()]"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="menus.data.homepage"
                        label="Organisation Homepage"
                        outlined
                        :rules="[rules.isRequired(), rules.isURL()]"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="menus.data.organisation_type_ids"
                        :items="organisationTypes"
                        multiple
                        outlined
                        item-text="name"
                        item-value="id"
                        return-object
                        label="Select the organisation type(s)"
                        :rules="[rules.isRequired()]"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="menus.data.alternativeNames"
                        label="Alternative names, comma separated"
                        outlined
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-file-input
                        v-model="menus.data.logo"
                        accept="image/png, image/jpeg"
                        :rules="[rules.isImage()]"
                        color="primary"
                        label="File input"
                        placeholder="Select a logo"
                        outlined
                        :show-size="1000"
                        clearable
                        chips
                      />
                    </v-col>
                  </v-row>
                  <v-row v-if="menus.validity.newOrganisation">
                    <v-col cols="12">
                      <div class="orgaPreview">
                        <h6>Preview your new organisation</h6>
                        <v-list-item
                          three-line
                          style="border: 1px dashed #ccc;"
                        >
                          <v-list-item-avatar>
                            <img
                              v-if="logoData.data"
                              :src="logoData.data"
                              alt="organisation logo"
                            >
                            <v-icon v-else>
                              fas fa-sitemap
                            </v-icon>
                          </v-list-item-avatar>
                          <v-list-item-content class="mb-2">
                            <v-list-item-title> {{ menus.data.name }} </v-list-item-title>
                            <v-list-item-subtitle> {{ menus.data.homepage }} </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="menus.data.organisation_type_ids">
                              Types: {{ menus.data.organisation_type_ids.map(obj => obj.name).join(", ") }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="green white--text"
                :disabled="!menus.validity.newOrganisation"
                :loading="menus.loading.newOrganisation"
                @click="createNewOrganisation()"
              >
                Save organisation
              </v-btn>
              <v-btn
                class="red white--text"
                @click="menus.visibility.newOrganisation = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>
    </v-dialog>

    <!-- CREATE A NEW GRANT -->
    <v-dialog
      v-model="menus.visibility.newGrant"
    />
  </v-card>
</template>

<script>
  import Vue from "vue"
  import { mapState } from "vuex"
  import { isEqual } from "lodash"
  import GraphClient from "@/components/GraphClient/GraphClient.js"
  import RestClient from "@/components/Client/RESTClient.js"
  import getTypesQuery from "@/components/GraphClient/queries/Organisations/getOrganisationTypes.json"
  import getOrganisationsQuery from "@/components/GraphClient/queries/Organisations/getOrganisations.json"
  import getGrantsQuery from "@/components/GraphClient/queries/Organisations/getGrants.json"
  import { isRequired, isUrl, isImage } from "@/utils/rules.js"

  const client = new GraphClient();
  const restClient = new RestClient();

  export default {
      name: "EditOrganisations",
      data() {
        return {
          organisationTypes: [],
          currentOrganisations: [],
          initialOrganisations: [],
          existingOrganisations: [],
          relations: [
            "maintains",
            "funds",
            "collaborates_on",
            "undefined"
          ],
          grants: [],
          logoData: {
            filename: null,
            data: null,
            content_type: null
          },
          loading: {
            organisations: false,
            grants: false,
            saving: false
          },
          searches: {
            organisations: [],
            grants: []
          },
          menus: {
            visibility: {
              newOrganisation: false,
              newGrant: false
            },
            validity: {
              newOrganisation: false,
              newGrant: false
            },
            loading: {
              newOrganisation: false,
              newGrant: false
            },
            errors: {
              newOrganisation: false,
              newGrant: false
            },
            data: null,
            target: null
          },
          rules: {
            isRequired: function(){return isRequired() },
            isURL: function(){ return isUrl() },
            isImage: function(){ return isImage() }
          },
          saving: {
            errors: null,
            validity: true,
            success: false
          }
        }
      },
      computed: {
          ...mapState('record', ['currentRecord', 'recordUpdate']),
          ...mapState('users', ['user'])
      },
      watch: {
        'menus.data.logo': function(){
          if (this.menus.data.logo) {
            let reader = new FileReader();
            reader.addEventListener('load', async (event) => {
              this.logoData = {
                filename: this.menus.data.logo.name,
                data: event.target['result'],
                content_type: this.menus.data.logo.type
              };
            });
            reader.readAsDataURL(this.menus.data.logo);
          }
        },
        'currentRecord.fairsharingRecord': async function(){
          this.loading.organisations = true;
          await this.getData();
          this.loading.organisations = false;
        }
      },
      mounted(){
        this.$nextTick(async function () {
          this.loading.organisations = true;
          await this.getData();
          await this.getExistingOrganisations();
        });
      },
      methods: {
        async getData(){
          this.loading.grants = true;
          this.currentOrganisations = JSON.parse(JSON.stringify(this.currentRecord['fairsharingRecord']['organisationLinks']));
          this.initialOrganisations = JSON.parse(JSON.stringify(this.currentRecord['fairsharingRecord']['organisationLinks']));
          let data = await client.executeQuery(getTypesQuery);
          this.organisationTypes = data['searchOrganisationTypes'];
          data = await client.executeQuery(getGrantsQuery);
          this.grants = data["searchGrants"];
          this.loading.grants = false;
        },
        async getExistingOrganisations(){
          this.loading.organisations = true;
          getOrganisationsQuery.queryParam = {load: true};
          let data = await client.executeQuery(getOrganisationsQuery);
          this.existingOrganisations = data["searchOrganisations"];
          this.loading.organisations = false;
        },
        addRelationship(){
          this.currentOrganisations.push({
            organisation: {},
            grant: {},
            funds: null
          })
        },
        removeRelationship(index){
          this.currentOrganisations.splice(index, 1)
        },
        openOrganisationMenu(relationIndex, searchTerm){
          this.menus.visibility.newOrganisation = true;
          this.logoData = {
            filename: null,
            data: null,
            content_type: null
          };
          this.menus.data = {
            name: searchTerm,
            homepage: null,
            organisation_type_ids: null,
            logo: null,
            alternativeNames: null
          };
          this.menus.target = relationIndex
        },
        async createNewOrganisation(){
          this.menus.loading.newOrganisation = true;
          this.menus.errors.newOrganisation = false;
          let organisationInput = JSON.parse(JSON.stringify(this.menus.data));
          if (this.logoData.data){
            organisationInput.logo = JSON.parse(JSON.stringify(this.logoData));
            organisationInput.logo.data = organisationInput.logo.data.replace("data:image/png;base64,", "")
          }
          this.saveNewOrganisation(organisationInput);
        },
        async saveNewOrganisation(organisation){
          let queryInput = JSON.parse(JSON.stringify(organisation));
          queryInput.alternativeNames = this.menus.data.alternativeNames ? this.menus.data.alternativeNames.split(",") : null;
          if (!queryInput.alternativeNames) delete queryInput.alternativeNames;
          queryInput.organisation_type_ids = queryInput.organisation_type_ids.map(obj => obj.id);
          let data = await restClient.createOrganisation(queryInput, this.user().credentials.token);
          if (data.error) {
            this.menus.errors.newOrganisation = data.error;
          }
          else {
            let newOrganisation = {
              id: data.id,
              name: data.name,
              homepage: data.homepage,
              types: organisation.organisation_type_ids.map(obj => obj.name),
              alternativeNames: data['alternative_names'],
              urlForLogo: data['url_for_logo']
            };
            this.currentOrganisations[this.menus.target].organisation = newOrganisation;
            Vue.set(this.existingOrganisations, this.existingOrganisations.length, newOrganisation);
            this.menus.visibility.newOrganisation = false;
          }
          this.menus.loading.newOrganisation = false;
        },
        async createNewGrant(){},
        async saveNewGrant(){},
        async saveRelations(){
          let _module = this;
          this.saving.success = false;
          _module.loading.saving = true;
          _module.saving.errors = false;
          _module.currentOrganisations.forEach(async relation => {
            let query = {
              fairsharing_record_id: _module.currentRecord['fairsharingRecord'].id,
              organisation_id: relation.organisation.id,
              relation: relation.relation,
              grant_id: (relation.grant) ? relation.grant.id : null
            };
            let found = false;
            this.initialOrganisations.forEach(async initialRelations => {
              if (initialRelations.id === relation.id){
                found = true;
                if(!isEqual(relation, initialRelations)){
                  let data = await restClient.updateOrganisationLink(query, relation.id, _module.user().credentials.token);
                  if (data.error){
                    _module.saving.errors = data.error;
                  }
                }
              }
            });
            if (!found){
              let data = await restClient.createOrganisationLink(query, _module.user().credentials.token);
              if (data.error){
                _module.saving.errors = data.error;
              }
            }
          });
          _module.initialOrganisations.forEach(async initialRelations => {
            let found = false;
            _module.currentOrganisations.forEach(relation => {
              if (initialRelations.id === relation.id) {
                found = true;
              }
            });
            if (!found){
              let data = await restClient.deleteOrganisationLink(initialRelations.id, this.user().credentials.token);
              if (data.error){
                _module.saving.errors = data.error;
              }
            }
          });
          if (!this.saving.errors){
            this.saving.success = true;
          }
          _module.loading.saving = false;
          window.scrollTo(0, 0);
        },
        cleanGrant(organisationIndex, relation){
          if (relation !== 'funds'){
            this.currentOrganisations[organisationIndex].grant = null;
          }
        }
      }
    }
</script>

<style>
  .v-menu__content {
    max-width: 300px;
  }

  .v-skeleton-loader__image, .v-skeleton-loader {
    min-height: 383px !important;
    height:100%;
  }

  .newRel {
    justify-content: center;
    align-items: center;
    display:flex;
    flex-direction: column;
  }

  .icon--xxl {
    font-size: 80px !important;
  }

  .flexCard, .flexContainer {
    display:flex;
    flex-direction: column;
  }

  .orgaPreview {
    margin-left: 35px;
    padding: 5px 10px 20px 10px;
  }

  .orgaPreview h6 {
    font-size: 16px;
    text-decoration: underline;
    margin-bottom: 15px;
  }

</style>
