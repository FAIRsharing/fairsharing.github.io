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
import { mapState } from "vuex";

import saveSearch from "@/store";

export default {
  name: "SaveSearchButton",

  computed: {
    ...mapState("users", ["user"]),
  },

  methods: {
    /**
     * Save the advancedSearch Results
     */
    async saveSearchResults() {
      saveSearch.commit("saveSearch/setSaveSearchStepperDialog", true);
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
