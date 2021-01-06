<template>
  <v-container
    id="curatorPage"
    fluid
    class="standard"
  >
    <v-row v-if="user().is_curator">
      <v-col cols12>
        <v-card v-if="!messages()['getUser'].error">
          <v-list>
            <v-list-item class="blue">
              <v-list-item-content class="pa-0">
                <v-list-item-title
                  v-if="user().credentials"
                  class="headline text-left white--text"
                >
                  Welcome, curator {{ user().credentials.username }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
        <v-card>
          <v-card-text v-if="approvalRequired">
            <v-card-title
              id="text-curator-search-0"
              class="green white--text"
            >
              <b> RECORDS AWAITING APPROVAL </b>
              <v-spacer />
              <v-text-field
                v-model="searches.recordsAwaitingApproval"
                label="Search"
                color="white--text"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :loading="loading"
              :headers="headers.approvalRequired"
              :items="approvalRequired"
              :search="searches.recordsAwaitingApproval"
              class="elevation-1"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
              :sort-by="approvalRequired.curator"
              :sort-desc="false"
            >
              <template
                v-if="recordType"
                #item="props"
              >
                <tr>
                  <td>
                    {{ props.item.updatedAt }}
                  </td>
                  <td>
                    <v-tooltip bottom>
                      <template #activator="{on}">
                        <v-icon
                          class="clickable"
                          small
                          color="nordnetBlue"
                          @click="openCustomer(item.Id)"
                          v-on="on"
                        >
                          {{ props.item.curator }}
                        </v-icon>
                      </template>
                      Assign to myself
                    </v-tooltip>
                  </td>
                  <td>
                    <a :href="'#/' + props.item.id">
                      <span
                        v-if="props.item.type"
                        class="mr-2"
                      >
                        <img
                          v-if="Object.keys(recordType).includes(props.item.type)"
                          :src="'./' + recordType[props.item.type].icon"
                          class="miniIcon"
                        >
                      </span>
                      {{ props.item.recordName + ' (' + props.item.id + ')' }}
                    </a>
                  </td>
                  <td>
                    {{ props.item.lastEditor }}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="maintenanceRequests">
            <v-card-title
              id="text-curator-search-1"
              class="green white--text"
            >
              <b> OWNERSHIP REQUESTS </b>
              <v-spacer />
              <v-text-field
                v-model="searches.pendingMaintenanceRequests"
                label="Search"
                color="white--text"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :loading="loading"
              :headers="headers.maintenanceRequests"
              :items="maintenanceRequests"
              :search="searches.pendingMaintenanceRequests"
              class="elevation-1"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
              disable-initial-sort
            >
              <template
                v-if="recordType"
                #item="props"
              >
                <tr>
                  <td>
                    {{ props.item.createdAt | formattingDate }}
                  </td>
                  <td>
                    <a :href="'#/' + props.item.id">
                      <span
                        v-if="props.item.type"
                        class="mr-2"
                      >
                        <img
                          v-if="Object.keys(recordType).includes(props.item.type)"
                          :src="'./' + recordType[props.item.type].icon"
                          class="miniIcon"
                        >
                      </span>
                      {{ props.item.recordName }}
                    </a>
                  </td>
                  <td>
                    {{ props.item.userNameID }}
                  </td>
                  <td>
                    <v-edit-dialog
                      :return-value.sync="props.item.processingNotes"
                      large
                      width="1200px"
                      @save="saveProcessingNotes(props.item.id,props.item.processingNotes)"
                    >
                      <!--
                      <v-if props.item.saveProcessingNotes>
                        <some sort of text box element>
                        -->
                      {{ props.item.processingNotes }}
                      <!--
                    </element>
                  </v-if>
                -->
                      <template v-slot:input>
                        <div class="testDialog">
                          <div class="mt-4 title">
                            Update Processing Notes
                          </div>
                          <v-textarea
                            v-model="props.item.processingNotes"
                            width="1200px"
                            label="Edit (not long words)"
                            filled
                          />
                        </div>
                      </template>
                    </v-edit-dialog>
                  </td>
                  <td>
                    <v-icon
                      color="blue"
                      dark
                      left
                      @click.stop="assignMaintenanceOwner(props.item.recordName,props.item.id,props.item.userNameID,props.item.requestID)"
                    >
                      far fa-check-circle
                    </v-icon>
                    {{ props.item.actions }}
                    <v-icon
                      color="red"
                      dark
                      right
                      @click="rejectMaintenanceOwner(props.item.recordName,props.item.id,props.item.userNameID,props.item.requestID)"
                    >
                      fas fa-ban
                    </v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
          <v-layout
            row
            justify-center
          >
            <v-dialog
              v-model="dialogs.maintenanceRequests.confirmAssignment"
              max-width="700px"
            >
              <v-card>
                <v-card-title
                  class="headline"
                >
                  Are you sure you want to
                  <font style="color:blue; padding-left: 5px; padding-right: 5px;">
                    ACCEPT
                  </font>
                  this ownership?
                  <ul style="list-style-type:none;">
                    <li>
                      Record: {{ dialogs.maintenanceRequests.recordName }}
                    </li>
                    <li>
                      User: {{ dialogs.maintenanceRequests.userName }}
                    </li>
                  </ul>
                </v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="closeMaintenanceAssign()"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="assignMaintenanceOwnConfirm()"
                  >
                    OK
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-layout>
          <v-layout
            row
            justify-center
          >
            <v-dialog
              v-model="dialogs.maintenanceRequests.rejectAssignment"
              max-width="700px"
            >
              <v-card>
                <v-card-title
                  class="headline"
                >
                  Are you sure you want to
                  <font
                    style="color:red; padding-left: 5px; padding-right: 5px;"
                  >
                    REJECT
                  </font>
                  this ownership?
                  <ul style="list-style-type:none;">
                    <li>
                      Record: {{ dialogs.maintenanceRequests.recordName }}
                    </li>
                    <li>
                      User: {{ dialogs.maintenanceRequests.userName }}
                    </li>
                  </ul>
                </v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="closeMaintenanceReject()"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="rejectMaintenanceOwnConfirm()"
                  >
                    OK
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-layout>
        </v-card>
        <v-card>
          <v-card-text v-if="recordsInCuration">
            <v-card-title
              id="text-curator-search-4"
              class="green white--text"
            >
              <b> RECORDS IN CURATION </b>
              <v-spacer />
              <v-text-field
                v-model="searches.recordsInCuration"
                label="Search"
                color="white--text"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :loading="loading"
              :headers="headers.recordsInCuration"
              :items="recordsInCuration"
              :search="searches.recordsInCuration"
              class="elevation-1"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
              :sort-by="recordsInCuration.curator"
              :sort-desc="true"
            />
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="recordsWithoutDois">
            <v-card-title
              id="text-curator-search-5"
              class="green white--text"
            >
              Records without dois
              <v-spacer />
              <v-text-field
                v-model="searches.recordsWithoutDois"
                label="Search"
                color="white--text"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :loading="loading"
              :headers="headers.recordsWithoutDois"
              :items="recordsWithoutDois"
              :search="searches.recordsWithoutDois"
              class="elevation-1"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
            />
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="hiddenRecords">
            <v-card-title
              id="text-curator-search-7"
              class="green white--text"
            >
              <b> HIDDEN RECORDS </b>
              <v-spacer />
              <v-text-field
                v-model="searches.hiddenRecords"
                label="Search"
                color="white--text"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :loading="loading"
              :headers="headers.hiddenRecords"
              :items="hiddenRecords"
              :search="searches.hiddenRecords"
              class="elevation-1"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
            />
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="recordsCreatedCuratorsLastWeek">
            <v-card-title
              id="text-curator-search-2"
              class="green white--text"
            >
              <b> RECORDS CREATED BY CURATORS IN THE PAST WEEK </b>
              <v-spacer />
              <v-text-field
                v-model="searches.recentCuratorCreations"
                label="Search"
                color="white--text"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :loading="loading"
              :headers="headers.recordsCreatedCuratorsLastWeek"
              :items="recordsCreatedCuratorsLastWeek"
              :search="searches.recentCuratorCreations"
              class="elevation-1"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols12>
        <Unauthorized />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import GraphClient from "@/components/GraphClient/GraphClient.js"
    import RestClient from "@/components/Client/RESTClient.js"
    import getCurationRecords from "@/components/GraphClient/queries/curators/getSummary.json"
    import { mapActions, mapState } from "vuex"
    import Unauthorized from "@/views/Errors/403.vue"
    import recordTypes from "@/data/recordsRegistries.json"

    const client = new GraphClient();
    const restClient = new RestClient();

    function compareRecordDesc(a, b) {
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return 0;
    }

    /**
     * @vue-data {Object} hideFields - an array of field to NOT display
     * */

    export default {
      name: "Curator",
      components: {Unauthorized},
      filters: {
        formattingDate: function(d){
          let date = new Date(d);
          return date.toLocaleString('default', { month: 'short' })+' '+date.getUTCDate()+ ', '+date.getUTCFullYear();
        }
      },
      data: () => {
        return {
          allDataCuration: null,
          approvalRequired: [],
          maintenanceRequests: [],
          recordsCreatedCuratorsLastWeek: [],
          recordsInCuration: [],
          recordsWithoutDois: [],
          hiddenRecords: [],
          recordType: null,
          dialogs: {
            maintenanceRequests: {
              confirmAssignment: false,
              recordName: "",
              recordID: "",
              userName: "",
              requestId: "",
              rejectAssignment: false
            }
          },
          headers: {
            approvalRequired: [
              {
                text: "Date last modification",
                value: "updatedAt"
              },
              {
                text: "Curator",
                value: "curator"
              },
              {
                text: "Record name (id)",
                value: "recordName"
              },
              {
                text: "Last editor",
                value: "lastEditor"
              }
            ],
            maintenanceRequests: [
              {
                text: "Date",
                value: "createdAt"
              },
              {
                text: "Record name (id)",
                value: "recordName"
              },
              {
                text: "User login (id)",
                value: "userNameID"
              },
              {
                text: "Processing Notes",
                value: "processingNotes",
                sortable: false,
                width: 250
              },
              { text: "Accept request?",
                value: "actions",
                sortable: false
              }
            ],
            recordsCreatedCuratorsLastWeek: [
              {
                text: "Record name (id)",
                value: "recordNameID"
              },
              {
                text: "Date created",
                value: "createdAt"
              },
              {
                text: "Creator",
                value: "creator"
              }
            ],
            recordsInCuration: [
              {
                text: "Record name (id)",
                value: "recordNameID"
              },
              {
                text: "Record maintainer(s)",
                value: "recordMaintainers"
              },
              {
                text: "Under curation by",
                value: "curator"
              }
            ],
            recordsWithoutDois: [
              {
                text: "Record name (id)",
                value: "recordNameID"
              },
              {
                text: "Date created",
                value: "createdAt"
              },
              {
                text: "Date last edit",
                value: "updatedAt"
              },
              {
                text: "Created by",
                value: "creator"
              },
              {
                text: "Last edited by",
                value: "lastEditor"
              }
            ],
            hiddenRecords: [
              {
                text: "Record name (id)",
                value: "recordNameID"
              },
              {
                text: "Date created",
                value: "createdAt"
              },
              {
                text: "Under curation by",
                value: "curator"
              },
              {
                text: "Created by",
                value: "creator"
              }
            ]
          },
          searches: {
            recordsAwaitingApproval: "",
            pendingMaintenanceRequests: "",
            recentCuratorCreations: "",
            recordsInCuration: "",
            recordsWithoutDois: "",
            hiddenRecords: ""
          },
          loading: false,
          error: null
        }
      },
      computed: {
        ...mapState('users', ['user', "messages"]),
        ...mapState("record", ["recordUpdate"]),
      },
      watch: {
        'dialogs.maintenanceRequests.confirmAssignment' (val) {
          val || this.closeMaintenanceAssign()
        },
        'dialogs.maintenanceRequests.rejectAssignment' (val) {
          val || this.closeMaintenanceReject()
        }

      },
      created() {
        this.$nextTick(function () {
          this.recordType = recordTypes;
        });
      },
      async mounted() {
        this.$nextTick(async function () {
          this.loading = true;
          await this.getUser();
          if (this.messages()["getUser"].error) {
            this.setError({field: "login", message: "You've been logged out automatically"});
            this.$router.push({path: "/accounts/login"})
          }
          client.setHeader(this.user().credentials.token);
          let data = await client.executeQuery(getCurationRecords);
          this.allDataCuration = data.curationSummary;
          client.initalizeHeader();
          this.prepareData();
          this.loading = false;
        })
      },
      methods: {
          ...mapActions('users', ['getUser', 'setError']),
          ...mapActions("record", ["updateRecord"]),

          prepareData(){
            this.prepareApprovalRequired(this.allDataCuration);
            this.prepareMaintenanceRequests(this.allDataCuration);
            this.prepareRecordsInCuration(this.allDataCuration);
            this.prepareRecordsWithoutDois(this.allDataCuration);
            this.prepareHiddenRecords(this.allDataCuration);
            this.prepareRecordsCuratorCreationsLastWeek(this.allDataCuration);
          },
          prepareApprovalRequired(dataCuration){
            let userRecords = dataCuration.approvalsRequired;
            userRecords.forEach(item => {
              item.fairsharingRecords.forEach(rec => {
                let object = {};
                object.updatedAt = rec.updatedAt;
                object.curator = item.username;
                object.recordName = rec.name;
                object.id = rec.id;
                object.type = rec.type;
                if (rec.lastEditor){
                  object.lastEditor = rec.lastEditor.username+' ('+rec.lastEditor.id+')';
                }else{
                  object.lastEditor = "unknown"
                }
                this.approvalRequired.push(object);
              });
            });
          },
          prepareMaintenanceRequests(dataCuration){
            let requests = dataCuration.pendingMaintenanceRequests;
            requests.forEach(item => {
              let object = {};
              //let date = new Date(item.createdAt);
              object.createdAt = item.createdAt;
              //date.toLocaleString('default', { month: 'short' })+' '+date.getUTCDate()+ ', '+date.getUTCFullYear();
              //object.date = Math.round(date.getTime() / 1000);
              object.recordName = item.fairsharingRecord.name + ' ('+ item.fairsharingRecord.id +')';
              object.id = item.fairsharingRecord.id;
              object.type = item.fairsharingRecord.type ;
              object.userNameID = item.user.username + ' ('+item.user.id+')';
              object.processingNotes = item.fairsharingRecord.processingNotes;
              object.requestID = item.id;
              this.maintenanceRequests.push(object);
            });
            this.maintenanceRequests.sort(compareRecordDesc);
          },
          prepareRecordsCuratorCreationsLastWeek(dataCuration){
            let records = dataCuration.recentCuratorCreations;
            records.forEach(item => {
              let object = {};
              object.recordNameID = item.name+' ('+item.id+')';
              object.createdAt = item.createdAt;
              if (item.creator){
                object.creator = item.creator.username +' ('+item.creator.id+')';
              }
              else{
                object.creator = "unknown"
              }
              this.recordsCreatedCuratorsLastWeek.push(object);
            });
          },
          prepareRecordsInCuration(dataCuration){
            let userRecords = dataCuration.recordsInCuration;
            userRecords.forEach(item => {
              item.fairsharingRecords.forEach(rec => {
                let object = {};
                object.curator = item.username;
                object.recordNameID = rec.name+' ('+rec.id+')';
                let numMaint = 0;
                object.recordMaintainers = "none"
                rec.maintainers.forEach(main => {
                  if (numMaint > 0){
                    object.recordMaintainers += ', ' + main.username+' ('+main.id+')';
                  }else{
                    object.recordMaintainers = main.username+' ('+main.id+')';
                  }
                  numMaint += 1;
                });
                this.recordsInCuration.push(object);
              });
            });
          },
          prepareRecordsWithoutDois(dataCuration){
            let records = dataCuration.recordsWithoutDois;
            records.forEach(item => {
              let object = {};
              object.recordNameID = item.name+' ('+item.id+')';
              object.createdAt = item.createdAt;
              object.updatedAt = item.updatedAt;
              if (item.creator){
                object.creator = item.creator.username +' ('+item.creator.id+')';
              }else{
                object.creator = "unknown"
              }
              if (item.lastEditor){
                object.lastEditor = item.lastEditor.username +' ('+item.lastEditor.id+')';
              }else{
                object.lastEditor = "unknown"
              }
              this.recordsWithoutDois.push(object);
            });
          },
          prepareHiddenRecords(dataCuration){
            let records = dataCuration.hiddenRecords;
            records.forEach(item => {
              let object = {};
              object.recordNameID = item.name+' ('+item.id+')';
              object.createdAt = item.createdAt;
              if (item.curator){
                object.curator = item.curator.username
              }
              else{
                object.curator = 'none'
              }
              if (item.creator){
                object.creator = item.creator.username +' ('+item.creator.id+')';
              }
              else{
                object.creator = "unknown"
              }
              this.hiddenRecords.push(object);
            });
          },
          async saveProcessingNotes(idRecord,notesText){
            const _module = this;
            let preparedRecord = {
              processing_notes: ""
            };
            preparedRecord.processing_notes = notesText;
            let data = {
              record: preparedRecord,
              id: idRecord,
              token: _module.user().credentials.token
            };
            await _module.updateRecord(data);
            if (_module.recordUpdate.error){
              _module.error = _module.recordUpdate;
            }
          },
          assignMaintenanceOwner(recordName, recordID, userNameID, requestID){
            const _module = this;
            _module.dialogs.maintenanceRequests.recordName = recordName;
            _module.dialogs.maintenanceRequests.recordID = recordID;
            _module.dialogs.maintenanceRequests.userName = userNameID;
            _module.dialogs.maintenanceRequests.requestId = requestID;
            _module.dialogs.maintenanceRequests.confirmAssignment = true;
          },
          closeMaintenanceAssign () {
            this.dialogs.maintenanceRequests.confirmAssignment = false;
          },
          async assignMaintenanceOwnConfirm () {
            const _module = this;
            await restClient.updateStatusMaintenanceRequest(_module.dialogs.maintenanceRequests.requestId, "approved", this.user().credentials.token);
            if (!restClient.error){
              const index = this.maintenanceRequests.findIndex((element) => element.requestID === _module.dialogs.maintenanceRequests.requestId);
              _module.maintenanceRequests.splice(index, 1);
            }
            if (this.approvalRequired.findIndex((element) => element.id === _module.dialogs.maintenanceRequests.recordID) < 0){
              if (this.maintenanceRequests.findIndex((element) => element.id === _module.dialogs.maintenanceRequests.recordID) < 0){
                await _module.saveProcessingNotes(_module.dialogs.maintenanceRequests.recordID,"");
              }
            }
            _module.dialogs.maintenanceRequests.confirmAssignment = false;
          },
          rejectMaintenanceOwner(recordName, recordID, userNameID, requestID){
            const _module = this;
            _module.dialogs.maintenanceRequests.recordName = recordName;
            _module.dialogs.maintenanceRequests.recordID = recordID;
            _module.dialogs.maintenanceRequests.userName = userNameID;
            _module.dialogs.maintenanceRequests.requestId = requestID;
            _module.dialogs.maintenanceRequests.rejectAssignment = true;
          },
          closeMaintenanceReject () {
            this.dialogs.maintenanceRequests.rejectAssignment = false;
          },
          async rejectMaintenanceOwnConfirm () {
            const _module = this;
            await restClient.updateStatusMaintenanceRequest(_module.dialogs.maintenanceRequests.requestId, "rejected", this.user().credentials.token);
            if (!restClient.error){
              const index = this.maintenanceRequests.findIndex((element) => element.requestID === _module.dialogs.maintenanceRequests.requestId);
              _module.maintenanceRequests.splice(index, 1);
            }
            if (this.approvalRequired.findIndex((element) => element.id === _module.dialogs.maintenanceRequests.recordID) < 0){
              if (this.maintenanceRequests.findIndex((element) => element.id === _module.dialogs.maintenanceRequests.recordID) < 0){
                await _module.saveProcessingNotes(_module.dialogs.maintenanceRequests.recordID,"");
              }
            }
            _module.dialogs.maintenanceRequests.rejectAssignment = false;
          }
      }
    }
</script>

<style>
  #text-curator-search-0 div.theme--light.v-input:not(.v-input--is-disabled) input{
    color:#fff;
  }
  #text-curator-search-1 div.theme--light.v-input:not(.v-input--is-disabled) input{
    color:#fff;
  }
  #text-curator-search-2 div.theme--light.v-input:not(.v-input--is-disabled) input{
    color:#fff;
  }
  #text-curator-search-3 div.theme--light.v-input:not(.v-input--is-disabled) input{
    color:#fff;
  }
  #text-curator-search-4 div.theme--light.v-input:not(.v-input--is-disabled) input{
    color:#fff;
  }
  #text-curator-search-5 div.theme--light.v-input:not(.v-input--is-disabled) input{
    color:#fff;
  }
  table.v-table thead th {font-size: 25px !important;}

  .testDialog {
    width: 600px !important;
  }

</style>
