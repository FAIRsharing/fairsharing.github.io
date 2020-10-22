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
          <v-card-text v-if="maintenanceRequests">
            <v-card-title>
              Pending Maintenance Requests
            </v-card-title>
            <v-data-table
              :headers="headersMaintenanceRequests"
              :items="maintenanceRequests"
              :items-per-page="5"
              class="elevation-1"
            />
          </v-card-text>
          <v-card-text v-if="allDataCuration">
            <v-card-title>
              Records in curation
            </v-card-title>
            <v-data-table
              :headers="headersRecordsInCuration"
              :items="recordsInCuration"
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
      filters: {
          cleanString: function(str){
            return str.replace(/_/g, " ").replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
          }
      },
      data: () => {
        return {
          allDataCuration: null,
          maintenanceRequests: [],
          recordsInCuration: [],
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
              value: "usernameID"
            }
          ],
          headersRecordsInCuration: [
            {
              text: "Curator",
              value: "username"
            },
            {
              text: "Record name (id)",
              value: "recordNameID"
            },
            {
              text: "Status",
              value: "recordStatus"
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
          this.prepareMaintenanceRequests(this.allDataCuration);
          this.prepareRecordsInCuration(this.allDataCuration);
      },
      methods: {
          ...mapActions('users', ['getUser', 'setError']),
          prepareMaintenanceRequests(dataCuration){
            let _module = this;
            let requests = dataCuration['pendingMaintenanceRequests'];
            requests.forEach(item => {
              let object = {};
              object.id = item.id;
              object.recordNameID = item['fairsharingRecord'].name+' ('+item['fairsharingRecord'].id+')';
              object.usernameID = item['user'].username+' ('+item['user'].id+')';
              _module.maintenanceRequests.push(object);
            });
          },
          prepareRecordsInCuration(dataCuration){
            let _module = this;
            let userRecords = dataCuration['recordsInCuration'];
            userRecords.forEach(item => {
              item['fairsharingRecords'].forEach(rec => {
                let object = {};
                object.username = item['username'];
                object.recordNameID = rec.name+' ('+rec.id+')';
                object.recordStatus = rec.status;
                _module.recordsInCuration.push(object);
              });
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
