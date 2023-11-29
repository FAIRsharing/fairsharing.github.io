<template>
  <div class="d-flex mx-2">
    <!--  On Search Block  -->
    <v-btn
      v-if="showHomeSearch"
      color="primary"
      class="mb-13"
      :class="[
        'mt-1',
        $vuetify.breakpoint.lgAndDown ? 'home-search-bt' : 'home-search-bt-xl',
      ]"
      @click="openAdvanceSearch()"
    >
      <v-icon small class="mr-1"> fab fa-searchengin </v-icon>
      <span class="button-text-size">Advanced Search</span>
    </v-btn>
    <!--  On Header Block  -->
    <v-btn
      v-else
      color="primary"
      :x-large="$vuetify.breakpoint.xlOnly ? true : false"
      class="mr-10"
      @click="openAdvanceSearch()"
    >
      <v-icon small class="mr-1"> fab fa-searchengin </v-icon>
      <span class="button-text-size">Advanced Search</span>
    </v-btn>
    <!--Dialog Box -->
    <v-row justify="center">
      <v-dialog
        :value="dialog"
        max-width="800px"
        @keydown.esc="closeDialog()"
        @click:outside="closeDialog()"
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ advancedSearchTerm }}</span>
          </v-card-title>
          <v-card-text>
            <QueryBuilderView :is-dialog="dialog" />
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="accent3"
              variant="text"
              class="white--text"
              @click="closeDialog()"
            >
              Close
            </v-btn>
            <v-spacer />
            <v-btn
              color="green"
              variant="text"
              class="white--text"
              :disabled="isContinue"
              @click="goToAdvancedSearch()"
            >
              Proceed
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import QueryBuilderView from "@/components/Records/Search/Input/QueryBuilderView.vue";

export default {
  name: "AdvancedSearch",
  components: { QueryBuilderView },
  props: {
    showHomeSearch: {
      default: false,
      type: Boolean,
    },
    advancedSearchTerm: {
      default: "",
      type: String,
    },
  },
  data: () => {
    return {
      dialog: false,
    };
  },
  computed: {
    ...mapGetters("advancedSearch", ["getAdvancedSearch"]),
    /**
     * Enables the proceed button when all the selected fields are non-empty
     * @returns {boolean}
     */
    isContinue() {
      let isDisabled = true;
      let isTrue;
      let isTrueArr = [];
      if (
        this.getAdvancedSearch["children"] &&
        this.getAdvancedSearch["children"].length
      ) {
        this.getAdvancedSearch["children"].forEach(({ children }) => {
          if (children && children.length) {
            isTrue = children.every(({ value: { length } }) => length);
            isTrueArr.push(isTrue);
          }
        });
      }
      //Check if all values in the array is true
      const allTrue = isTrueArr.every((item) => item);
      if (allTrue) isDisabled = !allTrue;
      return isDisabled;
    },
  },
  methods: {
    ...mapActions("advancedSearch", [
      "fetchAdvancedSearchResults",
      "resetAdvancedSearchResponse",
    ]),
    openAdvanceSearch() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    goToAdvancedSearch() {
      this.fetchAdvancedSearchResults(this.advancedSearchTerm);
      this.dialog = false;
      if (this.$route.path !== "/advancedsearch") {
        this.$router.push({
          name: "AdvancedSearchResult",
          query: {
            x: "ab",
          },
        });
      } else {
        this.$router.push({
          query: {
            x: "df",
          },
        });
      }
    },
  },
};
</script>

<style scoped>
.home-search-bt {
  height: 40px !important;
  right: 0;
  top: 0;
  border-radius: unset;
}

.home-search-bt-xl {
  height: 50px !important;
  right: 0;
  top: 0;
  border-radius: unset;
}
</style>
