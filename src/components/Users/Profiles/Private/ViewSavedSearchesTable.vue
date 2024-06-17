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
        <a :href="item.url">{{ item.name }}</a>
      </template>
      <template #[`item.comments`]="{ item }">
        {{ item.comments }}
      </template>
      <template #[`item.record`]="{ item }">
        <ul>
          <li
            v-for="record in item.fairsharingRecords"
            :key="record.id"
            class="mb-2"
          >
            <a :href="`/${record['id']}`">{{ record["name"] }}
            </a>
          </li>
        </ul>
      </template>
      <template #[`item.organisation`]="{ item }">
        <ul>
          <li
            v-for="organisation in item.organisations"
            :key="organisation.id"
            class="mb-2"
          >
            <a :href="`/organisations/${organisation['id']}`">{{ organisation["name"] }}
            </a>
          </li>
        </ul>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-menu
          offset-x
        >
          <template #activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
            >
              fas fa-ellipsis-v
            </v-icon>
          </template>
          <v-list>
            <v-list-item
              @click="editItem(item)"
            >
              <v-list-item-avatar><v-icon>fas fa-pen</v-icon></v-list-item-avatar>
              <v-list-item-content><v-list-item-title> Edit Search </v-list-item-title></v-list-item-content>
            </v-list-item>
            <v-list-item @click="deleteItem(item)">
              <v-list-item-avatar><v-icon>mdi-delete</v-icon></v-list-item-avatar>
              <v-list-item-content><v-list-item-title> Delete Search </v-list-item-title></v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
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
import { mapActions, mapGetters, mapState } from "vuex";

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
    ...mapGetters("users", ["getUserRecords"]),
    headers() {
      let headers = [
        { text: "Creator", value: "creator", align: "center", sortable: false },
        { text: "Date", value: "date", align: "center", width:"110", sortable: false },
        { text: "Name", value: "name", align: "center", sortable: false },
        { text: "Comments", value: "comments", align: "center", sortable: false },
        { text: "Record", value: "record", align: "center", sortable: false },
        { text: "Organisation", value: "organisation", align: "center", sortable: false },
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
    ...mapActions("users", ["getUser"]),
    /**
     * Fetch combinedSearches and savedSearches from the props
     * removing the duplicates and displaying in user profile
     * page
     */
    async combinedSearches(searchDeleted) {
      let createdSearches, savedSearches

      if (searchDeleted) {
        await this.getUser();
        createdSearches = this.getUserRecords.user["createdSearches"];
        savedSearches = this.getUserRecords.user["savedSearches"];
      } else {
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
      this.totalSearches = searchValues.sort((a, b) => new Date(b.createdAt)
          - new Date(a.createdAt)
      );

    },

    /**
     * Delete the selection savedSearch
     * @param item
     */
    deleteItem(item) {
      this.selectedItem = item;
      this.modifyDialog = true;
      this.editSavedSearch = false;
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
        await this.combinedSearches(true);
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
