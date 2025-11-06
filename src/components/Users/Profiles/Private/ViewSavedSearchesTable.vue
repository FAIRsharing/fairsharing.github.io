<template>
  <div>
    <v-data-table
      class="userProfileSavedSearches"
      :items="totalSearches"
      :headers="headers"
      :items-per-page="perPage"
      :footer-props="footer"
      calculate-widths
      mobile-breakpoint="960"
    >
      <template #[`item.creator`]="{ item }">
        <a :href="`/users/${item.creator['id']}`"
          >{{ item.creator["username"] }}
        </a>
      </template>
      <template #[`item.additionalUser`]="{ item }">
        <ul class="pl-0">
          <li v-for="user in additionalUsers(item)" :key="user.id" class="mb-2">
            <a :href="`/users/${user['id']}`">{{ user["username"] }} </a>
          </li>
        </ul>
      </template>
      <template #[`item.date`]="{ item }">
        {{ item.createdAt.split("T", 1)[0] }}
      </template>
      <template #[`item.name`]="{ item }">
        <a :href="item.url">{{ item.name }}</a>
      </template>
      <template #[`item.comments`]="{ item }">
        {{ item.comments }}
      </template>
      <template #[`item.record`]="{ item }">
        <ul class="pl-0">
          <li
            v-for="record in item.fairsharingRecords"
            :key="record.id"
            class="my-2"
          >
            <a :href="`/${record['id']}`">{{ record["name"] }} </a>
          </li>
        </ul>
      </template>
      <template #[`item.organisation`]="{ item }">
        <ul class="pl-0">
          <li
            v-for="organisation in item.organisations"
            :key="organisation.id"
            class="my-2"
          >
            <a :href="`/organisations/${organisation['id']}`"
              >{{ organisation["name"] }}
            </a>
          </li>
        </ul>
      </template>
      <template #[`item.actions`]="{ item }">
        <!--User logged in and is on its public profile page-->
        <v-icon
          v-if="Number($route.params.id) === user().id"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
        <!--User is on any other user's public profile page-->
        <v-icon
          v-else-if="$route.name === 'PublicProfile'"
          @click="unlinkItem(item)"
        >
          mdi-link-off
        </v-icon>
        <!--User is on its account profile page-->
        <v-icon v-else @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template #no-data>
        <div>
          You haven't saved any searches yet. Create one
          <a @click.stop="openAdvancedSearch">here</a>.
        </div>
      </template>
    </v-data-table>
    <!--Delete action dialog box -->
    <v-dialog v-model="modifyDialog" max-width="500px">
      <!--Delete -->
      <v-card v-if="deleteSavedSearch">
        <v-card-title class="text-h5">
          Are you sure you want to delete this item?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn class="text-white" color="accent3" @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn
            class="text-white"
            color="success"
            :loading="loading"
            @click="deleteItemConfirm()"
          >
            OK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
      <!--Unlink -->
      <v-card v-if="unlinkSavedSearch">
        <v-card-title class="text-h5">
          Are you sure you want to unlink this user?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn class="text-white" color="accent3" @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn
            class="text-white"
            color="success"
            :loading="loading"
            @click="unlinkItemConfirm()"
          >
            OK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import RESTClient from "@/lib/Client/RESTClient";
import advancedSearch from "@/store";
import saveSearch from "@/store";

const restClient = new RESTClient();

