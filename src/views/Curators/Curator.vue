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
            <v-card-title class="green white--text">
              Records awaiting approval
              <v-spacer />
              <v-text-field
                v-model="search1"
                label="Search"
                color="white--text"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :headers="headers.approvalRequired"
              :items="approvalRequired"
              :search="search1"
              class="elevation-1"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
            />
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="maintenanceRequests">
            <v-card-title class="green white--text">
              Pending Maintenance Requests
              <v-spacer />
              <v-text-field
                v-model="search2"
                label="Search"
                color="white--text"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :headers="headers.maintenanceRequests"
              :items="maintenanceRequests"
              :search="search2"
              class="elevation-1"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
            />
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="recordsCreatedCuratorsLastWeek">
            <v-card-title class="green white--text">
              Records created by curators in the past week
              <v-spacer />
              <v-text-field
                v-model="search3"
                label="Search"
                color="white--text"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :headers="headers.recordsCreatedCuratorsLastWeek"
              :items="recordsCreatedCuratorsLastWeek"
              :search="search3"
              class="elevation-1"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
            />
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="recentlyUpdatedContent">
            <v-card-title class="green white--text">
              All content added/modified recently
              <v-spacer />
              <v-text-field
                v-model="search4"
                label="Search"
                color="white--text"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :headers="headers.recentlyUpdatedContent"
              :items="recentlyUpdatedContent"
              :search="search4"
              class="elevation-1"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
            />
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="recordsInCuration">
            <v-card-title class="green white--text">
              Records in curation
              <v-spacer />
              <v-text-field
                v-model="search5"
                label="Search"
                color="white--text"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :headers="headers.recordsInCuration"
              :items="recordsInCuration"
              :search="search5"
              class="elevation-1"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
            />
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-text v-if="recordsWithoutDois">
            <v-card-title class="green white--text">
              Records without dois
              <v-spacer />
              <v-text-field
                v-model="search6"
                label="Search"
                color="white--text"
                single-line
                hide-details
              />
            </v-card-title>
            <v-data-table
              :headers="headers.recordsWithoutDois"
              :items="recordsWithoutDois"
              :search="search6"
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

    const client = new GraphClient();

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
          recentlyUpdatedContent: [],
          recordsInCuration: [],
          recordsWithoutDois: [],
          headers: {
            approvalRequired: [
              {
                text: "Curator",
                value: "curator"
              },
              {
                text: "Record name (id)",
                value: "recordNameID"
              }
            ],
            maintenanceRequests: [
              {
                text: "Request Id",
                value: "id"
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
                text: "Aproved",
                value: "isApproved"
              }
            ],
            recentlyUpdatedContent: [
              {
                text: "Record name (id)",
                value: "recordNameID"
              },
              {
                text: "The change set",
                value: "change"
              },
              {
                text: "Modified by",
                value: "modifiedBy"
              },
              {
                text: "Date modified",
                value: "modifiedAt"
              },
              {
                text: "Event",
                value: "event"
              }
            ],
            recordsInCuration: [
              {
                text: "Curator",
                value: "curator"
              },
              {
                text: "Record name (id)",
                value: "recordNameID"
              },
              {
                text: "Status",
                value: "recordStatus"
              }
            ],
            recordsWithoutDois: [
              {
                text: "Record name (id)",
                value: "recordNameID"
              },
              {
                text: "Status",
                value: "recordStatus"
              },
              {
                text: "Date created",
                value: "createdAt"
              }
            ],
          },
          search1: "",
          search2: "",
          search3: "",
          search4: "",
          search5: "",
          search6: ""
        }
      },
      computed: {
        ...mapState('users', ['user', "messages"]),
      },
      async mounted() {
          await this.getUser();
          if (this.messages()["getUser"].error){
            this.setError({field:"login", message:"You've been logged out automatically"});
            this.$router.push({path: "/accounts/login"})
          }
          client.setHeader(this.user().credentials.token);
          let data = await client.executeQuery(getCurationRecords);
          this.allDataCuration = data["curationSummary"];
          client.initalizeHeader();
          this.prepareData();
      },
      methods: {
          ...mapActions('users', ['getUser', 'setError']),
          prepareData(){
            let _module = this;
            _module.prepareApprovalRequired(_module.allDataCuration);
            _module.prepareMaintenanceRequests(_module.allDataCuration);
            _module.prepareRecordsCuratorCreationsLastWeek(_module.allDataCuration);
            _module.prepareRecentlyUpdatedContent(_module.allDataCuration);
            _module.prepareRecordsInCuration(_module.allDataCuration);
            _module.prepareRecordsWithoutDois(_module.allDataCuration);
          },
          prepareApprovalRequired(dataCuration){
            let _module = this;
            let userRecords = dataCuration['approvalsRequired'];
            userRecords.forEach(item => {
              item['fairsharingRecords'].forEach(rec => {
                let object = {};
                object.curator = item['username'];
                object.recordNameID = rec.name+' ('+rec.id+')';
                _module.approvalRequired.push(object);
              });
            });
          },
          prepareMaintenanceRequests(dataCuration){
            let _module = this;
            let requests = dataCuration['pendingMaintenanceRequests'];
            requests.forEach(item => {
              let object = {};
              object.id = item.id;
              object.recordNameID = item['fairsharingRecord'].name+' ('+item['fairsharingRecord'].id+')';
              object.userNameID = item['user'].username+' ('+item['user'].id+')';
              _module.maintenanceRequests.push(object);
            });
          },
          prepareRecordsCuratorCreationsLastWeek(dataCuration){
            let _module = this;
            let records = dataCuration['recentCuratorCreations'];
            records.forEach(item => {
              let object = {};
              object.recordNameID = item.name+' ('+item.id+')';
              object.createdAt = item.createdAt;
              object.isApproved = item.isApproved;
              _module.recordsCreatedCuratorsLastWeek.push(object);
            });
          },
          prepareRecentlyUpdatedContent(dataCuration){
            let _module = this;
            let content = dataCuration['recentlyUpdatedContent'];
            content.forEach(item => {
              let object = {};
              object.change = JSON.stringify(item.changes);
              object.recordNameID = item['fairsharingRecord'].name+' ('+item['fairsharingRecord'].id+')';
              object.modifiedAt = item.modifiedAt;
              object.modifiedBy = item.modifiedBy;
              object.event = item.type;
              _module.recentlyUpdatedContent.push(object);
            });
          },
          prepareRecordsInCuration(dataCuration){
            let _module = this;
            let userRecords = dataCuration['recordsInCuration'];
            userRecords.forEach(item => {
              item['fairsharingRecords'].forEach(rec => {
                let object = {};
                object.curator = item['username'];
                object.recordNameID = rec.name+' ('+rec.id+')';
                object.recordStatus = rec.status;
                _module.recordsInCuration.push(object);
              });
            });
          },
          prepareRecordsWithoutDois(dataCuration){
            let _module = this;
            let records = dataCuration['recordsWithoutDois'];
            records.forEach(item => {
              let object = {};
              object.recordNameID = item.name+' ('+item.id+')';
              object.createdAt = item.createdAt;
              object.recordStatus = item.status;
              _module.recordsWithoutDois.push(object);
            });
          }
      }
    }
</script>

<style>
  #userPage div.v-expansion-panel-content__wrap{
    border-top:1px solid rgba(0,0,0,0.11);
  }
  .theme--light.v-input:not(.v-input--is-disabled) input{
    color:#fff;
  }
</style>
