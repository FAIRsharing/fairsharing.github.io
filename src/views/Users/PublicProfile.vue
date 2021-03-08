<template>
  <v-container
    id="userPage"
    fluid
    class="standard grey lighten-3 pb-10"
  >
    <v-row v-if="messages()['getPublicUser'].message">
      <v-col cols="12">
        <v-alert
          type="success"
          class="mb-0"
          dismissible
        >
          {{ messages()['getPublicUser'].message }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-if="user().isLoggedIn && !messages()['getPublicUser'].error">
      <v-col cols="12">
        <v-toolbar
          flat
          color="primary"
          dark
          height="55"
        >
          <v-toolbar-title>User Profile for {{ this.userData.user.username }}</v-toolbar-title>
          <v-spacer />
          <user-profile-menu />
        </v-toolbar>
      </v-col>
      <v-col
        v-if="!loading"
        cols="12"
      >
        <v-container
          fluid
          class="py-0"
        >
          <v-row>
            <v-col
              cols="12"
              xl="2"
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
                  Personal Information
                </v-card-title>
                <v-card-text class="pt-3 pb-0">
                  <v-list>
                    <v-list-item
                      v-for="(field, fieldName, fieldKey) in getPublicUserMeta"
                      :key="'userMeta' + fieldKey"
                      class="body-1"
                    >
                      <v-list-item-content
                        v-if="fieldName !== 'preferences'"
                        class="py-0 d-block"
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
              lg="5"
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
                        <v-list-item-title>
                          <a
                            v-if="pub.url"
                            :href="pub.url"
                            rel="noreferrer"
                            target="_blank"
                          >{{ pub.title }}</a>
                          <span v-else> {{ pub.title }} (No available link)</span>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <div v-if="publications.length === 0 && !loading">
                    This user does not have any publications listed on ORCID.
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    v-if="this.userData.user.orcid && !loading"
                    :href="`https://orcid.org/${this.userData.user.orcid}`"
                    rel="external"
                    target="_blank"
                  >
                    View ORCID profile
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col
              cols="12"
              xl="4"
              lg="6"
              md="12"
              sm="12"
              xs="12"
              class="pt-0"
            >
              <v-card
                height="100%"
                class="d-flex flex-column rounded-0"
              >
                <v-card-title class="primary white--text py-3">
                  Maintained Records
                </v-card-title>
                <v-card-text
                  class="pa-0"
                  style="flex-grow: 1"
                >
                  <RecordsTable
                    :records="this.userData.user.maintainedRecords"
                    source="publicMaintainedRecords"
                  />
                </v-card-text>
              </v-card>
            </v-col>

          </v-row>
        </v-container>
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
    import { mapActions, mapState, mapMutations } from "vuex"
    import UserProfileMenu from "@/components/Users/UserProfileMenu";
    import Loaders from "@/components/Navigation/Loaders";
    import ExternalClient from "@/components/Client/ExternalClients.js"
    import RecordsTable from "../../components/Users/Profiles/Private/RecordsTable";
    import { cleanString } from "@/utils/stringUtils"

    let client = new ExternalClient();

    /**
     * @vue-data {Object} hideFields - an array of field to NOT display
     * */

    export default {
      name: "PublicProfile",
      components: {RecordsTable, Loaders, UserProfileMenu},
      mixins: [cleanString],
      data: () => {
        return {
            panel: 0,
            loading: false,
            publications: [],
            activeTab: 0,
            userData: {}
        }
      },
      computed: {
        ...mapState('users', ['user', "userResetPwdMessage", "messages"]),
        ...mapState('editor', ['icons']),
        getPublicUserMeta: function(){
          let userMeta = JSON.parse(JSON.stringify(this.userData.user));
          delete userMeta["maintainedRecords"];
          return userMeta;
        },
      },
      async created(){
          this.loading = true;
          let userId = this.$route.params.id;
          this.userData = await this.getPublicUser(userId);
          if (!this.messages()["getPublicUser"].error){
            this.publications = await this.getPublications();
          }
          else {
            this.publications = [];
          }
          this.loading = false;
      },
      methods: {
          ...mapActions('users', ['getPublicUser', 'resetPwd', 'setError']),
          ...mapMutations('users', ['cleanStore']),
          async getPublications(){
            let output = [];
            if (this.userData.user.orcid) {
              let publications = await client.getOrcidUser(this.userData.user.orcid);
              output = publications['activities-summary']['works']['group']
                      .slice(0, 7)
                      .map(obj => {
                        let url = null;
                        if(obj['work-summary'][0]['external-ids'] && obj['work-summary'][0]['external-ids']['external-id']) {
                          let DOI = obj['work-summary'][0]['external-ids']['external-id'].filter(
                                  obj => obj['external-id-type'] = "doi"
                          )[0];
                          url = DOI['external-id-url'] ? DOI['external-id-url'].value : null
                        }
                        return {
                          title: obj['work-summary'][0].title.title.value,
                          url: url
                        }
                      });
            }
            return output;
          },
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
    max-height: 71vh;
  }

  #userPage .v-tabs .v-item-group {
    position: initial !important;
  }

  #userPage .v-window.v-item-group {
    min-height: 70vh;
    background: #EEEEEE !important;
  }

  #userPage .v-tabs-bar {
    background-color: #EEEEEE !important
  }

  #userPage .v-slide-group__wrapper {
    background-color: white !important;
  }

</style>
