<template>
  <div>
    <v-container
      v-if="error"
      fluid
      class="pa-0"
    >
      <p class="pa-10">
        Sorry, something went wrong!
      </p>
    </v-container>
    <v-container
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

                <!-- TODO: this is a hacky placeholder -->
                <p class="pb-5" />

                <!-- TODO: change below here -->
                <!--
                <v-divider />

                <span>
                  Some information about number of standards etc. can go here.
                </span>

                -->
                <!-- TODO: change above here -->
              </v-card>
            </v-col>
          </v-row>
        </template>
        <!-- data section ends -->
        <!-- footer ends -->
      </v-data-iterator>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import RecordStatus from "@/components/Records/Shared/RecordStatus";
import recordsCardUtils from "@/utils/recordsCardUtils";

import TagChips from "./TagChips";
export default {
  name: "AdvancedSearchResultTable",
  components: { RecordStatus, TagChips },
  mixins: [recordsCardUtils],
  data() {
    return {
      itemsPerPageArray: [10, 20, 50, 100, 200],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 5,
      sortBy: "name",
      records: [],
      loading: true,
      error: false,
      keys: ["Name", "Registry", "Type", "Status", "Description"],
      fairSharingURL: process.env.VUE_APP_FAIRSHARING_URL,
    };
  },
  computed: {
    ...mapGetters("advancedSearch", [
      "getAdvancedSearchResponse",
      "getLoadingStatus",
    ]),
  },
  mounted() {
    // this.showResults();
  },
  methods: {
    // showResults() {
    //   let _module = this;
    //   _module.records = _module.getAdvancedSearchResponse || [];
    // },
  },
};
</script>
