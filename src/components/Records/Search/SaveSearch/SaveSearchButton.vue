<template>
  <v-btn
    class="mb-2 white--text saveSearchResults"
    color="accent2"
    small
    @click="!user().isLoggedIn ? goToLogin() : saveSearchResults()"
  >
    Save Search Results
  </v-btn>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import RESTClient from "@/lib/Client/RESTClient.js";
import saveSearch from "@/store";

const restClient = new RESTClient();

export default {
  name: "SaveSearchButton",
  computed: {
    ...mapState("users", ["user"]),
    ...mapGetters("advancedSearch", ["getAdvancedSearchQuery"]),
  },

  methods: {
    ...mapActions("users", ["getUser"]),
    /**
     * Save the advancedSearch Results
     */
    async saveSearchResults() {
      await this.getUser();
      //Below checks if it normal user/supercurator/iscurator
      console.log("this.user()::", this.user());

      saveSearch.commit("saveSearch/setSaveSearchStepper", true);

      let saveSearchObj = {
        name: "Test name",
        comments: "test comment",
        url: this.$route.fullPath,
        fairsharing_record_ids: [1],
        user_ids: [2],
        organisation_ids: [3],
        params: this.getAdvancedSearchQuery,
      };
      await restClient.saveSearch(saveSearchObj, this.user().credentials.token);
    },
    /**
     * Goto To login page if user is not loggedIn
     */
    async goToLogin() {
      if (this.$route.path !== "/accounts/login") {
        await this.$router.push({
          path: "/accounts/login",
          query: {
            goTo: this.$route.fullPath,
          },
        });
      }
    },
  },
};
</script>
