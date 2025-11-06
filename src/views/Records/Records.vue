<template>
  <v-main>
    <v-container fluid class="pa-0">
      <!--  Content  -->
      <v-row no-gutters>
        <v-col
          v-if="$vuetify.display.lgAndUp"
          cols="12"
          lg="4"
          md="4"
          xl="3"
          class="d-flex mt-2 ml-2"
        >
          <SearchInput
            :class="[
              'search-input-mb',
              {
                'left-panel-fixed-lg': stickToTop && $vuetify.display.xlOnly,
                'left-panel-default-lg': !stickToTop && $vuetify.display.xlOnly,
                'left-panel-default': !stickToTop && !$vuetify.display.xlOnly,
                'left-panel-fixed': stickToTop && !$vuetify.display.xlOnly,
              },
            ]"
          />
        </v-col>
        <v-col v-else cols="12" class="ml-3 mt-2">
          <v-btn class="bg-info" @click="showFiltersSM = true">
            <span class="mr-2">Show filters</span>
            <v-icon size="small"> fas fa-filter </v-icon>
          </v-btn>
        </v-col>

        <v-col class="mt-2">
          <SearchOutput class="pb-5 mr-0 mr-md-2 px-3" />
        </v-col>
      </v-row>
    </v-container>

    <v-fade-transition>
      <div>
        <v-dialog v-model="showFiltersSM" fullscreen :scrim="false" scrollable>
          <v-card>
            <v-card-title class="bg-primary text-white pb-5">
              Add a filter
              <v-spacer />
              <v-btn size="x-small" @click="showFiltersSM = false">
                <v-icon>fas fa-times</v-icon>
              </v-btn>
            </v-card-title>
            <SearchInput class="pa-5" />
          </v-card>
        </v-dialog>
      </div>
    </v-fade-transition>

    <v-fade-transition>
      <div>
        <v-overlay
          v-model="isLoading"
          :absolute="false"
          opacity="0.8"
          class="align-center justify-center"
        >
          <Loaders />
        </v-overlay>
      </div>
    </v-fade-transition>
  </v-main>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";

import Loaders from "@/components/Navigation/Loaders";
import SearchInput from "@/components/Records/Search/Input/SearchInput";
import SearchOutput from "@/components/Records/Search/Output/SearchOutput";
import recordsLabels from "@/data/recordsTypes.json";
import filterChipsUtils from "@/utils/filterChipsUtils";
import onScrollUtil from "@/utils/onScrollUtil";

