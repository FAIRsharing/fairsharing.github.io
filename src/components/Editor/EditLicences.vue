<template>
  <v-card id="editLicenses">
    <v-card-text v-if="errors.length > 0">
      <v-alert
        type="error"
        max-width="1500px"
      >
        {{ errors }}
      </v-alert>
    </v-card-text>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col class="col-12 pt-0">
            <v-btn
              class="primary"
              style="display:inline-block"
              fab
              x-small
              dark
              @click="addLicence()"
            >
              <v-icon>fa-plus</v-icon>
            </v-btn>
            <div
              class="ml-3"
              style="display:inline-block"
            >
              ADD A NEW LICENCE
            </div>
            <v-divider />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            v-for="(licence, licenceIndex) in currentLicences"
            :key="'licence_' + licenceIndex"
            class="col-4"
          >
            <v-card>
              <v-card-text>
                <v-autocomplete
                  v-model="licence['licence']"
                  :items="licences"
                  item-text="name"
                  item-value="id"
                  outlined
                  return-object
                  label="Select the Licence name"
                />
                <v-autocomplete
                  v-model="licence.relation"
                  :items="relationValues"
                  outlined
                  label="Select a relation type"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  style="display:inline-block"
                  fab
                  x-small
                  dark
                  class="red"
                  @click="removeLicence(licenceIndex)"
                >
                  <v-icon> fa-minus </v-icon>
                </v-btn>
                <div
                  class="ml-3 pt-1"
                  style="display:inline-block"
                >
                  REMOVE LICENCE
                </div>
              </v-card-actions>
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
              errors: []
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
              relation: ""
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
              let createData = await restClient.createLicenceLink(licence, _module.user().credentials.token);
              if (createData.error) {
                _module.errors.push(createData.error);
              }
            });
          },
          deleteLicences: async function () {
            const _module = this;
            let toDelete = _module.removedLicences;
            await asyncForEach(toDelete, async (deleteLicence) => {
              let deleteData = await restClient.deleteLicenceLink(deleteLicence, _module.user().credentials.token);
              if (deleteData.error) {
                _module.errors.push(deleteData.error)
              }
            });
          },
          updateLicences: async function () {
            const _module = this;
            await asyncForEach(_module.initialLicences, async (initialLicence) => {
              let matchingLicence = _module.currentLicences.filter(obj => obj.id === initialLicence.id)[0];
              if (matchingLicence && Object.keys(diff(initialLicence, matchingLicence)).length > 0 ){
                let updatedLicence = await restClient.updateLicenceLink(matchingLicence, _module.user().credentials.token);
                if (updatedLicence.error) {
                  _module.errors.push(updatedLicence.error);
                }
              }
            });
          }
        }
    }
</script>

<style scoped>

</style>
