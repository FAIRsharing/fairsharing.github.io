<template>
  <div>
    <v-data-table
      class="userProfileSavedSearches"
      :items="totalSearches"
      :headers="headers"
      :items-per-page="perPage"
      :footer-props="footer"
      calculate-widths
    >
      <template #[`item.creator`]="{ item }">
        <a :href="`/users/${item.creator['id']}`">{{ item.creator["username"] }}
        </a>
      </template>
      <template #[`item.date`]="{ item }">
        {{ item.createdAt.split("T", 1)[0] }}
      </template>
      <template #[`item.name`]="{ item }">
        {{ item.name }}
      </template>
      <template #[`item.comments`]="{ item }">
        {{ item.comments }}
      </template>
      <template #[`item.link`]="{ item }">
        <a :href="item.url">Link</a>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template #no-data>
        <div>
          You haven't saved any searches yet. Create one
          <a @click.stop="openAdvancedSearch">here</a>.
        </div>
      </template>
    </v-data-table>
    <!--Edit/Delete action dialog box -->
    <v-dialog
      v-model="modifyDialog"
      max-width="500px"
    >
      <!--Delete -->
      <v-card v-if="deleteSavedSearch">
        <v-card-title class="text-h5">
          Are you sure you want to delete this item?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="white--text"
            color="accent3"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            class="white--text"
            color="success"
            :loading="loading"
            @click="deleteItemConfirm()"
          >
            OK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
      <!--Edit -->
      <v-card v-if="editSavedSearch">
        <v-card-title class="text-h5">
          Are you sure you want to edit this item?
        </v-card-title>
        <v-card-subtitle class="text-subtitle-1 mt-0">
          Editing this item will create a new search.
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="white--text"
            color="accent3"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            class="white--text"
            color="success"
            :loading="loading"
            :href="savedSearchLink"
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
import { mapState } from "vuex";

import RESTClient from "@/lib/Client/RESTClient";
import advancedSearch from "@/store";

const restClient = new RESTClient();

export default {
  name: "ViewSavedSearchesTable",
  props: {
    createdSearches: { type: Array, default: null },
    savedSearches: { type: Array, default: null }
  },
  data: () => {
    return {
      modifyDialog: false,
      deleteSavedSearch: false,
      editSavedSearch: false,
      selectedItem: {},
      totalSearches: [],
      loading: false,
      savedSearchLink: "",
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    headers() {
      let headers = [
        { text: "Creator", value: "creator", align: "center", sortable: false },
        { text: "Date", value: "date", align: "center", sortable: false },
        { text: "Name", value: "name", align: "center", sortable: false },
        { text: "Comments", value: "comments", align: "center", sortable: false },
        { text: "Link", value: "link", align: "center", sortable: false },
      ];
      if (this.user().isLoggedIn) {
        headers.push({ text: "Actions", value: "actions", sortable: false },)
      }
      return headers;
    },
    perPage() {
      return 5;
    },
    footer() {
      return { "items-per-page-options": [5] };
    },
  },

  mounted() {
    this.combinedSearches();
  },
  methods: {
    /**
     * Fetch createdSearch and savedSearch from the userRecords
     * removing the duplicates and displaying in user profile
     * page
     */
    async combinedSearches() {
      let createdSearches = this.createdSearches;
      let savedSearches = this.savedSearches;
      let mergedSearches = createdSearches.concat(savedSearches);
      let mapSearches = new Map();
      for (const search of mergedSearches) {
        mapSearches.set(search.id, search);
      }
      //Reversed array to show latest entry first
      this.totalSearches = [...mapSearches.values()].toReversed();
    },

    /**
     * Delete the selection savedSearch
     * @param item
     */
    deleteItem(item) {
      this.selectedItem = item;
      this.modifyDialog = true;
      this.deleteSavedSearch = true;
    },

    /**
     * Confirmation dialog to delete the savedSearch
     * and close the dialog if pressed OK
     */
    async deleteItemConfirm() {
      this.editSavedSearch = false;
      this.loading = true;
      let data = await restClient.deleteSavedSearch(
        this.selectedItem["id"],
        this.user().credentials.token
      );

      if (data["message"] === "success") {
        await this.combinedSearches();
      }
      this.loading = false;
      this.deleteSavedSearch = false;
      this.closeDialog();
    },
    /**
     * Edit the savedSearch
     * @param item
     */
    editItem(item) {
      this.deleteSavedSearch = false;
      this.savedSearchLink = item["url"];
      this.modifyDialog = true;
      this.editSavedSearch = true;
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
        true
      );
    },
  },
};
</script>

<style scoped></style>
