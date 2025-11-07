<template>
  <div v-if="getErrorStatus" fluid class="pa-0">
    <ErrorPage />
  </div>
  <div v-else class="pa-5 mb-15">
    <div
      :class="$vuetify.display.mdAndUp ? 'buttonWrapper' : 'd-flex flex-column'"
    >
      <v-btn
        class="mb-2 font-12"
        color="primary"
        size="small"
        @click="downloadResults()"
      >
        Download Results
      </v-btn>
      <SaveSearchButton />
    </div>
    <p class="text-body-2 mb-0 mt-4">
      <v-icon size="small" class="mr-1"> fa fa-info-circle </v-icon>Find out
      more about our Advanced Search in our
      <a
        href="https://fairsharing.gitbook.io/fairsharing/how-to/advanced-search"
        target="_blank"
        class="text-decoration-underline"
        >gitbook documentation</a
      >
      <v-icon size="x-small"> fa fa-link </v-icon>
    </p>
    <v-data-iterator
      :items-per-page="itemsPerPage"
      :page="page"
      :items="getAdvancedSearchResponse"
      :search="search"
      :sort-by="sortData"
      multi-sort
      :loading="getLoadingStatus"
    >
      <!-- headers start -->
      <template #header="{ pagination, options, updateOptions }">
        <v-data-table-footer
          v-if="!noPagination"
          :pagination="pagination"
          :options="options"
          items-per-page-text="Records per page:"
          @update:options="updateOptions"
        />
        <v-toolbar dark color="blue-lighten-1" class="mb-5 px-4 py-1">
          <v-text-field
            :model-value="search"
            clearable
            flat
            variant="solo"
            hide-details
            prepend-inner-icon="fa fa-solid fa-filter"
            label="Filter these results"
            width="125"
            @update:model-value="search = $event"
          />
          <template v-if="$vuetify.display.mdAndUp">
            <v-spacer />
            <v-select
              v-model="sortBy"
              flat
              variant="solo"
              hide-details
              :items="keys"
              prepend-inner-icon="fa fa-solid fa-arrow-up-short-wide"
              label="Sort by"
              width="125"
            />
            <v-spacer />
            <v-btn-toggle
              :model-value="sortDesc"
              mandatory
              @update:model-value="sortDesc = $event"
            >
              <v-btn size="large" variant="flat" color="blue" :value="false">
                <v-icon icon="fa fa-solid fa-arrow-up" />
              </v-btn>
              <v-btn size="large" variant="flat" color="blue" :value="true">
                <v-icon icon="fa fa-solid fa-arrow-down" />
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>
      <!-- headers stop -->
      <!-- data section begins -->
      <template #default="{ items }">
        <v-row>
          <v-col v-for="item in items" :key="item.raw.name" cols="12">
            <v-card>
              <v-card-title
                class="text-subtitle-1 font-weight-bold d-flex align-center"
              >
                <RecordStatus :record="item.raw" />
                <a
                  :href="fairSharingURL + getRecordLink(item.raw)"
                  target="_blank"
                  class="ml-10"
                  style="white-space: normal"
                >
                  {{ item.raw.name }}
                </a>
              </v-card-title>

              <p
                class="mt-2 ml-10 pr-2 text-sm-body-2 text-md-body-1 text-justify text-ellipses-height-2lines"
              >
                {{ item.raw.description }}
              </p>

              <TagChips :record="item.raw" class="ml-10" />
              <p class="pb-5" />
            </v-card>
          </v-col>
        </v-row>
      </template>
      <!-- data section ends -->
      <!-- footer start -->
      <template
        v-if="!noPagination"
        #footer="{ pagination, options, updateOptions }"
      >
        <v-data-table-footer
          :pagination="pagination"
          :options="options"
          items-per-page-text="Records per page:"
          @update:options="updateOptions"
        />
      </template>
      <!-- footer ends -->
      <template #no-data> No results found. </template>
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
  components: { RecordStatus, ErrorPage, TagChips, SaveSearchButton },
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
      fairSharingURL: import.meta.env.VITE_FAIRSHARING_URL,
    };
  },
  computed: {
    ...mapGetters("advancedSearch", [
      "getAdvancedSearchResponse",
      "getLoadingStatus",
      "getErrorStatus",
      "getAdvancedSearchQuery",
    ]),
    // When there is no data in the table, hide pagination
    noPagination() {
      return (
        Array.isArray(this.getAdvancedSearchResponse) &&
        !this.getAdvancedSearchResponse.length
      );
    },
    sortData() {
      switch (this.sortBy) {
        case "Name":
          return [{ key: "name", order: this.sortDesc ? "desc" : "asc" }];
        case "Registry":
          return [{ key: "registry", order: this.sortDesc ? "desc" : "asc" }];
        case "Type":
          return [{ key: "type", order: this.sortDesc ? "desc" : "asc" }];
        case "Status":
          return [{ key: "status", order: this.sortDesc ? "desc" : "asc" }];
        case "Description":
          return [
            { key: "description", order: this.sortDesc ? "desc" : "asc" },
          ];
        default:
          return [{ key: "name", order: this.sortDesc ? "desc" : "asc" }];
      }
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
            .split(/^\((.*)\)$/) //removes only first and last parenthesis
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
                if (paramValues[1] === "true" || paramValues[1] === "false") {
                  advancedSearchParams["value"] = paramValues[1];
                } else {
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
            searchQuery,
          );

          //Committing the URL query param to setEditAdvancedSearch mutation in appropriate format to execute the edit advanced search
          advancedSearch.commit(
            "advancedSearch/setEditAdvancedSearch",
            searchQuery,
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
          },${this.recordPublicationsLength(record)}\n`,
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
.buttonWrapper {
  position: relative;
  .saveSearchResults {
    position: absolute;
    left: 40%;
  }
}
</style>
