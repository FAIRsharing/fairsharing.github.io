<template>
  <div
    v-if="getField('savedSearches') && getField('savedSearches').length"
  >
    <p>
      This policy has certain requirements and recommendations that have been used to create a conformant FAIRsharing search. The searches listed within this section will provide an initial filtering of the FAIRsharing registries. Clicking on a saved search will take you to a set of search results which you may further refine according to your needs and any additional policy requirements. If you are logged in, you may also save any search results to your own profile. More information on Conforming Resources and Saved Searches can be found in our <a
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
      >
        <div class="d-flex align-center">
          <record-status
            :record="search.fairsharingRecords[0]"
            :show-status="false"
          />
          <div class="d-flex flex-column">
            <div
              class="ml-10 underline-effect text-ellipses-height-2lines line-height-20"
            >
              <a :href="search.url">{{ search.name }}</a>
            </div>
            <p class="text-body-2 ml-10">
              (Created by: <a
                class="underline-effect"
                :href="`/users/${search.creator['id']}`"
              >{{ search.creator["username"] }}</a>)
            </p>
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
        @click="confirmUnlinkSavedSearch(search)"
      >
        <v-icon>mdi-link-off</v-icon>
      </v-btn>
    </div>


    <!-- Unlink dialog box -->
    <v-dialog
      v-model="confirmUnlink"
      max-width="700px"
      persistent
    >
      <!-- Unlink saved search -->
      <v-card v-if="unlinkSavedSearchCard">
        <v-card-title class="text-h5">
          Unlinking saved search
        </v-card-title>
        <v-card-text>
          This is will unlink instance of the search from this policy record.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="white--text"
            color="accent3"
            @click="unlinkSavedSearch(false)"
          >
            Cancel
          </v-btn>
          <v-btn
            class="white--text"
            color="success"
            :loading="unlinkLoader"
            @click="unlinkSavedSearch(true)"
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
import saveSearch from "@/store";

const restClient = new RestClient();
export default {
  name: "SavedSearches",
  components: { RecordStatus },
  data: () => {
    return {
      getSavedSearches: [],
      confirmUnlink: false,
      unlinkSavedSearchCard: false,
      selectedItem: {},
      unlinkLoader: false,
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
     * Confirmation dialog to unlink the saved search
     */
    confirmUnlinkSavedSearch(item) {
      this.selectedItem = item;
      this.confirmUnlink = true;
      this.unlinkSavedSearchCard = true;
    },

    /**
     * Unlink the saved search
     * @param del - Boolean
     */
    async unlinkSavedSearch(del) {
      if (del) {
        this.unlinkLoader = true;
        //Filter the currentRecord to unlink
        let linkRecord = this.selectedItem.fairsharingRecords.filter(({id}) => id !== this.currentRecord.fairsharingRecord.id);

        //Array of id of the remaining record
        linkRecord = linkRecord.map(({id}) => id)

        let saveSearchObj = {
          fairsharing_record_ids: linkRecord,
        };

        let updatedSearchResult = await restClient.updateSaveSearch(
            this.selectedItem["id"],
            saveSearchObj,
            this.user().credentials.token
        );

        //Commit the updated result to store
        saveSearch.commit("saveSearch/setSaveSearchResult", updatedSearchResult);

        //Update the page after unlinking the savedSearch
        await this.fetchRecord({
          id: this.currentRecord.fairsharingRecord.id,
          token: this.user().credentials.token,
        });

        this.getSavedSearches = this.getField("savedSearches");
      }
      this.unlinkLoader = false;
      this.unlinkSavedSearchCard = false;
      this.confirmUnlink = false;

    },
  },
};
</script>