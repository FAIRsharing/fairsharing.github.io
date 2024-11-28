<template>
  <div
    v-if="getErrorStatus"
    fluid
    class="pa-0"
  >
    <ErrorPage />
  </div>
  <div
    v-else
    fluid
    class="pa-5 mb-15"
  >
    <div
      :class="
        $vuetify.breakpoint.mdAndUp ? 'buttonWrapper' : 'd-flex flex-column'
      "
    >
      <v-btn
        class="mb-2"
        color="primary"
        small
        @click="downloadResults()"
      >
        Download Results
      </v-btn>
      <SaveSearchButton />
    </div>
    <p class="body-2 mb-0 mt-4">
      <v-icon
        x-small
        class="infoIcon"
      >
        {{ "fa fa-info" }}
      </v-icon>Find out more about our Advanced Search in our
      <a
        href="https://fairsharing.gitbook.io/fairsharing/how-to/advanced-search"
        target="_blank"
        class="text-decoration-underline"
      >gitbook documentation<v-icon x-small>
        {{ "fa fa-link" }}
      </v-icon>
      </a>
    </p>
    <v-data-iterator
      :items="getAdvancedSearchResponse"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      :hide-default-footer="noFooter"
      :loading="getLoadingStatus"
      :footer-props="{
        'items-per-page-text': 'Records per page:',
        'items-per-page-options': [5, 10, 25, 50, 100],
      }"
    >
      <!-- headers start -->
      <template #header="{ pagination, options, updateOptions }">
        <v-data-footer
          :pagination="pagination"
          :options="options"
          items-per-page-text="Records per page:"
          @update:options="updateOptions"
        />
        <v-toolbar
          dark
          color="blue lighten-1"
          class="mb-5"
        >
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-filter"
            label="Filter these results"
          />
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer />
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              prepend-inner-icon="mdi-sort"
              label="Sort by"
            />
            <v-spacer />
            <v-btn-toggle
              v-model="sortDesc"
              mandatory
            >
              <v-btn
                large
                depressed
                color="blue"
                :value="false"
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn
                large
                depressed
                color="blue"
                :value="true"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>
      <!-- headers stop -->
      <!-- data section begins -->
      <template #default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.name"
            cols="12"
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                <RecordStatus :record="item" />
                <a
                  :href="'/' + item.id"
                  target="_blank"
                  class="ml-10"
                  :class="
                    item['status'] === 'deprecated'
                      ? 'text-decoration-line-through'
                      : null
                  "
                >
                  {{ item.name }}
                </a>
              </v-card-title>

              <p
                class="mt-2 ml-10 pr-2 text-sm-body-2 text-md-body-1 text-justify text-ellipses-height-2lines"
              >
                {{ item.description }}
              </p>

              <TagChips
                :record="item"
                class="ml-10"
              />
              <p class="pb-5" />
            </v-card>
          </v-col>
        </v-row>
      </template>
      <!-- data section ends -->

      <template #loading>
        Loading...
      </template>
    </v-data-iterator>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import SaveSearchButton from "@/components/Records/Search/SaveSearch/SaveSearchButton.vue";