export default {
  name: "Records",
  components: { Loaders, SearchOutput, SearchInput },
  mixins: [filterChipsUtils, onScrollUtil],
  data: () => ({
    searchTerm: "",
    offsetTop: 0,
    bodyOverflowActive: true,
    hideOverflow: "overflow-hidden",
    showHeader: true,
    showDrawerLeft: false,
    labels: recordsLabels,
    recordsSubTitles: recordsLabels["recordSubTitles"],
    recordTypes: recordsLabels["recordTypes"],
    isLoading: false,
    showFiltersSM: false,
  }),
  computed: {
    ...mapState("uiController", ["scrollStatus", "stickToTop"]),
    ...mapState("records", ["records"]),
    ...mapState("users", ["user"]),

    getTitle: function () {
      const flipRecordTypes = Object.entries(this.recordTypes).reduce(
        (obj, [key, value]) => ({ ...obj, [value]: key }),
        {},
      );
      let title = "Search";
      /* istanbul ignore else */
      if (
        Object.prototype.hasOwnProperty.call(
          this.$route.query,
          "fairsharingRegistry",
        )
      ) {
        if (
          Object.prototype.hasOwnProperty.call(
            flipRecordTypes,
            this.$route.query.fairsharingRegistry,
          )
        ) {
          title = flipRecordTypes[this.$route.query.fairsharingRegistry];
        }
      }
      return title;
    },
    currentPath: function () {
      document.title = "FAIRsharing | " + this.getTitle; // Setting up the metaInfo of the page
      let title = this.$route.path.replace("/", "");
      const client = this;
      let queryParams = {};
      Object.keys(this.$route.query).forEach(function (prop) {
        let queryVal = client.$route.query[prop];
        if (queryVal) {
          queryParams[prop] = decodeURI(queryVal);
        }
      });
      if (this.recordTypes[title.charAt(0).toUpperCase() + title.slice(1)]) {
        title =
          this.recordTypes[title.charAt(0).toUpperCase() + title.slice(1)];
      }
      else title = title.charAt(0).toUpperCase() + title.slice(1);
      return [title, queryParams];
    },
  },
  watch: {
    currentPath: async function () {
      this.$scrollTo("body", 50, {});
      try {
        await this.tryRedirect();
      }
      catch (e) {
        // eslint-disable-next-line no-empty
        // Uncaught promise thrown on Github (only).
      }
    },
  },
  mounted: function () {
    window.addEventListener("scroll", () => {
      this.onScroll(this.records);
    });
    this.$nextTick(async function () {
      try {
        await this.tryRedirect();
        this.$scrollTo("body", 50, {});
      }
      catch (e) {
        // eslint-disable-next-line no-empty
        // Uncaught promise thrown on Github (only).
      }
    });
  },
  beforeUnmount() {
    this.cleanRecordsStore();
  },
  unmounted() {
    this.$scrollTo("body", 50, {});
    window.removeEventListener("scroll", () => {
      this.onScroll(this.records);
    });
    this.setStickToTop(false);
    this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
      drawerVisibilityState: false,
      headerVisibilityState: true,
    });
  },
  methods: {
    ...mapMutations("records", ["cleanRecordsStore"]),
    ...mapActions("records", ["fetchRecords"]),
    ...mapActions("uiController", ["setScrollStatus", "setStickToTop"]),

    /**
     * Try to redirect to search of the page that is hit is /standards /databases
     * /policies or /collections
     * */
    tryRedirect: async function () {
      if (Object.keys(this.recordTypes).includes(this.$route.name)) {
        let fairsharingRegistry = this.recordTypes[this.$route.name];
        let query = this.$route.query;

        /* istanbul ignore else */
        if (query && query !== {}) {
          query.fairsharingRegistry = fairsharingRegistry;
          try {
            await this.$router.push({
              name: "search",
              query: query,
            });
            return true;
          }
          catch (e) {
            return false;
          }
        }
      }
      await this.getData();
    },
    /** This methods get the data from the Client.
     * @returns {Promise}
     */
    getData: async function () {
      this.$scrollTo("body", 50, {});
      this.isLoading = true;
      this.errors = null;
      const _module = this;
      // To make sure that any lingering values from having viewed a collection are cleared out.
      // See SummaryDownload.vue for the code which looks for collection IDs when downloading a
      // summary of search results.
      this.$store.commit("records/setCollectionIdsParam", []);
      try {
        this.showFiltersSM = false;
        let token;
        if (this.user().credentials !== undefined) {
          token = this.user().credentials.token;
        }
        else {
          token = "";
        }
        await _module.fetchRecords({
          params: this.getParameters(),
          token: token,
        });
      }
      catch (e) {
        /* istanbul ignore next */
        this.errors = e.message;
      }
      this.isLoading = false;
    },
    /**
     * Get the parameters that are allowed for this query
     * @returns {Object} parameters - parameters and types allowed for this query
     */
    getParameters: function () {
      return this.$store.getters["introspection/buildQueryParameters"](
        this.currentPath,
      );
    },
  },
};
</script>

<style scoped lang="scss">
.left-panel-fixed {
  position: sticky;
  top: 0;
  width: 32vw;
}

.left-panel-default {
  position: relative;
  width: 32vw;
}

.left-panel-fixed-lg {
  position: sticky;
  top: 0;
  width: 24vw;
}

.left-panel-default-lg {
  position: relative;
  width: 24vw;
}

.content-custom-new-height {
  height: calc(100vh - 40px);
  scroll-behavior: smooth;
  padding: 0;
}

.content-custom {
  height: 100vh;
  scroll-behavior: smooth;
  padding: 0;
}

#banner {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 1em;
}

.search-input-mb {
  margin-bottom: 105px;
}
</style>
