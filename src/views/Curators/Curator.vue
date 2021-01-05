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
              Records awaiting approval
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
              Pending Maintenance Requests
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
            />
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="recordsInCuration">
            <v-card-title
              id="text-curator-search-4"
              class="green white--text"
            >
              Records in curation
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
          <v-card-text>
            <v-card-title
              class="green white--text"
            >
              Records without dois
              <a
                class="ml-5"
                :href="obtainFileRecordsWODois()"
                download="recordWithoutDOIs.txt"
              >
                <v-icon
                  color="white"
                  class="mr-1"
                >
                  fa fa-download
                </v-icon>
                <span class="white">Obtain file</span>
              </a>
            </v-card-title>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="hiddenRecords">
            <v-card-title
              id="text-curator-search-7"
              class="green white--text"
            >
              Hidden records
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
              Records created by curators in the past week
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
    import getCurationRecords from "@/components/GraphClient/queries/curators/getSummary.json"
    import { mapActions, mapState } from "vuex"
    import Unauthorized from "@/views/Errors/403.vue"
    import recordTypes from "@/data/recordsRegistries.json"
    import RestClient from "@/components/Client/RESTClient.js"

    const client = new GraphClient();
    const restClient = new RestClient();

    /**
     * @vue-data {Object} hideFields - an array of field to NOT display
     * */

    export default {
      name: "Curator",
      components: {Unauthorized},
      data: () => {
        return {
          allDataCuration: null,
          approvalRequired: [],
          maintenanceRequests: [],
          recordsCreatedCuratorsLastWeek: [],
          recordsInCuration: [],
          hiddenRecords: [],
          recordType: null,
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
                value: "recordNameID"
              },
              {
                text: "User login (id)",
                value: "userNameID"
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
            hiddenRecords: ""
          },
          loading: false
        }
      },
      computed: {
        ...mapState('users', ['user', "messages"]),
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
              object.createdAt = item.createdAt;
              object.recordNameID = item.fairsharingRecord.name+' ('+item.fairsharingRecord.id+')';
              object.userNameID = item.user.username+' ('+item.user.id+')';
              this.maintenanceRequests.push(object);
            });
          },
          prepareRecordsCuratorCreationsLastWeek(dataCuration){
            let records = dataCuration.recentCuratorCreations;
            records.forEach(item => {
              let object = {};
              object.recordNameID = item.name+' ('+item.id+')';
              object.createdAt = item.createdAt;
              if (item.creator){
                object.creator = item.creator.username +' ('+item.creator.id+')';
              }else{
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
          prepareHiddenRecords(dataCuration){
            let records = dataCuration.hiddenRecords;
            records.forEach(item => {
              let object = {};
              object.recordNameID = item.name+' ('+item.id+')';
              object.createdAt = item.createdAt;
              if (item.curator){
                object.curator = item.curator.username
              }else{
                object.curator = 'none'
              }
              if (item.creator){
                object.creator = item.creator.username +' ('+item.creator.id+')';
              }else{
                object.creator = "unknown"
              }
              this.hiddenRecords.push(object);
            });
          },
          async obtainFileRecordsWODois(){
            let data = await restClient.getRecordsWoDOIs(this.user().credentials.token);
            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data).replace(/^\[(.+)\]$/,'$1').split(',').join('\r\n').replace(/['"]+/g, ''));
            //let downloadAnchorNode = document.createElement('a');
            //downloadAnchorNode.setAttribute("href",     dataStr);
            //downloadAnchorNode.setAttribute("download", "recordsWithoutDOIs.txt");
            //document.body.appendChild(downloadAnchorNode); // required for firefox
            //console.log(downloadAnchorNode);
            //downloadAnchorNode.click();
            //downloadAnchorNode.remove();
            //console.log(dataStr);
            return dataStr;
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
</style>