import RecordStatus from "@/components/Records/Shared/RecordStatus.vue";
import TagChips from "@/components/Records/Shared/TagChips.vue";
import advancedSearch from "@/store";
import recordsCardUtils from "@/utils/recordsCardUtils";
import ErrorPage from "@/views/Errors/404.vue";
export default {
  name: "AdvancedSearchResultTable",
  components: { RecordStatus, TagChips, ErrorPage, SaveSearchButton },
  mixins: [recordsCardUtils],
  data() {
    return {
      itemsPerPageArray: [10, 20, 50, 100, 200],
      search: "",
      sortDesc: false,
      page: 1,
      itemsPerPage: 5,
      sortBy: "name",
      keys: ["Name", "Registry", "Type", "Status", "Description"],
      fairSharingURL: process.env.VUE_APP_FAIRSHARING_URL,
    };
  },
  computed: {
    ...mapGetters("advancedSearch", [
      "getAdvancedSearchResponse",
      "getLoadingStatus",
      "getErrorStatus",
      "getAdvancedSearchQuery",
    ]),
    noFooter() {
      return (
        Array.isArray(this.getAdvancedSearchResponse) &&
        !this.getAdvancedSearchResponse.length
      );
    },
  },
  mounted() {
    this.fetchQueryParams();
  },
  methods: {
    ...mapActions("advancedSearch", ["fetchAdvancedSearchResults"]),
    /**
     * Fetch query from URL and display advancedSearch Result
     */
    fetchQueryParams() {
      if (
        Array.isArray(this.getAdvancedSearchResponse) &&
        !this.getAdvancedSearchResponse.length &&
        Array.isArray(this.getAdvancedSearchQuery["fields"]) &&
        !this.getAdvancedSearchQuery["fields"].length
      ) {
        // Checking if advancedsearch has query parameters
        if (Object.keys(this.$route.query).length) {
          const routeQuery = this.$route.query;
          //Query format is same as setAdvancedSearch mutation
          let searchQuery = {
            operatorIdentifier: "",
            children: [],
          };

          searchQuery["operatorIdentifier"] = routeQuery["operator"];

          //Destructuring the fields string into valid setAdvancedSearch format to execute the query
          const searchFieldsArr = routeQuery["fields"]
            .split("(")
            .join("")
            .split(")")
            .filter((item) => item); //Filter is used to remove empty string

          searchFieldsArr.forEach((item) => {
            const itemArr = item.split("&");
            let searchObj = {
              operatorIdentifier: "",
              children: [],
            };
            itemArr.forEach((subItem) => {
              const paramValues = subItem.split("=");
              if (paramValues[0] === "operator") {
                searchObj["operatorIdentifier"] = paramValues[1];
              } else {
                let advancedSearchParams = {
                  identifier: "",
                  value: [] || Boolean,
                };
                advancedSearchParams["identifier"] = paramValues[0];
                // For boolean/string values
                if ((paramValues[1] === "true") || paramValues[1] === "false") {
                  advancedSearchParams["value"] = paramValues[1];
                }
                else {
                  advancedSearchParams["value"] = paramValues[1].split("+");
                }
                searchObj["children"].push(advancedSearchParams);
              }
            });

            searchQuery["children"].push(searchObj);
          });

          //Committing the URL query param to setAdvancedSearch mutation in appropriate format to execute the advancedSearchQuery
          advancedSearch.commit(
            "advancedSearch/setAdvancedSearch",
            searchQuery
          );

          //Committing the URL query param to setEditAdvancedSearch mutation in appropriate format to execute the edit advanced search
          advancedSearch.commit(
            "advancedSearch/setEditAdvancedSearch",
            searchQuery
          );

          //Calling the fetch method to get the result
          if (routeQuery["q"]) this.fetchAdvancedSearchResults(routeQuery["q"]);
          else this.fetchAdvancedSearchResults(routeQuery["q"]);
        }
      }
    },
    /**
     * Download Results on click of download result button
     */
    downloadResults() {
      const MIME_TYPE = "text/csv";
      let data = [
        "Name 5,Abbreviation,FAIRsharingURL,FAIRsharing DOI,Homepage,Number of Publications \n",
      ];
      this.getAdvancedSearchResponse.forEach((record) => {
        data.push(
          `${record.name.replace(/,/g, "")},${
            record.abbreviation || "n/a"
          },https://fairsharing.org/${record.id},${record.doi || "n/a"},${
            record.homepage || "n/a"
          },${this.recordPublicationsLength(record)}\n`
        );
      });
      let blob = new Blob(data, { type: MIME_TYPE });
      window.location.href = window.URL.createObjectURL(blob);
    },
    /**
     * Calculate number of the publications for the record
     * @param record
     * @return {number}
     */
    recordPublicationsLength(record) {
      return record["publications"] && record["publications"].length
        ? record["publications"].length
        : 0;
    },
  },
};
</script>
<style lang="scss" scoped>
.infoIcon {
  border: 1px solid;
  border-radius: 50%;
  padding: 3px 6px;
  margin: -2px 2px 0 0;
}
.buttonWrapper {
  position: relative;
  .saveSearchResults {
    position: absolute;
    left: 40%;
  }
}
</style>
