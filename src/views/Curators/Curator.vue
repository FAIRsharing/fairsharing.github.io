<template>
  <v-container
    id="curatorPage"
    fluid
    class="standard"
  >
    <v-row v-if="user().is_curator">
      <v-col cols12>
        <v-card v-if="!messages()['getUser'].error">
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
          <v-card-text v-if="approvalRequired">
            <v-card-title class="green">
              Records awaiting approval
            </v-card-title>
            <v-data-table
              :headers="headersApprovalRequired"
              :items="approvalRequired"
              :items-per-page="5"
              class="elevation-1"
            />
          </v-card-text>
          <v-card-text v-if="maintenanceRequests">
            <v-card-title class="green">
              Pending Maintenance Requests
            </v-card-title>
            <v-data-table
              :headers="headersMaintenanceRequests"
              :items="maintenanceRequests"
              :items-per-page="5"
              class="elevation-1"
            />
          </v-card-text>
          <v-card-text v-if="recordsCreatedCuratorsLastWeek">
            <v-card-title class="green">
              Records created by curators in the past week
            </v-card-title>
            <v-data-table
              :headers="headersRecordsCreatedCuratorsLastWeek"
              :items="recordsCreatedCuratorsLastWeek"
              :items-per-page="5"
              class="elevation-1"
            />
          </v-card-text>
          <v-card-text v-if="recentlyUpdatedContent">
            <v-card-title class="green">
              All content added/modified recently
            </v-card-title>
            <v-data-table
              :headers="headersRecentlyUpdatedContent"
              :items="recentlyUpdatedContent"
              :items-per-page="5"
              class="elevation-1"
            />
          </v-card-text>
          <v-card-text v-if="recordsInCuration">
            <v-card-title class="green">
              Records in curation
            </v-card-title>
            <v-data-table
              :headers="headersRecordsInCuration"
              :items="recordsInCuration"
              :items-per-page="5"
              class="elevation-1"
            />
          </v-card-text>
          <v-card-text v-if="recordsWithoutDois">
            <v-card-title class="green">
              Records without dois
            </v-card-title>
            <v-data-table
              :headers="headersRecordsWithoutDois"
              :items="recordsWithoutDois"
              :items-per-page="5"
              class="elevation-1"
            />
          </v-card-text>
          <v-card-text v-if="allDataCuration">
            <v-row
              v-for="(recordTypeValue, recordTypeName, recordTypeIndex) in allDataCuration"
              :key="'recordType_' + recordTypeIndex"
            >
              {{ recordTypeName }}
              <v-col
                v-for="(recordVal, recordName, recordIndex) in recordTypeValue"
                :key="'record_' + recordIndex"
                col-xl="3"
                cols6
              >
                {{ recordName }} : {{ recordVal }}
              </v-col>
              <v-divider />
            </v-row>
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
          headersApprovalRequired: [
            {
              text: "Curator",
              value: "curator"
            },
            {
              text: "Record name (id)",
              value: "recordNameID"
            }
          ],
          headersMaintenanceRequests: [
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
          headersRecordsCreatedCuratorsLastWeek: [
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
          headersRecentlyUpdatedContent: [
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
          headersRecordsInCuration: [
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
          headersRecordsWithoutDois: [
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
          ]
        }
      },
      computed: {
        ...mapState('users', ['user', "messages"]),
      },
      async created(){
          await this.getUser();
          if (this.messages()["getUser"].error){
            this.setError({field:"login", message:"You've been logged out automatically"});
            this.$router.push({path: "/accounts/login"})
          }
          client.setHeader(this.user().credentials.token);
          let data = await client.executeQuery(getCurationRecords);
          this.allDataCuration = data["curationSummary"];
          client.initalizeHeader();
          this.prepareApprovalRequired(this.allDataCuration);
          this.prepareMaintenanceRequests(this.allDataCuration);
          this.prepareRecordsCuratorCreationsLastWeek(this.allDataCuration);
          this.prepareecentlyUpdatedContent(this.allDataCuration);
          this.prepareRecordsInCuration(this.allDataCuration);
          this.prepareRecordsWithoutDois(this.allDataCuration);
      },
      methods: {
          ...mapActions('users', ['getUser', 'setError']),
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
          prepareecentlyUpdatedContent(dataCuration){
            let _module = this;
            let content = dataCuration['recentlyUpdatedContent'];
            content.forEach(item => {
              let object = {};
              object.changes = item.changes;
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
</style>
