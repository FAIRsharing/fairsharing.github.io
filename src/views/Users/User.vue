<template>
  <v-container id="userPage" fluid class="standard bg-grey-lighten-3 pb-10">
    <v-row v-if="messages()['getUser'].message">
      <v-col cols="12">
        <v-alert type="success" class="mb-0" closable>
          {{ messages()["getUser"].message }}
        </v-alert>
      </v-col>
    </v-row>
    <v-row v-if="user().isLoggedIn && !messages()['getUser'].error">
      <v-col cols="12">
        <v-toolbar flat color="primary" dark height="55">
          <v-toolbar-title>User Profile</v-toolbar-title>
          <v-spacer />
          <user-profile-menu @show-confirm-delete="showDeleteDialog()" />
        </v-toolbar>
      </v-col>
      <v-col v-if="!loading" cols="12">
        <v-container fluid class="py-0 pa-0">
          <v-row>
            <v-col cols="12" xl="2" lg="6" md="12" sm="12" xs="12" class="pt-0">
              <v-card class="d-flex flex-column rounded-0" height="100%">
                <v-card-title class="bg-primary text-white py-3">
                  Personal Information
                </v-card-title>
                <v-card-text class="pt-3 pb-0">
                  <v-list>
                    <v-list-item
                      v-for="(field, fieldName, fieldKey) in getUserMeta"
                      :key="'userMeta' + fieldKey"
                      class="text-body-1"
                    >
                      <div
                        v-if="fieldName !== 'preferences'"
                        class="py-0 d-block"
                      >
                        <b class="text-blue"
                          >{{ $filters.cleanString(fieldName) }}:
                        </b>
                        <span v-if="field"> {{ field }} </span>
                        <span v-else> None </span>
                      </div>
                      <div v-else class="py-2">
                        <b class="text-blue"
                          >{{ $filters.cleanString(fieldName) }}:
                        </b>
                        <ul>
                          <li
                            v-for="(pref, prefName, prefKey) in field"
                            :key="'pref_' + prefKey"
                          >
                            {{ $filters.cleanString(prefName) }}:
                            {{ booleanToString(pref) }}
                          </li>
                        </ul>
                      </div>
                    </v-list-item>
                  </v-list>
                  <div class="d-flex flex-row ml-4 mb-4">
                    <a
                      :href="getHostname() + 'users/' + user().id"
                      target="_blank"
                      class="underline-effect"
                    >
                      {{ getHostname() + "users/" + user().id }}
                    </a>
                    <v-tooltip location="top">
                      <template #activator="{ props }">
                        <v-icon
                          v-ripple
                          class="text-primary ml-2 cursor-pointer"
                          size="small"
                          v-bind="props"
                          @click="copyURL"
                        >
                          fas fa-copy
                        </v-icon>
                      </template>
                      <span v-if="!copyButtonStatus"> Copy URL </span>
                      <span v-else> URL copied </span>
                    </v-tooltip>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col class="pt-0" cols="12" xl="6" lg="6" md="12" sm="12" xs="12">
              <v-card height="100%" class="d-flex flex-column rounded-0">
                <v-card-title class="bg-primary text-white py-3">
                  Most recent publications
                </v-card-title>
                <v-card-text class="pt-3 pb-0" style="flex-grow: 1">
                  <v-list v-if="publications.length > 0">
                    <v-list-item
                      v-for="(pub, index) in publications"
                      :key="'pub_' + index"
                    >
                      <v-list-item-title>
                        <a
                          v-if="pub.url"
                          :href="pub.url"
                          rel="noreferrer"
                          target="_blank"
                          >{{ pub.title }}</a
                        >
                        <span v-else> {{ pub.title }} (No available link)</span>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                  <div v-if="publications.length === 0 && !loading">
                    No publications found.
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    v-if="user().metadata.orcid && !loading"
                    :href="`https://orcid.org/${user().metadata.orcid}`"
                    rel="external"
                    target="_blank"
                    variant="elevated"
                    color="orcid_green"
                    style="color: white !important"
                  >
                    View ORCID profile
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col class="pt-0" cols="12" xl="4" lg="6" md="12" sm="12" xs="12">
              <v-card height="100%" class="d-flex flex-column rounded-0">
                <v-card-title class="bg-primary text-white py-3">
                  Watched Records
                </v-card-title>
                <v-card-text class="pa-0" style="flex-grow: 1">
                  <RecordsTable
                    :records="user().records.watchedRecords"
                    source="watchedRecords"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" xl="4" lg="6" md="12" sm="12" xs="12" class="pt-0">
              <v-card height="100%" class="d-flex flex-column rounded-0">
                <v-card-title class="bg-primary text-white py-3">
                  Record Edits
                </v-card-title>
                <v-card-text class="pa-0" style="flex-grow: 1">
                  <EditsTable :edits="user().metadata.editEvents" />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" xl="4" lg="6" md="12" sm="12" xs="12" class="pt-0">
              <v-card height="100%" class="d-flex flex-column rounded-0">
                <v-card-title class="bg-primary text-white py-3">
                  Created Records
                </v-card-title>
                <v-card-text class="pa-0" style="flex-grow: 1">
                  <RecordsTable
                    :records="user().records.createdRecords"
                    source="createdRecords"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" xl="4" lg="6" md="12" sm="12" xs="12" class="pt-0">
              <v-card height="100%" class="d-flex flex-column rounded-0">
                <v-card-title class="bg-primary text-white py-3">
                  Maintained Records
                </v-card-title>
                <v-card-text class="pa-0" style="flex-grow: 1">
                  <RecordsTable
                    :records="user().records.maintainedRecords"
                    source="maintainedRecords"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" xl="4" lg="6" md="12" sm="12" xs="12" class="pt-0">
              <v-card height="100%" class="d-flex flex-column rounded-0">
                <v-card-title class="bg-primary text-white py-3">
                  Maintenance Requests
                </v-card-title>
                <v-card-text class="pa-0" style="flex-grow: 1">
                  <RecordsTable
                    :records="maintenanceRequests"
                    source="maintenanceRequests"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" xl="4" lg="6" md="12" sm="12" xs="12" class="pt-0">
              <v-card height="100%" class="d-flex flex-column rounded-0">
                <v-card-title class="bg-primary text-white py-3">
                  Organisations
                </v-card-title>
                <v-card-text class="pa-0" style="flex-grow: 1">
                  <ViewOrganisations
                    :organisations="user().records.organisations"
                  />
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" xl="4" lg="6" md="12" sm="12" xs="12" class="pt-0">
              <v-card height="100%" class="d-flex flex-column rounded-0">
                <v-card-title class="bg-primary text-white py-3">
                  Awards
                </v-card-title>
                <v-card-text class="pa-0" style="flex-grow: 1">
                  <ViewAwards :awards="user().metadata.awards" />
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
              <v-card height="100%" class="d-flex flex-column rounded-0">
                <v-card-title
                  class="bg-primary text-white py-3 flex-column align-start"
                >
                  <span>Saved Searches</span>
                  <v-card-subtitle
                    class="pa-0 opacity-100"
                    style="white-space: normal"
                  >
                    Clicking on the name of a saved search will take you to its
                    search results. From the results page, if you are logged in
                    you may further refine the search and/or save the search
                    yourself. More information on Conforming Resources and Saved
                    Searches can be found in our
                    <a
                      href="https://fairsharing.gitbook.io/fairsharing/how-to/advanced-search"
                      target="_blank"
                      class="text-white text-decoration-underline"
                      >Gitbook documentation</a
                    >.
                  </v-card-subtitle>
                </v-card-title>

                <v-card-text class="pa-0" style="flex-grow: 1">
                  <ViewSavedSearchesTable
                    :created-searches="user().records.createdSearches"
                    :saved-searches="user().records.savedSearches"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-fade-transition>
      <div>
        <v-overlay
          v-model="loading"
          :absolute="false"
          opacity="0.8"
          class="align-center justify-center"
        >
          <loaders />
        </v-overlay>
      </div>
    </v-fade-transition>
    <v-dialog v-model="confirmDelete" max-width="700px" persistent>
      <v-card>
        <v-card-title class="headline, justify-center">
          Deleting User Account!
        </v-card-title>
        <v-card-text class="text-center">
          <b
            >Are you sure you want to do that? Your account will be permanently
            deleted!</b
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn class="bg-info" @click="confirmDelete = false"> Cancel </v-btn>
          <v-spacer />
          <v-btn class="bg-error" @click="deleteAccount()"> Delete </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

