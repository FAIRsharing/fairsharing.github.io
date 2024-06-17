<template>
  <div
    v-if="getField('savedSearches') && getField('savedSearches').length"
    class="d-flex flex-row mt-4 align-center min-height-40"
  >
    <b class="width-15-percent-flex">Saved Search</b>
    <div class="d-flex ml-md-12 ml-13">
      <v-chip
        v-for="search in getSavedSearches"
        :key="search.id"
        class="ma-1"
        color="secondary"
        :close="user().is_super_curator ? true : false"
        close-icon="mdi-delete"
        text-color="white"
        @click:close="confirmDeleteSavedSearch(search)"
      >
        <a
          class="white--text"
          :href="search.url"
        >
          {{ search.name }}
        </a>
      </v-chip>
    </div>

    <!-- Delete dialog box -->
    <v-dialog
      v-model="confirmDelete"
      max-width="700px"
      persistent
    >
      <!-- Delete saved search -->
      <v-card v-if="deleteSavedSearchCard">
        <v-card-title class="text-h5">
          Deleting saved search
        </v-card-title>
        <v-card-text>
          This is will delete all instances of the search from
          FAIRsharing
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="white--text"
            color="accent3"
            @click="deleteSavedSearch(false)"
          >
            Cancel
          </v-btn>
          <v-btn
            class="white--text"
            color="success"
            :loading="deleteLoader"
            @click="deleteSavedSearch(true)"
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
import {mapActions, mapGetters, mapState} from "vuex";

import RestClient from "@/lib/Client/RESTClient.js"

const restClient = new RestClient();
export default {
  name: "SavedSearches",
  data: () =>{
    return {
      getSavedSearches: [],
      confirmDelete: false,
      deleteSavedSearchCard: false,
      selectedItem: {},
      deleteLoader: false
    }
  },
  computed: {
    ...mapState('users', ['user']),
    ...mapState('record', ["currentRecord"]),
    ...mapGetters("record", ["getField"]),
  },
  mounted() {
    this.getSavedSearches = this.getField('savedSearches')
  },
  methods:{
    ...mapActions('record', ['fetchRecord']),
    /**
     * Confirmation dialog to delete the saved search
     */
    confirmDeleteSavedSearch(item){
      this.selectedItem = item;
      this.confirmDelete = true;
      this.deleteOrganisationCard = false;
      this.deleteSavedSearchCard = true;
    },
    /**
     * Delete the saved search
     * @param del - Boolean
     */
    async deleteSavedSearch(del) {
      this.deleteOrganisationCard = false;
      if (del) {
        this.deleteLoader = true;
        let data = await restClient.deleteSavedSearch(this.selectedItem["id"], this.user().credentials.token);
        if (data["message"] === "success") {
          await this.fetchRecord({id: this.currentRecord.fairsharingRecord
              .id, token: this.user().credentials.token})
          this.getSavedSearches = this.getField('savedSearches')

        }
      }
      this.deleteLoader = false;
      this.deleteSavedSearchCard = false;
      this.confirmDelete = false;
    },
  }
};
</script>