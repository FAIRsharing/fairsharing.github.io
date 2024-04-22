<template>
  <v-btn
    class="mb-2 white--text saveSearchResults"
    color="accent2"
    small
    @click="saveSearchResults()"
  >
    Save Search Results
  </v-btn>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SaveSearchButton",
  // props: {
  //   value: {
  //     type: Array,
  //     default: () => [],
  //   },
  // },
  // data: () => {
  //   return {};
  // },
  computed: {
    ...mapState("users", ["user"]),
  },

  methods: {
    /**
     * Save the advancedSearch Results
     * @return {Promise<void>}
     */
    async saveSearchResults() {
      //Goto To login page if user is not loggedIn
      if (!this.user().isLoggedIn && this.$route.path !== "/accounts/login") {
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
