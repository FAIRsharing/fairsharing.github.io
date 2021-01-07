<template>
  <v-card id="editLicenses">
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
      <b> EDIT LICENCES </b>
    </v-card-title>

    <v-card-text v-if="errors.length > 0">
      <v-alert type="error">
        <v-list color="transparent">
          <v-list-item
            v-for="(error, errorIndex) in errors"
            :key="'error_' + errorIndex"
          >
            {{ error }}
          </v-list-item>
        </v-list>
      </v-alert>
    </v-card-text>
    <v-card-text>
      <v-container fluid>
        <v-row class="mb-3">
          <v-alert
            width="100%"
            type="info"
            dismissible
          >
            <b>Note:</b> To create a new licence name and URL, type a new name in the search box. If it doesn't already exist, you will
            be asked if you want to create a new licence.
          </v-alert>
        </v-row>
        <v-row>
          <v-col
            v-for="(licence, licenceIndex) in currentLicences"
            :key="'licence_' + licenceIndex"
            class="col-3"
          >
            <v-card height="100%">
              <v-card-text style="height:80%">
                <v-autocomplete
                  v-if="licence.licence && licence.licence.id !== false"
                  v-model="licence['licence']"
                  :items="licences"
                  item-text="name"
                  item-value="id"
                  outlined
                  return-object
                  label="Select the Licence name"
                  :search-input.sync="searchInput[licenceIndex]"
                >
                  <template slot="no-data">
                    <v-container>
                      <v-row>
                        <v-row justify="center">
                          <div>No licence found.</div>
                        </v-row>
                      </v-row>
                      <v-row justify="center">
                        <v-btn
                          elass="green white--text my-3"
                          @click="createNewLicence(licence, licenceIndex)"
                        >
                          Create a new licence
                        </v-btn>
                      </v-row>
                    </v-container>
                  </template>
                </v-autocomplete>
                <div v-else>
                  <v-text-field
                    v-model="licence['licence_attributes'].name"
                    label="Licence Name"
                    outlined
                  />
                  <v-text-field
                    v-model="licence['licence_attributes'].url"
                    label="Licence URL"
                    outlined
                  />
                </div>
                <v-autocomplete
                  v-model="licence.relation"
                  :items="relationValues"
                  outlined
                  label="Select a relation type"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="error mb-3 ml-2"
                  @click="removeLicence(licenceIndex)"
                >
                  <v-icon left>
                    fa-minus-circle
                  </v-icon>
                  Remove Licence
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- ADDING NEW ITEMS -->
          <v-col class="col-sm-12 col-md-12 col-lg-4 col-xl-3">
            <v-card
              height="100%"
              class="newRel green--text"
              style="cursor: pointer"
              min-height="383px"
              @click="addLicence()"
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
                Add a new licence
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn
        class="primary"
        @click="updateRecord()"
      >
        Submit Licences
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
    import { mapState } from "vuex"
    import licenceQuery from "@/components/GraphClient/queries/getLicences.json"
    import GraphClient from "@/components/GraphClient/GraphClient.js"
    import RESTClient from "@/components/Client/RESTClient.js"
    import { asyncForEach } from "@/utils/utils.js"

    const diff = require("deep-object-diff").diff;
    const graphClient = new GraphClient();
    const restClient = new RESTClient();


    export default {
        name: "EditLicences",
        data(){
            return {
              licences: [],
              initialLicences: [],
              currentLicences: [],
              relationValues: [
                "undefined",
                "applies_to_content",
                "least_permissive"
              ],
              removedLicences: [],
              errors: [],
              searchInput: []
            }
        },
        computed: {
          ...mapState("record", ["currentRecord"]),
          ...mapState("users", ["user"])
        },
        mounted(){
          this.$nextTick(async function () {
              const _module = this;
              _module.licences = await _module.getLicences();
              _module.currentLicences = JSON.parse(JSON.stringify(_module.currentRecord['fairsharingRecord']['licenceLinks']));
              _module.initialLicences = JSON.parse(JSON.stringify(_module.currentRecord['fairsharingRecord']['licenceLinks']));
          })
        },
        methods: {
          getLicences: async function () {
            let licences = await graphClient.executeQuery(licenceQuery);
            return licences['searchLicences']
          },
          addLicence: async function () {
            this.currentLicences.push({
              fairsharing_record_id: parseInt(this.$route.params.id),
              licence: {
                name: "",
                id: ""
              },
              relation: "",
              licence_attributes: {
                name: "",
                url: ""
              }
            });
          },
          removeLicence: function (itemIndex) {
            let removed = this.currentLicences.splice(itemIndex, 1);
            if (Object.keys(removed[0]).indexOf("id") > -1) {
              this.removedLicences.push(removed[0].id)
            }
          },
          updateRecord: async function () {
            const _module = this;
            _module.errors = [];
            await _module.createLicences();
            await _module.deleteLicences();
            await _module.updateLicences();
            if (_module.errors.length === 0){
              _module.$router.push({
                path: "/" + _module.$route.params.id
              })
            }
          },
          createLicences: async function () {
            const _module = this;
            let toAdd = this.currentLicences.filter(obj => Object.keys(obj).indexOf("id") === -1);
            await asyncForEach(toAdd, async function (licence) {
              let preparedLicence = _module.prepareData(licence);
              let createData = await restClient.createLicenceLink(preparedLicence, _module.user().credentials.token);
              if (createData.error) {
                _module.errors.push(createData.error.response);
              }
            });
          },
          deleteLicences: async function () {
            const _module = this;
            let toDelete = _module.removedLicences;
            await asyncForEach(toDelete, async (deleteLicence) => {
              let deleteData = await restClient.deleteLicenceLink(deleteLicence, _module.user().credentials.token);
              if (deleteData.error) {
                _module.errors.push(deleteData.error.response)
              }
            });
          },
          updateLicences: async function () {
            const _module = this;
            await asyncForEach(_module.initialLicences, async (initialLicence) => {
              let matchingLicence = _module.currentLicences.filter(obj => obj.id === initialLicence.id)[0];
              if (matchingLicence && Object.keys(diff(initialLicence, matchingLicence)).length > 0 ){
                let preparedLicence = _module.prepareData(matchingLicence);
                let updatedLicence = await restClient.updateLicenceLink(preparedLicence, _module.user().credentials.token);
                if (updatedLicence.error) {
                  _module.errors.push(updatedLicence.error.response);
                }
              }
            });
          },
          createNewLicence: function(licence, index){
            let input = this.searchInput[index];
            licence.licence.id = false;
            licence.licence_attributes = {
              name: input,
              url: '',
            };
            return licence;
          },
          prepareData: function(rawLicence){
            let preparedLicence = { relation: rawLicence.relation };
            preparedLicence.fairsharing_record_id = (rawLicence.fairsharingRecord) ? rawLicence.fairsharingRecord.id : rawLicence.fairsharing_record_id;
            if (rawLicence.id) preparedLicence.id = rawLicence.id;
            if (rawLicence.licence && rawLicence.licence.id !== false){
              preparedLicence.licence_id = rawLicence.licence.id
            }
            else {
              preparedLicence.licence_attributes = rawLicence.licence_attributes;
            }
            return preparedLicence;
          }
        }
    }
</script>

<style scoped>

</style>
