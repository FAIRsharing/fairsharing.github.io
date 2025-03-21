<template>
  <v-row justify="center">
    <v-dialog
      :model-value="dialog"
      fullscreen
      persistent
      :retain-focus="false"
      @keydown.esc="closeDialog()"
    >
      <v-card>
        <div
          class="d-flex pt-6 px-6 justify-space-between"
          :class="{
            'flex-column align-end': $vuetify.display.smAndDown,
          }"
        >
          <!--Close Button -->
          <div
            class="order-md-3"
            style="padding-left: 14.4%"
          >
            <v-btn
              icon
              @click="closeDialog()"
            >
              <v-icon icon="fa fa-xmark fa-solid" size="40" />
            </v-btn>
          </div>
          <!--FAIRsharing Logo -->
          <router-link
            to="/"
            class="mt-n5 order-md-1"
            :class="{
              'mt-n15 mx-auto': $vuetify.display.smAndDown,
            }"
          >
            <img
              src="/assets/fairsharing-logo.svg"
              alt="FAIRsharing logo"
              @click="closeDialog()"
            >
          </router-link>
          <!--Advanced Search Header Text -->
          <div
            class="order-sm-2"
            style="text-align: center; margin: 0 auto 0 auto"
          >
            <h2 class="text-primary">
              Advanced filtering and searching for FAIRsharing records
            </h2>
            <p style="text-align: center">
              Find out more about our Advanced Search in our
              <a
                href="https://fairsharing.gitbook.io/fairsharing/how-to/advanced-search"
                target="_blank"
                class="text-decoration-underline"
              >gitbook documentation<v-icon size="x-small">
                {{ "fa fa-link" }}
              </v-icon>
              </a>
            </p>
          </div>
        </div>
        <v-card-title>
          <!--It will print the advancedSearch text on the dialog box when the search text is entered in the search field on the home page and advancedSearch is click-->
          <!--          <div v-if="!getEditDialogStatus">-->
          <!--            <span class="text-h5">-->
          <!--              {{ advancedSearchTerm }}-->
          <!--            </span>-->
          <!--          </div>-->

          <div class="d-flex full-width align-center">
            <TooltipComponent
              :tool-tip-text="toolTipText"
              text-colour="text-black"
            />
            <v-text-field
              v-if="!getEditDialogStatus"
              ref="inputRef"
              class="text-h5 full-width"
              clearable
              variant="outlined"
              hide-details
              label="Add Search text"
              @change="updateSearchText($event)"
            />
            <v-text-field
              v-else
              class="text-h5 full-width"
              clearable
              variant="outlined"
              hide-details
              label="Add Search text"
              :model-value="getAdvancedSearchText"
              @update:model-value="updateSearchText($event)"
              @change="updateSearchText($event)"
            />
          </div>
        </v-card-title>
        <v-card-text>
          <QueryBuilderView :is-dialog="dialog" />
        </v-card-text>
        <v-card-actions
          class="px-6 justify-space-between"
          :class="{
            'flex-column align-center': $vuetify.display.smAndDown,
          }"
        >
          <v-btn
            variant="text"
            class="text-white order-md-2 bg-green"
            :class="{
              'mb-3': $vuetify.display.smAndDown,
            }"
            :disabled="isContinue"
            :width="$vuetify.display.smAndDown ? '100%' : '250'"
            @click="goToAdvancedSearch()"
          >
            Proceed
          </v-btn>
          <v-btn
            variant="text"
            class="order-md-1 ml-0 bg-accent3"
            :width="$vuetify.display.smAndDown ? '100%' : '250'"
            @click="closeDialog()"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { isBoolean } from "lodash";
import { mapActions, mapGetters } from "vuex";

import TooltipComponent from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/UtilComponents/TooltipComponent.vue";
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
  emits: ["clearSearchField"],
  data: () => {
    return {
      dialog: false,
      updatedAdvancedSearchText: "",
      toolTipText:
        "Text will be searched against record fields such as name, abbreviation, description, tags, etc. Then, the results of that search will be filtered by the filters you have specified below.",
      queryString: "",
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
            isTrue = children.every(({ value }) => value.length || isBoolean(value));
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
      //Reset searchText field
      if (newValue && this.$refs.inputRef !== undefined) {
        this.$refs.inputRef.reset();
      }
    },
  },
  mounted() {
    //When the user is redirected to advancedsearch url directly
    //it will open the dialog box
    if (this.$route.fullPath.toLowerCase() === "/advancedsearch") {
      advancedSearch.commit(
        "advancedSearch/setAdvancedSearchDialogStatus",
        true
      );
    }
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
      // Redirecting to home page after closing
      if (this.$route.fullPath.toLowerCase() === "/advancedsearch") {
        this.$router.push("/");
      }
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
    /**
     * Method called on the click of the proceed button
     * in dialog box
     */
    goToAdvancedSearch() {
      if (this.updatedAdvancedSearchText) {
        this.fetchAdvancedSearchResults(this.updatedAdvancedSearchText);
      }
      else {
        this.fetchAdvancedSearchResults(this.advancedSearchTerm);
      }
      this.closeDialog();
      //Clear search text field flag
      this.$emit("clearSearchField", true);

      this.advancedSearchQueryString();
      this.advancedSearchNavigation(this.queryString);
    },

    /**
     * Add advancedSearch selection to query params in
     * and create URL by inserting array of objects into string
     */
    advancedSearchQueryString() {
      if (
        this.getAdvancedSearch["children"] &&
        this.getAdvancedSearch["children"].length
      ) {
        this.getAdvancedSearch["children"].forEach((item) => {
          this.queryString = "";
          this.queryString += "(operator=";
          this.queryString += item["operatorIdentifier"];
          const mergedValues = uniqueValues(item["children"]);
          mergedValues.forEach((params) => {
            this.queryString += "&";
            this.queryString += params["identifier"];
            this.queryString += "=";
            if (Array.isArray(params["value"])) {
              this.queryString += params["value"].join('+');
            }
            else if (params["value"]) {
              this.queryString += params["value"];
            }
          });
          this.queryString += ")";
        });
      }
    },

    /**
     * Navigation method called on the click of the proceed button
     * and on the advancedSearch page
     */
    advancedSearchNavigation(queryString) {
      //When not on advancedSearch page
      if (this.$route.path !== "/advancedsearch") {
        if (this.getAdvancedSearchText) {
          this.$router.push({
            name: "AdvancedSearchResult",
            query: this.isAdvancedSearchTerm(queryString),
          });
        }
        else {
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
        }
        else {
          this.$router.push({
            query: this.noAdvancedSearchTerm(queryString),
          });
        }
      }
    },

    /**
     * Method to fetch/update the searchTerm
     * @param {String} -- item
     */
    updateSearchText(item) {
      this.updatedAdvancedSearchText = item;
    },
  },
};
</script>
