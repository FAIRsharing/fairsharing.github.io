<template>
  <v-container
    id="curatorPage"
    fluid
    class="standard"
  >
    <v-row v-if="user().role==='super_curator' || user().role==='senior_curator' || user().role==='developer' ">
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
        <RecordsAwaitingApproval
          :loading="loading"
          :headers="headers.approvalRequired"
          :maintenance-requests="maintenanceRequests"
          :record-type="recordType"
          :approval-required="approvalRequired"
          :curator-list="curatorList"
        />
        <MaintenanceRequest
          :loading="loading"
          :headers="headers.maintenanceRequests"
          :maintenance-requests="maintenanceRequests"
          :record-type="recordType"
          :approval-required="approvalRequired"
        />
        <v-card>
          <v-card-text v-if="hiddenRecords">
            <v-card-title
              id="text-curator-search-2"
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
            >
              <template
                v-if="recordType"
                #item="props"
              >
                <tr>
                  <td>
                    <v-avatar
                      v-if="props.item.type"
                      class="mr-2"
                      :height="40"
                    >
                      <Icon
                        :item="props.item.type"
                        :height="40"
                        wrapper-class=""
                      />
                    </v-avatar>
                    <a :href="'#/' + props.item.id">
                      {{ props.item.recordNameID }}
                    </a>
                  </td>
                  <td>
                    {{ props.item.createdAt }}
                  </td>
                  <td>
                    {{ props.item.curator }}
                  </td>
                  <td>
                    <div v-if="props.item.creator === 'unknown'">
                      {{ props.item.creator }}
                    </div>
                    <div v-else>
                      <a :href="'#/users/' + props.item.idCreator">
                        {{ props.item.creator }}
                      </a>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="recordsCreatedCuratorsLastWeek">
            <v-card-title
              id="text-curator-search-3"
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
            >
              <template
                v-if="recordType"
                #item="props"
              >
                <tr>
                  <td>
                    <v-avatar
                      v-if="props.item.type"
                      class="mr-2"
                      :height="40"
                    >
                      <Icon
                        :item="props.item.type"
                        :height="40"
                        wrapper-class=""
                      />
                    </v-avatar>
                    <a :href="'#/' + props.item.id">
                      {{ props.item.recordNameID }}
                    </a>
                  </td>
                  <td>
                    {{ props.item.createdAt }}
                  </td>
                  <td>
                    <div v-if="props.item.creator === 'unknown'">
                      {{ props.item.creator }}
                    </div>
                    <div v-else>
                      <a :href="'#/users/' + props.item.idCreator">
                        {{ props.item.creator }}
                      </a>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text>
            <v-card-title
              id="text-curator-search-1"
              class="green white--text"
            >
              RECORDS WITHOUT DOIS
              <v-btn
                v-if="downloadContent"
                class="info ml-5"
              >
                <a
                  :href="downloadContent"
                  download="recordWithoutDOIs.txt"
                >
                  <v-icon
                    color="white"
                    class="mr-1"
                  >
                    fa fa-download
                  </v-icon>
                  <span class="white--text">Obtain file</span>
                </a>
              </v-btn>
            </v-card-title>
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
  // && (user().role==='super_curator' || user().role==='senior_curator')"
    import GraphClient from "@/components/GraphClient/GraphClient.js"
    import getCurationRecords from "@/components/GraphClient/queries/curators/getSummary.json"
    import { mapActions, mapState } from "vuex"
    import Unauthorized from "@/views/Errors/403.vue"
    import headersTables from "@/data/headersCuratorDashboard.json"
    import MaintenanceRequest from "@/components/Curators/MaintenanceRequests.vue"
    import RecordsAwaitingApproval from "@/components/Curators/RecordsAwaitingApproval.vue"
    import RestClient from "@/components/Client/RESTClient.js"
    import Icon from "@/components/Icon"


    const client = new GraphClient();
    const restClient = new RestClient();

    function compareRecordDesc(a, b) {
      if (a.createdAt > b.createdAt) {
        return -1;
      }else{
        return 1;
      }
    }

    function compareRecordDescUpdate(a, b) {
      if (a.updatedAt > b.updatedAt) {
        return -1;
      }else{
        return 1;
      }
    }


    function formatDate(d){
      let date = new Date(d);
      return date.toLocaleString('default', { month: 'short' })+' '+date.getUTCDate()+ ', '+date.getUTCFullYear();
    }

    /**
     * @vue-data {Object} hideFields - an array of field to NOT display
     * */

    export default {
      name: "Curator",
      components: {
        Unauthorized,
        RecordsAwaitingApproval,
        MaintenanceRequest,
        Icon
      },
      data: () => {
        return {
          allDataCuration: null,
          approvalRequired: [],
          maintenanceRequests: [],
          recordsCreatedCuratorsLastWeek: [],
          recordsInCuration: [],
          hiddenRecords: [],
          curatorList: [],
          recordType: null,
          headers: headersTables,
          searches: {
            recentCuratorCreations: "",
            recordsInCuration: "",
            hiddenRecords: ""
          },
          loading: false,
          downloadContent: null
        }
      },
      computed: {
        ...mapState('users', ['user', "messages"]),
        ...mapState("record", ["recordUpdate"])
      },
      created() {
        this.$nextTick(function () {
          this.recordType = this.$vuetify.icons.values;
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
          await this.obtainFileRecordsWODois();
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
            this.prepareHiddenRecords(this.allDataCuration);
            this.prepareRecordsCuratorCreationsLastWeek(this.allDataCuration);
          },
          prepareApprovalRequired(dataCuration){
            let userRecords = dataCuration.approvalsRequired;
            userRecords.forEach(item => {
              item.fairsharingRecords.forEach(rec => {
                let object = {
                  createdAt: rec.createdAt,
                  updatedAt: rec.updatedAt,
                  curator: item.username.substring(0,6),
                  recordName: `${rec.name} (${rec.id})`,
                  id: rec.id,
                  type: rec.type,
                  processingNotes: rec.processingNotes
                }
                if (rec.creator){
                  object.creator = rec.creator.username.substring(0,10);
                  object.idCreator = rec.creator.id;
                }else{
                  object.creator = "unknown"
                }
                if (rec.priority){
                  object.priority = "Priority";
                }else{
                  object.priority = "";
                }
                if (rec.lastEditor){
                  object.lastEditor = rec.lastEditor.username;
                  object.idLastEditor = rec.lastEditor.id;
                }
                else{
                  object.lastEditor = "unknown"
                }
                this.approvalRequired.push(object);
              });
            });
            this.approvalRequired.sort(compareRecordDescUpdate);
            for (let i = 0; i < this.approvalRequired.length; i++) {
              this.approvalRequired[i].updatedAt = formatDate(this.approvalRequired[i].updatedAt);
              this.approvalRequired[i].createdAt = formatDate(this.approvalRequired[i].createdAt);
            }
            let curators = dataCuration.curatorList;
            let listSuper = [];
            let listSenior = [];
            let listCurator = [];
            curators.forEach(item => {
              let object = {
                id: item.id,
                userName: item.username
              };
              let role = item.role.name;
              if (role === "super_curator"){
                listSuper.push(object);
              }else{
                if (role === "senior_curator"){
                  listSenior.push(object);
                }else{
                  if (role === "curator"){
                    listCurator.push(object);
                  }
                }
              }
            });
            this.curatorList = listSuper.concat(listSenior).concat(listCurator);
            let object = {
              id: -1,
              userName: "none"
            };
            this.curatorList.push(object);
          },
          prepareMaintenanceRequests(dataCuration){
            let requests = dataCuration.pendingMaintenanceRequests;
            requests.forEach(item => {
              let object = {
                createdAt: item.createdAt,
                recordName: `${item.fairsharingRecord.name} (${item.fairsharingRecord.id})`,
                id: item.fairsharingRecord.id,
                type: item.fairsharingRecord.type,
                userName: `${item.user.username}`,
                userId: `${item.user.id}`,
                processingNotes: item.fairsharingRecord.processingNotes,
                requestID: item.id
              };
              this.maintenanceRequests.push(object);
            });
            this.maintenanceRequests.sort(compareRecordDesc);
            for (let i = 0; i < this.maintenanceRequests.length; i++) {
              this.maintenanceRequests[i].createdAt = formatDate(this.maintenanceRequests[i].createdAt) ;
            }
          },

          prepareRecordsCuratorCreationsLastWeek(dataCuration){
            let records = dataCuration.recentCuratorCreations;
            records.forEach(item => {
              let object = {
                recordNameID: `${item.name} (${item.id})`,
                type: item.type
              };
              object.createdAt = formatDate(item.createdAt);
              if (item.creator){
                object.creator = item.creator.username;
                object.idCreator = item.creator.id;
              }
              else{
                object.creator = "unknown";
              }
              this.recordsCreatedCuratorsLastWeek.push(object);
            });
          },
          prepareRecordsInCuration(dataCuration){
            let userRecords = dataCuration.recordsInCuration;
            userRecords.forEach(item => {
              item.fairsharingRecords.forEach(rec => {
                let object = {
                  curator: item.username,
                  recordNameID: `${rec.name} (${rec.id})`,
                  recordMaintainers: "none"
                };
                let numMaint = 0;
                rec.maintainers.forEach(main => {
                  if (numMaint > 0){
                    object.recordMaintainers += ', ' + main.username+' ('+main.id+')';
                  }
                  else{
                    object.recordMaintainers = main.username+' ('+main.id+')';
                  }
                  numMaint += 1;
                });
                this.recordsInCuration.push(object);
              });
            });
          },
          prepareHiddenRecords(dataCuration){
            let records = dataCuration.hiddenRecords;
            records.forEach(item => {
              let object = {
                recordNameID: `${item.name} (${item.id})`,
                type: item.type
              };
              object.createdAt = formatDate(item.createdAt);
              if (item.curator){
                object.curator = item.curator.username
              }
              else{
                object.curator = 'none'
              }
              if (item.creator){
                object.creator = item.creator.username;
                object.idCreator = item.creator.id;
              }
              else{
                object.creator = "unknown"
              }
              this.hiddenRecords.push(object);
            });
          },
          async obtainFileRecordsWODois(){
            let data = await restClient.getRecordsWoDOIs(this.user().credentials.token);
            this.downloadContent = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data)
                .replace(/^\[(.+)\]$/,'$1')
                .split(',')
                .join('\r\n')
                .replace(/['"]+/g, ''));
          }
      }
    }
</script>

<style scoped>
  #text-curator-search-1 div.theme--light.v-input:not(.v-input--is-disabled) input{
    color:#fff;
  }
  #text-curator-search-2 div.theme--light.v-input:not(.v-input--is-disabled) input{
    color:#fff;
  }
  #text-curator-search-3 div.theme--light.v-input:not(.v-input--is-disabled) input{
    color:#fff;
  }
</style>
