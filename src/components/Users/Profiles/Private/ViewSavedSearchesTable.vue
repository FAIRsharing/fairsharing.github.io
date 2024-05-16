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
    </v-data-table>
    <!--Edit/Delete action dialog box -->
    <v-dialog
      v-model="dialogDelete"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="text-h5">
          Are you sure you want to delete this item?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="white--text"
            color="accent3"
            @click="closeDelete"
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
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import RESTClient from "@/lib/Client/RESTClient";

const restClient = new RESTClient();

export default {
  name: "ViewSavedSearchesTable",
  data: () => {
    return {
      dialogDelete: false,
      selectedItem: {},
      totalSearches: [],
      loading: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    ...mapGetters("users", ["getUserRecords"]),
    headers() {
      let headers = [
        { text: "Creator", value: "creator", align: "center" },
        { text: "Date", value: "date", align: "center" },
        { text: "Name", value: "name", align: "center" },
        { text: "Comments", value: "comments", align: "center" },
        { text: "Link", value: "link", align: "center" },
        { text: "Actions", value: "actions", sortable: false },
      ];
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
    ...mapActions("users", ["getUser"]),
    /**
     * Fetch createdSearch and savedSearch from the userRecords
     * removing the duplicates and displaying in user profile
     * page
     */
    async combinedSearches() {
      await this.getUser();
      let createdSearches = this.getUserRecords.user["createdSearches"];
      let savedSearches = this.getUserRecords.user["savedSearches"];
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
      this.dialogDelete = true;
    },

    /**
     * Confirmation dialog to delete the savedSearch
     * and close the dialog if pressed OK
     */
    async deleteItemConfirm() {
      this.loading = true;
      let data = await restClient.deleteSavedSearch(
        this.selectedItem["id"],
        this.user().credentials.token
      );

      if (data["message"] === "success") {
        await this.combinedSearches();
      }
      this.loading = false;
      this.closeDelete();
    },

    /**
     * Close the delete dialog
     */
    closeDelete() {
      this.dialogDelete = false;
    },
  },
};
</script>

<style scoped></style>
