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
    class="pa-5"
  >
    <v-data-iterator
      :items="getAdvancedSearchResponse"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      :hide-default-footer="noFooter"
      :footer-props="{ 'items-per-page-options': [5, 10, 25, 50, 100] }"
    >
      <!-- headers start -->
      <template #header>
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
                  :href="fairSharingURL + getRecordLink(item)"
                  target="_blank"
                  class="ml-10"
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
      <!-- footer ends -->
      <template #no-data>
        <v-alert
          colored-border
          type="info"
        >
          No records match your search!
        </v-alert>
      </template>
    </v-data-iterator>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import RecordStatus from "@/components/Records/Shared/RecordStatus";
import advancedSearch from "@/store";
import recordsCardUtils from "@/utils/recordsCardUtils";
import ErrorPage from "@/views/Errors/404.vue";
import TagChips from "@/views/Records/TagChips.vue";
export default {
  name: "AdvancedSearchResultTable",
  components: { RecordStatus, TagChips, ErrorPage },
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
      if (
        Array.isArray(this.getAdvancedSearchResponse) &&
        !this.getAdvancedSearchResponse.length
      ) {
        return true;
      }
      return false;
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
                value: [],
              };
              advancedSearchParams["identifier"] = paramValues[0];
              advancedSearchParams["value"] = paramValues[1].split(",");
              searchObj["children"].push(advancedSearchParams);
            }
          });

          searchQuery["children"].push(searchObj);
        });

        //Committing the URL query param to setAdvancedSearch mutation in appropriate format to execute the advancedSearchQuery
        advancedSearch.commit("advancedSearch/setAdvancedSearch", searchQuery);
        advancedSearch.commit(
          "advancedSearch/setEditAdvancedSearch",
          searchQuery
        );

        // advancedSearch.commit("advancedSearch", {
        //   setAdvancedSearch: searchQuery,
        //   setEditAdvancedSearch: searchQuery,
        // });

        //Calling the fetch method to get the result
        if (routeQuery["q"]) this.fetchAdvancedSearchResults(routeQuery["q"]);
        else this.fetchAdvancedSearchResults(routeQuery["q"]);
      }
    },
  },
};
</script>
