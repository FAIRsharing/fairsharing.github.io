<template>
  <v-container
    id="userPage"
    fluid
    class="standard"
  >
    <v-row>
      <v-col cols12>
        <v-card v-if="!messages()['getUser'].error">
          <v-list-item class="blue">
            <v-list-item-content class="pa-0">
              <v-list-item-title
                v-if="user().credentials"
                class="headline text-left white--text"
              >
                Welcome, {{ user().credentials.username }}
              </v-list-item-title>
            </v-list-item-content>
            <user-profile-menu />
          </v-list-item>
          <v-card-text
            v-if="messages()['getUser'].message"
            class="mb-0"
          >
            <v-alert
              type="success"
              class="mb-0"
            >
              {{ messages()['getUser'].message }}
            </v-alert>
          </v-card-text>
          <v-card-text class="mt-0 pt-0 container-fluid">
            <v-list-item>
              <v-list-item-content v-if="user().metadata">
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
                    v-if="user().records"
                    v-model="panel"
                    tile
                  >
                    <v-expansion-panel
                      v-for="(records, sectionName, sectionKey) in user().records"
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
                          <div v-if="records.length > 0">
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
                                              <a :href="'/#/' + record.id">
                                                {{ record.name }}
                                              </a>

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
                                      <v-btn
                                        class="red white--text"
                                        :to="'/' + record.id + '/edit'"
                                      >
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import { mapActions, mapState } from "vuex"
    import UserProfileMenu from "../../components/Users/UserProfileMenu";

    /**
     * @vue-data {Object} hideFields - an array of field to NOT display
     * */

    export default {
      name: "User",
      components: {UserProfileMenu},
      filters: {
          cleanString: function(str){
            return str.replace(/_/g, " ").replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
          }
        },
        data: () => {
          return {
              panel: 0,
              hideFields: ["role_id", "deactivated", "id", "created_at", "updated_at", "username"]
          }
        },
        computed: {
          ...mapState('users', ['user', "userResetPwdMessage", "messages"]),
          getUserMeta: function(){
            let userMeta = {};
            const _module = this;
            Object.keys(_module.user().metadata).forEach(function(field) {
              if (!_module.hideFields.includes(field)) {
                userMeta[field] = _module.user().metadata[field]
              }
            });
            return userMeta;
          }
        },
        async created(){
            await this.getUser();
            if (this.messages()["getUser"].error){
              this.setError({field:"login", message:"You've been logged out automatically"});
              this.$router.push({path: "/accounts/login"})
            }
        },
        methods: {
            ...mapActions('users', ['getUser', 'resetPwd', 'setError']),
            getRecords: function(fieldName){
              let output = this.user().records[fieldName];
              if (fieldName === "maintenanceRequests"){
                output = [];
                this.user().records[fieldName].forEach(function(record){
                  output.push(record["fairsharingRecord"])
                });
              }
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
