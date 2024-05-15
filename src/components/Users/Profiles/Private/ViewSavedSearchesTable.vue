<template>
  <div>
    <v-data-table
      class="userProfileSavedSearches"
      :items="combinedSearches"
      :headers="headers"
      :items-per-page="perPage"
      :footer-props="footer"
      calculate-widths
    >
      <template #[`item.creator`]="{ item }">
        <a :href="`/users/${item.creator['id']}`"
          >{{ item.creator["username"] }}
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
        <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template #no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
    <!--Edit/Delete action dialog box -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          Are you sure you want to delete this item?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeDelete">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm(true)">
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

const restClient = new RESTClient();

export default {
  name: "ViewSavedSearchesTable",
  props: {
    createdSearches: { type: Array, default: null },
    savedSearches: { type: Array, default: null },
  },
  data: () => {
    return {
      dialogDelete: false,
      selectedItem: {},
      editedItem: {
        creator: "",
        date: "",
        name: "",
        comments: "",
        link: "",
      },
    };
  },
  computed: {
    ...mapState("users", ["user"]),
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
    combinedSearches() {
      let mergedSearches = [];
      mergedSearches = this.createdSearches.concat(this.savedSearches);
      let mapSearches = new Map();
      for (const search of mergedSearches) {
        mapSearches.set(search.id, search);
      }
      //Reversed array to show latest entry first
      return [...mapSearches.values()].toReversed();
    },
  },
  watch: {
    // dialogDelete(val) {
    //   val || this.closeDelete();
    // },
  },
  methods: {
    deleteItem(item) {
      this.selectedItem = item;
      this.dialogDelete = true;
    },
    async deleteItemConfirm(del) {
      if (del) {
        let data = await restClient.deleteSavedSearch(
          this.selectedItem["id"],
          this.user().credentials.token
        );
        console.log("data", data);
      }

      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.editedItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>

<style scoped></style>