import Loaders from "@/components/Navigation/Loaders";
import ViewAwards from "@/components/Users/Profiles/Private/ViewAwards";
import ViewOrganisations from "@/components/Users/Profiles/Private/ViewOrganisations";
import ViewSavedSearchesTable from "@/components/Users/Profiles/Private/ViewSavedSearchesTable.vue";
import UserProfileMenu from "@/components/Users/UserProfileMenu";
import ExternalClient from "@/lib/Client/ExternalClients.js";
import RestClient from "@/lib/Client/RESTClient.js";
import getHostname from "@/utils/generalUtils";

import EditsTable from "@/components/Users/Profiles/Private/EditsTable";
import RecordsTable from "@/components/Users/Profiles/Private/RecordsTable";

let client = new ExternalClient();
let restClient = new RestClient();

/**
 * @vue-data {Object} hideFields - an array of field to NOT display
 * */

export default {
  name: "User",
  components: {
    ViewOrganisations,
    RecordsTable,
    EditsTable,
    Loaders,
    UserProfileMenu,
    ViewAwards,
    ViewSavedSearchesTable,
  },
  mixins: [getHostname],
  data: () => {
    return {
      copyButtonStatus: false,
      panel: 0,
      hideFields: [
        "role_id",
        "deactivated",
        "id",
        "created_at",
        "updated_at",
        "username",
        "watched_records",
        "expiry",
        "is_curator",
        "is_super_curator",
        "editEvents",
        "awards",
      ],
      loading: false,
      publications: [],
      activeTab: 0,
      confirmDelete: false,
    };
  },
  computed: {
    ...mapState("users", ["user", "userResetPwdMessage", "messages"]),
    ...mapState("editor", ["icons"]),
    getUserMeta: function () {
      let userMeta = {};
      const _module = this;
      Object.keys(_module.user().metadata).forEach(function (field) {
        if (!_module.hideFields.includes(field)) {
          userMeta[field] = _module.user().metadata[field];
        }
      });
      return userMeta;
    },
    maintenanceRequests() {
      let output = [];
      if (this.user().records.maintenanceRequests) {
        this.user().records.maintenanceRequests.forEach(function (record) {
          output.push({
            ...record["fairsharingRecord"],
            createdAt: record.createdAt,
            status: record.status,
          });
        });
      }
      return output;
    },
  },
  async created() {
    this.loading = true;
    await this.getUser(); // we need the user BEFORE getting the publications.
    if (this.messages()["getUser"].error) {
      this.setError({
        field: "login",
        message: "You've been logged out automatically",
      });
      await this.$router.push({ path: "/accounts/login" });
    }
    this.publications = await this.getPublications();
    this.loading = false;
  },
  beforeUnmount() {
    this.cleanStore();
  },
  methods: {
    ...mapActions("users", ["getUser", "resetPwd", "setError"]),
    ...mapMutations("users", ["cleanStore"]),
    async getPublications() {
      let output = [];
      if (this.user().metadata.orcid) {
        let publications = await client.getOrcidUser(
          this.user().metadata.orcid,
        );
        /* istanbul ignore if */
        if (publications.error) {
          return [];
        }
        else {
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
                url = null;
                /* istanbul ignore next */
                if (DOI) {
                  url = DOI["external-id-url"]
                    ? DOI["external-id-url"].value
                    : null;
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
    booleanToString(bool) {
      return bool ? "Yes" : "No";
    },
    async copyURL() {
      this.copyButtonStatus = true;
      let text = this.getHostname() + "users/" + this.user().id;
      try {
        await navigator.clipboard.writeText(text);
      }
      catch ($e) {
        this.copyButtonStatus = false;
      }
    },
    showDeleteDialog() {
      this.confirmDelete = true;
    },
    async deleteAccount() {
      await restClient.delete(this.user().credentials.token);
      this.$router.push({ path: "/" });
    },
  },
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
  box-shadow:
    0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
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