export default {
  name: "ViewSavedSearchesTable",
  props: {
    createdSearches: { type: Array, default: null },
    savedSearches: { type: Array, default: null },
  },
  data: () => {
    return {
      modifyDialog: false,
      deleteSavedSearch: false,
      unlinkSavedSearch: false,
      selectedItem: {},
      totalSearches: [],
      loading: false,
      savedSearchLink: "",
      perPage: 5,
      footer: {
        showFirstLastPage: true,
        itemsPerPageText: "Saved Search:",
      },
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    ...mapGetters("users", ["getUserRecords"]),
    headers() {
      let headers = [
        {
          title: "Creator",
          value: "creator",
          align: "center",
          sortable: false,
        },
        { title: "Date", value: "date", align: "center", sortable: false },
        { title: "Name", value: "name", align: "center", sortable: false },
        {
          title: "Comments",
          value: "comments",
          align: "center",
          sortable: false,
        },
        { title: "Record", value: "record", align: "center", sortable: false },
        {
          title: "Organisation",
          value: "organisation",
          align: "center",
          sortable: false,
        },
      ];
      if (this.user().isLoggedIn) {
        headers.push({
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: false,
        });
      }
      if (this.user().is_super_curator) {
        headers.splice(1, 0, {
          text: "Additional User",
          value: "additionalUser",
          align: "center",
          sortable: false,
        });
      }
      return headers;
    },
  },

  mounted() {
    this.combinedSearches();
  },
  methods: {
    ...mapActions("users", ["getUser", "getPublicUser"]),
    /**
     * Fetch combinedSearches and savedSearches from the props
     * removing the duplicates and displaying in user profile
     * page
     */
    async combinedSearches(searchDeleted, searchUnlinked) {
      let createdSearches, savedSearches;

      if (searchDeleted) {
        await this.getUser();
        createdSearches = this.getUserRecords.user["createdSearches"];
        savedSearches = this.getUserRecords.user["savedSearches"];
      }
      else if (searchUnlinked) {
        let userId = this.$route.params.id;
        let userR = await this.getPublicUser(userId);
        await this.getUser();
        createdSearches = userR.user["createdSearches"];
        savedSearches = userR.user["savedSearches"];
      }
      else {
        createdSearches = this.createdSearches;
        savedSearches = this.savedSearches;
      }

      let mergedSearches = createdSearches.concat(savedSearches);
      let mapSearches = new Map();
      for (const search of mergedSearches) {
        mapSearches.set(search.id, search);
      }
      //Reversed array to show latest entry first
      let searchValues = [...mapSearches.values()];
      this.totalSearches = searchValues.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    },

    /**
     * Delete the selection savedSearch
     * @param item - {Object} - Saved Search details
     */
    deleteItem(item) {
      this.selectedItem = item;
      this.modifyDialog = true;
      this.unlinkSavedSearch = false;
      this.deleteSavedSearch = true;
    },

    /**
     * Confirmation dialog to delete the savedSearch
     * and close the dialog if pressed OK
     */
    async deleteItemConfirm() {
      this.loading = true;
      let data = await restClient.deleteSavedSearch(
        this.selectedItem["id"],
        this.user().credentials.token,
      );

      if (data["message"] === "success") {
        await this.combinedSearches(true, false);
      }
      this.loading = false;
      this.deleteSavedSearch = false;
      this.closeDialog();
    },

    /**
     * Unlink saved search from the user
     * @param item - {Object} - Saved Search details
     */
    unlinkItem(item) {
      this.selectedItem = item;
      this.modifyDialog = true;
      this.deleteSavedSearch = false;
      this.unlinkSavedSearch = true;
    },

    /**
     * Confirmation dialog to unlink the savedSearch
     * and close the dialog if pressed OK
     */
    async unlinkItemConfirm() {
      this.loading = true;
      let additionalUsersArr = this.additionalUsers(this.selectedItem);

      //Filter the user to unlink
      let linkedUser = additionalUsersArr.filter(
        ({ id }) => id !== Number(this.$route.params.id),
      );

      //Array of id of the remaining users
      linkedUser = linkedUser.map(({ id }) => id);

      let saveSearchObj = {
        user_ids: linkedUser,
      };

      let updatedSearchResult = await restClient.updateSaveSearch(
        this.selectedItem["id"],
        saveSearchObj,
        this.user().credentials.token,
      );

      //Commit the updated result to store
      saveSearch.commit("saveSearch/setSaveSearchResult", updatedSearchResult);

      await this.combinedSearches(false, true);

      this.loading = false;
      this.unlinkSavedSearch = false;
      this.closeDialog();
    },

    /**
     * Close dialog
     */
    closeDialog() {
      this.modifyDialog = false;
    },
    /**
     * Open advancedSearch Dialog Box
     */
    openAdvancedSearch() {
      advancedSearch.commit(
        "advancedSearch/setAdvancedSearchDialogStatus",
        true,
      );
    },
    /**
     * Filter creator from additional users list
     * @param { Object } - user
     * @return {Array} - additional user list without creator
     */
    additionalUsers(item) {
      let additionalUsersList = item["users"].filter((e) => {
        return e["id"] !== item.creator["id"];
      });
      return additionalUsersList;
    },
  },
};
</script>

<style lang="scss" scoped>
@use "sass:map";
@use "vuetify/settings" as v;
.userProfileSavedSearches:deep(*) {
  table {
    tbody {
      tr {
        td {
          word-break: break-all;
          @media #{map.get(v.$display-breakpoints, 'md-and-up')} {
            width: 100px;
            min-width: 100px;
            max-width: 100px;
          }
        }
      }
    }
  }
}
</style>
