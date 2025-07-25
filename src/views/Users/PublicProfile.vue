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
          {{ messages()["getPublicUser"].message }}
        </v-alert>
      </v-col>
    </v-row>

    <div v-if="error">
      <NotFound />
    </div>

    <v-row v-else>
      <v-col cols="12">
        <v-toolbar
          flat
          color="primary"
          dark
          height="55"
        >
          <v-toolbar-title>
            User Profile for {{ userData.user.username }}
          </v-toolbar-title>
          <v-spacer />
          <user-profile-menu
            :viewing-id="Number($route.params.id)"
            @showConfirmDelete="showDeleteDialog()"
          />
        </v-toolbar>
      </v-col>
      <v-col
        v-if="!loading"
        cols="12"
      >
        <v-container
          fluid
          class="py-0 pa-0"
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
                        v-if="
                          fieldName !== 'preferences' && fieldName !== 'orcid'
                        "
                        class="py-0 d-block"
                      >
                        <b class="blue--text">{{ fieldName | cleanString }}:
                        </b>
                        <span v-if="field && fieldName !== 'orcid'">
                          {{ field }}
                        </span>
                        <span v-else> None </span>
                      </v-list-item-content>
                      <v-list-item-content
                        v-else-if="fieldName === 'preferences'"
                        class="py-2"
                      >
                        <b class="blue--text">{{ fieldName | cleanString }}:
                        </b>
                        <ul>
                          <li
                            v-for="(pref, prefName, prefKey) in field"
                            :key="'pref_' + prefKey"
                          >
                            {{ prefName | cleanString }}:
                            {{ booleanToString(pref) }}
                          </li>
                        </ul>
                      </v-list-item-content>
                      <v-list-item-content
                        v-else-if="fieldName === 'orcid'"
                        class="d-block py-0"
                      >
                        <div class="d-flex align-center">
                          <b
                            class="blue--text"
                            style="margin-right: 0.2rem"
                          >{{ fieldName | cleanString }}:
                          </b>
                          <a
                            v-if="field"
                            class="d-flex align-center underline-effect"
                            :href="`https://orcid.org/${field}`"
                            target="_blank"
                          >
                            <Icon
                              :height="20"
                              item="Orcid"
                              wrapper-class=""
                            />
                            <span class="ml-1">{{ field }}</span>
                          </a>
                        </div>
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
                        <v-list-item-title>
                          <a
                            v-if="pub.url"
                            :href="pub.url"
                            rel="noreferrer"
                            target="_blank"
                          >{{ pub.title }}</a>
                          <span v-else>
                            {{ pub.title }} (No available link)</span>
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
                    v-if="userData.user.orcid && !loading"
                    :href="`https://orcid.org/${userData.user.orcid}`"
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
              md="6"
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
                    :records="userData.user.maintainedRecords"
                    source="publicMaintainedRecords"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col
              cols="12"
              xl="4"
              lg="6"
              md="6"
              sm="12"
              xs="12"
              class="pt-0"
            >
              <v-card
                height="100%"
                class="d-flex flex-column rounded-0"
              >
                <v-card-title class="primary white--text py-3">
                  Record Edits
                </v-card-title>
                <v-card-text
                  class="pa-0"
                  style="flex-grow: 1"
                >
                  <EditsTable />
                </v-card-text>
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
                  Organisations
                </v-card-title>
                <v-card-text
                  class="pa-0"
                  style="flex-grow: 1"
                >
                  <ViewOrganisations
                    :organisations="userData.user.organisations"
                  />
                </v-card-text>
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
                  Awards
                </v-card-title>
                <v-card-text
                  class="pa-0"
                  style="flex-grow: 1"
                >
                  <ViewAwards :awards="userData.user.awards" />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col
              cols="12"
              xl="12"
              lg="12"
              md="12"
              sm="12"
              xs="12"
              class="pt-0"
            >
              <v-card
                height="100%"
                class="d-flex flex-column rounded-0"
              >
                <v-card-title class="primary white--text py-3 flex-column align-start">
                  <span>Saved Searches</span>
                  <v-card-subtitle class="pa-0">
                    Clicking on the name of a saved search will take you to its search results. From the results page, if you are logged in you may further refine the search and/or save the search yourself. More information on Conforming Resources and Saved Searches can be found in our <a
                      href="https://fairsharing.gitbook.io/fairsharing/how-to/advanced-search"
                      target="_blank"
                      class="white--text text-decoration-underline "
                    >Gitbook documentation</a>.
                  </v-card-subtitle>
                </v-card-title>
                <v-card-text
                  class="pa-0"
                  style="flex-grow: 1"
                >
                  <ViewSavedSearchesTable
                    :created-searches="userData.user.createdSearches"
                    :saved-searches="userData.user.savedSearches"
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
    <v-dialog
      v-model="confirmDelete"
      max-width="700px"
      persistent
    >
      <v-card>
        <v-card-title
          class="headline, justify-center"
        >
          Deleting User Account!
        </v-card-title>
        <v-card-text
          class="text-center"
        >
          <b>Are you sure you want to do that? User {{ $route.params.id }}'s account will be permanently deleted!</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="info"
            @click="confirmDelete = false"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn
            class="error"
            @click="deleteAccount()"
          >
            Delete
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

