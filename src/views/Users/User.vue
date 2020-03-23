<template>
  <div
    id="userPage"
    class="standard container-fluid"
  >
    <v-row>
      <v-col cols12>
        <v-card>
          <v-list-item class="blue">
            <v-list-item-content class="pa-0">
              <v-list-item-title
                class="headline text-left white--text"
              >
                Welcome, {{ $store.state.users.currentUserID }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-card-text class="container-fluid">
            <v-list-item>
              <v-list-item-content>
                <!-- META -->
                <v-list-item
                  v-for="(field, fieldName, fieldKey) in getUserMeta"
                  :key="'userMeta' + fieldKey"
                  class="body-1"
                >
                  <div v-if="!hideFields.includes(fieldName)">
                    <b class="blue--text">{{ fieldName | cleanString }}: </b>
                    <span v-if="field"> {{ field }} </span>
                    <span v-else> None </span>
                  </div>
                </v-list-item>

                <v-divider class="mb-10" />

                <!-- NEW DETAILS PANELS -->
                <v-list-item>
                  <v-expansion-panels
                    v-model="panel"
                    tile
                  >
                    <v-expansion-panel
                      v-for="(records, sectionName, sectionKey) in userDetail"
                      :key="sectionKey"
                    >
                      <v-expansion-panel-header
                        class="headline blue--text"
                        expand-icon="fa-arrow-down blue--text"
                      >
                        {{ sectionName | cleanString }}
                      </v-expansion-panel-header>

                      <v-expansion-panel-content>
                        <div class="body-1 py-5">
                          <div v-if="records.length === undefined || records.length > 0">
                            <div class="container--fluid">
                              <v-row>
                                <v-col
                                  v-for="(record, index) in getRecords(sectionName)"
                                  :key="'recordCol_'+index"
                                  xl="2"
                                >
                                  <v-card>
                                    <v-card-text class="pb-0">
                                      <v-list-item
                                        three-line
                                      >
                                        <v-list-item-content>
                                          <v-list-item-title>
                                            <span>
                                              <router-link :to="'/' + record.id">
                                                {{ record.name }}
                                              </router-link>

                                            </span>
                                          </v-list-item-title>
                                          <v-list-item-subtitle>
                                            <span v-if="record['doi'] !== null"><b>DOI:</b> {{ record.doi }}</span>
                                            <span v-else><b>Legacy ID:</b> {{ record.legacyIds[0] }}</span>
                                          </v-list-item-subtitle>
                                          <v-list-item-subtitle>
                                            {{ record.description }}
                                          </v-list-item-subtitle>
                                        </v-list-item-content>
                                      </v-list-item>
                                    </v-card-text>
                                    <v-card-actions class="px-5 pb-5">
                                      <v-btn class="red white--text">
                                        Admin Edit
                                      </v-btn>
                                      <v-btn class="green white--text">
                                        Approve Record
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-col>
                              </v-row>
                            </div>
                          </div>
                          <span v-else> None </span>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-list-item>
              </v-list-item-content>
            </v-list-item>
          </v-card-text>

          <v-card-actions>
            <v-btn @click="logoutUser()">
              Logout
            </v-btn>
            <v-btn @click="resetPwd()">
              Reset password
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
    import { mapActions } from "vuex"
    import RESTClient from "@/components/Client/RESTClient.js"
    import GraphClient from "@/components/GraphClient/GraphClient.js"
    import query from "@/components/GraphClient/queries/getUserMeta.json"

    let client = new RESTClient();
    let graphClient = new GraphClient();

    /**
     * @vue-data {Object} hideFields - an array of field to NOT display
     * */

    export default {
        name: "User",
        filters: {
          cleanString: function(str){
            return str.replace(/_/g, " ").replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
          }
        },
        data: () => {
          return {
              panel: 0,
              user: null,
              userDetail: null,
              hideFields: ["role_id", "deactivated", "id", "created_at", "updated_at", "username"]
          }
        },
        computed: {
          getUserMeta: function(){
            let userMeta = {};
            const _module = this;
            if (_module.user) {
              Object.keys(_module.user).forEach(function (field) {
                if (!_module.hideFields.includes(field)) {
                  userMeta[field] = _module.user[field]
                }
              });
            }
            return userMeta;
          }
        },
        async created(){
            this.user = await client.getUser(this.$store.state.users.currentUserToken);
            query.queryParam.id = this.user.id;
            let response = await graphClient.executeQuery(query);
            this.userDetail = response.user
        },
        methods: {
            ...mapActions('users', ['logout']),
            logoutUser: async function(){
                await this.logout(this.$store.state.users.currentUserToken);
                this.$router.push({name: "Login"})
            },
            resetPwd: async function(){
                await client.resetPassword(this.$store.state.users.currentUserToken);
            },
            getRecords: function(fieldName){
              let output = this.userDetail[fieldName];
              if (fieldName === "maintenanceRequests"){
                console.log(this.userDetail[fieldName]);
                output = [];
                this.userDetail[fieldName].forEach(function(record){
                  output.push(record["fairsharingRecord"])
                });
              }
              console.log(output);
              return output;
            }
        }
    }
</script>

<style>
  #userPage div.v-expansion-panel-content__wrap{
    border-top:1px solid rgba(0,0,0,0.11);
  }
</style>
