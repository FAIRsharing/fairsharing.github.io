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
      <v-icon
        small
        class="mr-1"
      >
        fab fa-searchengin
      </v-icon>
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
      <v-icon
        small
        class="mr-1"
      >
        fab fa-searchengin
      </v-icon>
      <span class="button-text-size">Advanced Search</span>
    </v-btn>
    <!--Dialog Box -->
    <v-row justify="center">
      <v-dialog
        :value="dialog"
        fullscreen
        persistent
        @keydown.esc="closeDialog()"
      >
        <v-card>
          <div
            class="pt-6 pr-6"
            style="text-align: right"
          >
            <v-btn
              icon
              dark
              @click="closeDialog()"
            >
              <v-icon
                color="black"
                size="40px"
              >
                mdi-close
              </v-icon>
            </v-btn>
          </div>
          <v-card-title>
            <span
              v-if="!getEditDialogStatus"
              class="text-h5"
            >{{
              advancedSearchTerm
            }}</span>
            <v-text-field
              v-else
              class="text-h5"
              clearable
              outlined
              label="Add Search text"
              :value="getAdvancedSearchText"
              @change="updateSearchText($event)"
            />
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
import advancedSearch from "@/store";
import { uniqueValues } from "@/utils/advancedSearchUtils";

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
      updatedAdvancedSearchText: "",
    };
  },
  computed: {
    ...mapGetters("advancedSearch", [
      "getAdvancedSearch",
      "getAdvancedSearchText",
      "getEditDialogStatus",
    ]),
    /**
     * Enables the proceed button when all the selected fields are non-empty
     * @returns {boolean}
     */
    isContinue() {
      let isDisabled = true;
      let isTrue, allTrue;
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
      if (isTrueArr && isTrueArr.length)
        allTrue = isTrueArr.every((item) => item);
      if (allTrue) isDisabled = !allTrue;
      return isDisabled;
    },
  },
  watch: {
    getEditDialogStatus(newValue) {
      this.dialog = newValue;
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
      advancedSearch.commit("advancedSearch/setEditDialogStatus", false);
    },

    isAdvancedSearchTerm(queryString) {
      const queryValues = {
        q: this.getAdvancedSearchText,
        operator: this.getAdvancedSearch["operatorIdentifier"],
        fields: queryString,
      };
      return queryValues;
    },

    noAdvancedSearchTerm(queryString) {
      const queryValues = {
        operator: this.getAdvancedSearch["operatorIdentifier"],
        fields: queryString,
      };
      return queryValues;
    },

    goToAdvancedSearch() {
      if (this.updatedAdvancedSearchText)
        this.fetchAdvancedSearchResults(this.updatedAdvancedSearchText);
      else this.fetchAdvancedSearchResults(this.advancedSearchTerm);
      this.dialog = false;
      advancedSearch.commit("advancedSearch/setEditDialogStatus", false);
      //Clear search text field flag
      this.$emit("clearSearchField", true);

      let queryString = "";
      /*
       * Add advancedSearch selection to query params in
       * the URL by creating array of objects into string
       */
      if (
        this.getAdvancedSearch["children"] &&
        this.getAdvancedSearch["children"].length
      ) {
        this.getAdvancedSearch["children"].forEach((item) => {
          queryString += "(operator=";
          queryString += item["operatorIdentifier"];
          const mergedValues = uniqueValues(item["children"]);
          mergedValues.forEach((params) => {
            queryString += "&";
            queryString += params["identifier"];
            queryString += "=";
            if (Array.isArray(params["value"])) {
              queryString += params["value"].toString();
            } else if (params["value"]) {
              queryString += params["value"];
            }
          });
          queryString += ")";
        });
      }

      //When not on advancedSearch page
      if (this.$route.path !== "/advancedsearch") {
        if (this.getAdvancedSearchText) {
          this.$router.push({
            name: "AdvancedSearchResult",
            query: this.isAdvancedSearchTerm(queryString),
          });
        } else {
          this.$router.push({
            name: "AdvancedSearchResult",
            query: this.noAdvancedSearchTerm(queryString),
          });
        }
      }
      //When on advancedSearch page
      else {
        if (this.getAdvancedSearchText) {
          this.$router.push({
            query: this.isAdvancedSearchTerm(queryString),
          });
        } else {
          this.$router.push({
            query: this.noAdvancedSearchTerm(queryString),
          });
        }
      }
    },

    updateSearchText(item) {
      this.updatedAdvancedSearchText = item;
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
