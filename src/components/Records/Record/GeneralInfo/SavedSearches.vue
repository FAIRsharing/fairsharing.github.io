<template>
  <div
    v-if="getField('savedSearches') && getField('savedSearches').length"
  >
    <p>
      This policy has certain requirements and recommendations that have been used to create a conformant FAIRsharing search. The searches listed within this section will provide an initial filtering of the FAIRsharing registries. Clicking on a saved search will take you to a set of search results which you may further refine according to your needs and any additional policy requirements. More information on Conforming Resources and Saved Searches can be found in our <a
        href="https://fairsharing.gitbook.io/fairsharing/how-to/advanced-search"
        target="_blank"
      >
        Gitbook
        documentation</a>.
    </p>
    <div
      v-for="search in getSavedSearches"
      :key="search.id"
      class="d-flex align-center"
    >
      <v-card
        class="pa-4 d-flex flex-column v-card-hover mx-2 height-120 my-3 full-width"
        flat
        outlined
        :href="search.url"
      >
        <div class="d-flex align-center">
          <record-status
            :record="search.fairsharingRecords[0]"
            :show-status="false"
          />
          <div
            class="ml-10 underline-effect text-ellipses-height-2lines line-height-20"
          >
            {{ search.name }}
          </div>
        </div>
        <p
          class="grey--text relation-style text-ellipses-height-2lines line-height-14 pr-5"
        >
          {{ search.comments }}
        </p>
      </v-card>
      <v-btn
        v-if="user().is_super_curator"
        rounded
        text
        @click="confirmDeleteSavedSearch(search)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
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
          This is will delete all instances of the search from FAIRsharing
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
import { mapActions, mapGetters, mapState } from "vuex";

import RecordStatus from "@/components/Records/Shared/RecordStatus.vue";
import RestClient from "@/lib/Client/RESTClient.js";

const restClient = new RestClient();
export default {
  name: "SavedSearches",
  components: { RecordStatus },
  data: () => {
    return {
      getSavedSearches: [],
      confirmDelete: false,
      deleteSavedSearchCard: false,
      selectedItem: {},
      deleteLoader: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    ...mapState("record", ["currentRecord"]),
    ...mapGetters("record", ["getField"]),
  },
  mounted() {
    this.getSavedSearches = this.getField("savedSearches");
  },
  methods: {
    ...mapActions("record", ["fetchRecord"]),
    /**
     * Confirmation dialog to delete the saved search
     */
    confirmDeleteSavedSearch(item) {
      this.selectedItem = item;
      this.confirmDelete = true;
      this.deleteSavedSearchCard = true;
    },
    /**
     * Delete the saved search
     * @param del - Boolean
     */
    async deleteSavedSearch(del) {
      if (del) {
        this.deleteLoader = true;
        let data = await restClient.deleteSavedSearch(
          this.selectedItem["id"],
          this.user().credentials.token
        );
        if (data["message"] === "success") {
          await this.fetchRecord({
            id: this.currentRecord.fairsharingRecord.id,
            token: this.user().credentials.token,
          });
          this.getSavedSearches = this.getField("savedSearches");
        }
      }
      this.deleteLoader = false;
      this.deleteSavedSearchCard = false;
      this.confirmDelete = false;
    },
  },
};
</script>