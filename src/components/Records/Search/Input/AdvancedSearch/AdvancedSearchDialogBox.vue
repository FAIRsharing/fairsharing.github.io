<template>
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
          <div v-if="!getEditDialogStatus">
            <span class="text-h5">
              {{ advancedSearchTerm }}
            </span>
          </div>
          <div
            v-else
            class="d-flex full-width"
          >
            <TooltipComponent
              :tool-tip-text="toolTipText"
              text-colour="black--text"
            />
            <v-text-field
              class="text-h5"
              clearable
              full-width
              outlined
              hide-details
              label="Add Search text"
              :value="getAdvancedSearchText"
              @change="updateSearchText($event)"
            />
          </div>
        </v-card-title>
        <v-card-text>
          <QueryBuilderView :is-dialog="dialog" />
        </v-card-text>
        <v-card-actions class="px-6">
          <v-btn
            color="accent3"
            variant="text"
            class="white--text"
            width="250"
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
            width="250"
            @click="goToAdvancedSearch()"
          >
            Proceed
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import TooltipComponent from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/TooltipComponent.vue";
import QueryBuilderView from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderView.vue";
import advancedSearch from "@/store";
import { uniqueValues } from "@/utils/advancedSearchUtils";

export default {
  name: "AdvancedSearchDialogBox",
  components: { QueryBuilderView, TooltipComponent },
  props: {
    advancedSearchTerm: {
      default: "",
      type: String,
    },
  },
  data: () => {
    return {
      dialog: false,
      updatedAdvancedSearchText: "",
      toolTipText:
        "Text will be searched against record fields such as name, abbreviation, description, tags, etc. Then, the results of that search will be filtered by the filters you have specified below.",
    };
  },
  computed: {
    ...mapGetters("advancedSearch", [
      "getAdvancedSearch",
      "getAdvancedSearchText",
      "getEditDialogStatus",
      "getAdvancedSearchDialogStatus",
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
    getAdvancedSearchDialogStatus(newValue) {
      this.dialog = newValue;
    },
  },
  methods: {
    ...mapActions("advancedSearch", ["fetchAdvancedSearchResults"]),

    closeDialog() {
      this.dialog = false;
      advancedSearch.commit("advancedSearch/setEditDialogStatus", false);
      advancedSearch.commit(
        "advancedSearch/setAdvancedSearchDialogStatus",
        false
      );
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
      this.closeDialog();
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