import Icon from "@/components/Icon";
import Loaders from "@/components/Navigation/Loaders";
import ViewAwards from "@/components/Users/Profiles/Private/ViewAwards";
import ViewOrganisations from "@/components/Users/Profiles/Private/ViewOrganisations";
import ViewSavedSearchesTable from "@/components/Users/Profiles/Private/ViewSavedSearchesTable.vue";
import UserProfileMenu from "@/components/Users/UserProfileMenu";
import ExternalClient from "@/lib/Client/ExternalClients.js";
import RestClient from "@/lib/Client/RESTClient";
import { cleanString } from "@/utils/stringUtils";
import NotFound from "@/views/Errors/404";

import EditsTable from "../../components/Users/Profiles/Private/EditsTable";
import RecordsTable from "../../components/Users/Profiles/Private/RecordsTable";

let client = new ExternalClient();
let restClient = new RestClient();

export default {
  name: "PublicProfile",
  components: {
    ViewSavedSearchesTable,
    ViewOrganisations,
    RecordsTable,
    EditsTable,
    Loaders,
    NotFound,
    UserProfileMenu,
    Icon,
    ViewAwards,
  },
  mixins: [cleanString],
  data: () => {
    return {
      panel: 0,
      loading: false,
      error: false,
      publications: [],
      activeTab: 0,
      confirmDelete: false,
      userData: {
        user: {
          username: "none",
        },
      },
    };
  },
  computed: {
    ...mapState("users", ["user", "messages"]),
    ...mapState("editor", ["icons"]),
    // The deletes here achieve the same function as hideFields in User.vue
    getPublicUserMeta: function () {
      let userMeta = JSON.parse(JSON.stringify(this.userData.user));
      delete userMeta["maintainedRecords"];
      delete userMeta["organisations"];
      delete userMeta["editEvents"];
      delete userMeta["role"];
      delete userMeta["awards"];
      delete userMeta["thirdParty"];
      delete userMeta["createdSearches"];
      delete userMeta["savedSearches"];
      return userMeta;
    },
  },
  async created() {
    this.loading = true;
    let userId = this.$route.params.id;
    let data = await this.getPublicUser(userId);
    if (data == null || data.user == null) {
      // No userdata, so don't look for publications.
      this.publications = [];
      this.error = true;
    } else {
      // Get user's publications.
      this.userData = data;
      this.publications = await this.getPublications();
    }
    this.loading = false;
  },
  methods: {
    ...mapActions("users", ["getPublicUser", "setError"]),
    async getPublications() {
      let output = [];
      if (this.userData.user.orcid) {
        let publications = await client.getOrcidUser(this.userData.user.orcid);
        /* istanbul ignore if */
        if (publications.error) {
          return [];
        } else {
          output = publications["activities-summary"]["works"]["group"]
            .slice(0, 7)
            .map((obj) => {
              let url = null;
              if (
                obj["work-summary"][0]["external-ids"] &&
                obj["work-summary"][0]["external-ids"]["external-id"]
              ) {
                let DOI = obj["work-summary"][0]["external-ids"][
                  "external-id"
                ].filter((obj) => obj["external-id-type"] === "doi")[0];
                // See ORCIDpub.json
                url = null;
                /* istanbul ignore next */
                if (DOI) {
                  if (DOI["external-id-url"]) {
                    url = DOI["external-id-url"].value;
                  } else if (DOI["external-id-value"]) {
                    url = "https://doi.org/" + DOI["external-id-value"];
                  }
                }
              }
              return {
                title: obj["work-summary"][0].title.title.value,
                url: url,
              };
            });
        }
      }
      return output;
    },
    showDeleteDialog() {
      if (this.user().is_super_curator) {
        this.confirmDelete = true;
      }
    },
    async deleteAccount() {
      if (this.user().is_super_curator) {
        await restClient.deletePublicUser(this.$route.params.id, this.user().credentials.token);
        this.$router.push({ path: "/" });
      }
    }
  }
};
</script>

<style scoped>
#userPage .text-truncate {
  max-width: 80%;
}

#userPage .v-toolbar {
  display: block !important;
  flex: initial !important;
}

#userPage .v-slide-group__wrapper {
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  max-height: 71vh;
}

#userPage .v-tabs .v-item-group {
  position: initial !important;
}

#userPage .v-window.v-item-group {
  min-height: 70vh;
  background: #eeeeee !important;
}

#userPage .v-tabs-bar {
  background-color: #eeeeee !important;
}

#userPage .v-slide-group__wrapper {
  background-color: white !important;
}
</style>
