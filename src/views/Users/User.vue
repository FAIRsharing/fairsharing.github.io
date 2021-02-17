<template>
  <v-container
    id="userPage"
    fluid
    class="standard"
  >
    <v-row v-if="messages()['getUser'].message">
      <v-col cols="12">
        <v-alert
          type="success"
          class="mb-0"
          dismissible
        >
          {{ messages()['getUser'].message }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-if="user().metadata">
      <v-col
        v-if="!messages()['getUser'].error"
        cols12
      >
        <v-tabs vertical>
          <v-toolbar
            flat
            color="primary"
            dark
            height="55"
          >
            <v-toolbar-title>User Profile</v-toolbar-title>
            <v-spacer />
            <user-profile-menu />
          </v-toolbar>
          <!-- tabs selector -->
          <v-tab class="justify-start">
            <span> General Information </span>
          </v-tab>
          <v-tab class="justify-start">
            <span> Maintenance Requests </span>
          </v-tab>
          <v-tab class="justify-start">
            <span> Created Records </span>
          </v-tab>
          <v-tab class="justify-start">
            <span> Maintained Records </span>
          </v-tab>
          <v-tab class="justify-start">
            <span> Watched Records </span>
          </v-tab>
          <v-tab
            v-if="user().is_curator"
            class="justify-start"
          >
            <span>Records in Curation</span>
          </v-tab>

          <!-- tab content -->
          <v-tab-item class="px-5">
            <v-container
              fluid
              class="py-0"
            >
              <v-row>
                <v-col
                  cols="12"
                  xl="3"
                  lg="6"
                  md="12"
                  sm="12"
                  xs="12"
                  class="pt-0"
                >
                  <v-card
                    class="d-flex flex-column rounded-0"
                    height="100%"
                  >
                    <v-card-title class="primary white--text py-3">
                      General Information
                    </v-card-title>
                    <v-card-text class="pb-0">
                      <v-list>
                        <v-list-item
                          v-for="(field, fieldName, fieldKey) in getUserMeta"
                          :key="'userMeta' + fieldKey"
                          class="body-1"
                        >
                          <v-list-item-content
                            v-if="fieldName !== 'preferences'"
                            class="py-2"
                          >
                            <b class="blue--text">{{ fieldName | cleanString }}: </b>
                            <span v-if="field"> {{ field }} </span>
                            <span v-else> None </span>
                          </v-list-item-content>
                          <v-list-item-content
                            v-else
                            class="py-2"
                          >
                            <b class="blue--text">{{ fieldName | cleanString }}: </b>
                            <ul>
                              <li
                                v-for="(pref, prefName, prefKey) in field"
                                :key="'pref_' + prefKey"
                              >
                                {{ prefName | cleanString }}: {{ booleanToString(pref) }}
                              </li>
                            </ul>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col
                  class="pt-0"
                  cols="12"
                  xl="6"
                  lg="6"
                  md="12"
                  sm="12"
                  xs="12"
                >
                  <v-card
                    height="100%"
                    class="d-flex flex-column rounded-0"
                  >
                    <v-card-title class="primary white--text py-3">
                      Most recent publications
                    </v-card-title>
                    <v-card-text
                      class="pt-3 pb-0"
                      style="flex-grow: 1"
                    >
                      <v-list v-if="publications.length > 0">
                        <v-list-item
                          v-for="(pub, index) in publications"
                          :key="'pub_' + index"
                        >
                          <v-list-item-content>
                            <v-list-item-title>{{ pub }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                      <div v-if="publications.length === 0 && !loading">
                        You do not have an ORCID. Set one <a
                          href="https://orcid.org/register"
                          rel="external"
                          target="_blank"
                        >here.</a>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        v-if="user().metadata.orcid && !loading"
                        :href="`https://orcid.org/${user().metadata.orcid}`"
                        rel="external"
                        target="_blank"
                      >
                        View ORCID profile
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col
                  class="pt-0"
                  cols="12"
                  xl="3"
                  lg="6"
                  md="12"
                  sm="12"
                  xs="12"
                >
                  <v-card
                    height="100%"
                    class="d-flex flex-column rounded-0"
                  >
                    <v-card-title class="primary white--text py-3">
                      Watched Records
                    </v-card-title>
                    <v-card-text
                      class="pt-3 pb-0"
                      style="flex-grow: 1"
                    >
                      <v-list v-if="user().records.watchedRecords">
                        <v-list-item
                          v-for="(record, index) in user().records.watchedRecords.slice(0, 6)"
                          :key="'record_' + index"
                        >
                          <v-list-item-avatar>
                            <v-img :src="icons()[record.type]" />
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title>{{ record.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ record.registry }} - {{ record.type | cleanString }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn>
                        View all
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-tab-item>
          <v-tab-item class="px-5">
            <RecordCard records-type="maintenanceRequests" />
          </v-tab-item>
          <v-tab-item class="px-5">
            <RecordCard records-type="createdRecords" />
          </v-tab-item>
          <v-tab-item class="px-5">
            <RecordCard records-type="maintainedRecords" />
          </v-tab-item>
          <v-tab-item class="px-5">
            <RecordCard records-type="watchedRecords" />
          </v-tab-item>
          <v-tab-item
            v-if="user().is_curator"
            class="px-5"
          >
            <RecordCard records-type="recordsInCuration" />
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
    <v-fade-transition>
      <v-overlay
        v-if="loading"
        :absolute="false"
        opacity="0.8"
      >
        <loaders />
      </v-overlay>
    </v-fade-transition>
  </v-container>
</template>

<script>
    import { mapActions, mapState } from "vuex"
    import UserProfileMenu from "@/components/Users/UserProfileMenu";
    import Loaders from "@/components/Navigation/Loaders";
    import RecordCard from "@/components/Users/Profiles/Private/RecordCard";
    import ExternalClient from "@/components/Client/ExternalClients.js"

    let client = new ExternalClient();

    /**
     * @vue-data {Object} hideFields - an array of field to NOT display
     * */

    export default {
      name: "User",
      components: {Loaders, UserProfileMenu, RecordCard},
      filters: {
          cleanString: function(str){
            return str.replace(/_/g, " ").replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
          }
        },
      data: () => {
        return {
            panel: 0,
            hideFields: ["role_id", "deactivated", "id", "created_at", "updated_at", "username"],
            loading: false,
            publications: []
        }
      },
      computed: {
        ...mapState('users', ['user', "userResetPwdMessage", "messages"]),
        ...mapState('editor', ['icons']),
        getUserMeta: function(){
          let userMeta = {};
          const _module = this;
          Object.keys(_module.user().metadata).forEach(function(field) {
            if (!_module.hideFields.includes(field)) {
              userMeta[field] = _module.user().metadata[field]
            }
          });
          return userMeta;
        },
      },
      async created(){
          this.loading = true;
          await this.getUser(); // we need the user BEFORE getting the publications.
          if (this.messages()["getUser"].error){
            this.setError({field:"login", message:"You've been logged out automatically"});
            this.$router.push({path: "/accounts/login"})
          }
          this.publications = await this.getPublications();
          this.loading = false;
      },
      methods: {
          ...mapActions('users', ['getUser', 'resetPwd', 'setError']),
          async getPublications(){
            let output = [];
            if (this.user().metadata.orcid) {
              let publications = await client.getOrcidUser("0000-0002-2109-489X");
              output = publications['activities-summary']['works']['group']
                      .slice(0, 8)
                      .map(obj => {return obj['work-summary'][0].title.title.value});
            }
            return output;
          },
          booleanToString(bool){
            if (bool) return "Yes";
            return "No"
          }
      }
    }
</script>

<style>
  #userPage .text-truncate {
    max-width: 80%;
  }

  #userPage .v-toolbar {
    display: block !important;
    flex: initial !important;
  }

  #userPage .v-slide-group__wrapper {
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    max-height: 89vh;
    transition: height 450ms;
  }

  #userPage .v-tabs .v-item-group {
    position: initial !important;
  }

  .v-window.v-item-group {
    min-height: 70vh;
  }

</style>
