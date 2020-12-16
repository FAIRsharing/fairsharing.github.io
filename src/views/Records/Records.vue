77<template>
  <v-main>
    <transition name="fade">
      <jump-to-top
        v-if="scrollStatus"
        target-object="scroll-target"
      />
    </transition>
    <div
      v-if="getChips.length && stickToTop"
      :class="[responsiveClassSticky]"
      class="d-flex align-content-center justify-content-center chips-holder"
    >
      <filter-chips />
    </div>
    <!--Filtered Chips-->
    <v-container
      id="scroll-target"
      fluid
      class="overflow-y-auto overflow-x-hidden"
      :class="getChips.length && stickToTop?'content-custom-new-height':'content-custom'"
    >
      <!-- Title banner -->
      <div>
        <section
          id="banner"
          class="secondary"
        >
          <h1 class="text-center white--text">
            {{ getTitle }}
          </h1>
          <p class="text-center white--text">
            {{ recordsSubTitles[getTitle] }}
          </p>
        </section>
      </div>

      <!--  Content  -->
      <v-row
        no-gutters
      >
        <v-col
          cols="12"
          lg="4"
          md="4"
          xl="3"
          class="d-none d-md-flex mt-2 ml-2"
        >
          <SearchInput
            :class="[responsiveClassObject]"
          />
        </v-col>
        <v-col class="mt-2">
          <SearchOutput
            v-scroll:#scroll-target="onScroll"
            class="pb-5 mr-0 mr-md-2"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import SearchInput from "@/components/Records/Search/Input/SearchInput";
import SearchOutput from "@/components/Records/Search/Output/SearchOutput";
import {mapActions, mapState} from 'vuex'
import JumpToTop from "@/components/Navigation/jumpToTop";
import recordsLabels from "@/data/recordsTypes.json"
import FilterChips from "@/components/Records/Search/Header/FilterChips";
import filterChipsUtils from "@/utils/filterChipsUtils";

export default {
  name: "Records",
  components: { JumpToTop, SearchOutput, SearchInput, FilterChips},
  mixins: [filterChipsUtils],
  data: () => ({
    searchTerm: '',
    offsetTop: 0,
    bodyOverflowActive: true,
    hideOverflow: 'overflow-hidden',
    showHeader: true,
    showDrawerLeft: false,
    labels: recordsLabels,
    recordsSubTitles: recordsLabels['recordSubTitles'],
    recordTypes: recordsLabels['recordTypes']
  }),
  computed: {
    ...mapState('uiController', ['scrollStatus','stickToTop']),
    ...mapState('records', ['records']),
    getTitle: function () {
      const flipRecordTypes = Object.entries(this.recordTypes).reduce(
          (obj, [key, value]) => ({...obj, [value]: key}),
          {}
      );
      let title = "Search";
      if (Object.prototype.hasOwnProperty.call(this.$route.query, 'fairsharingRegistry')) {
        if (Object.prototype.hasOwnProperty.call(flipRecordTypes, this.$route.query.fairsharingRegistry)) {
          title = flipRecordTypes[this.$route.query.fairsharingRegistry];
        }
      }
      return title;
    },
    responsiveClassObject: function () {
      return {
        'left-panel-fixed-lg': this.stickToTop && this.$vuetify.breakpoint.xlOnly,
        'left-panel-default-lg': !this.stickToTop && this.$vuetify.breakpoint.xlOnly,
        'left-panel-default': !this.stickToTop && !this.$vuetify.breakpoint.xlOnly,
        'left-panel-fixed': this.stickToTop && !this.$vuetify.breakpoint.xlOnly
      }
    },
    responsiveClassSticky: function () {
      return {
        'sticky-style-sm-xs': this.$vuetify.breakpoint.smAndDown,
        'sticky-style-md-lg': this.$vuetify.breakpoint.lgAndDown,
        'sticky-style-xl': this.$vuetify.breakpoint.xlOnly,
      }
    },
    currentPath: function () {
      let title = this.$route.path.replace('/', '');
      const client = this;
      let queryParams = {};
      Object.keys(this.$route.query).forEach(function (prop) {
        let queryVal = client.$route.query[prop];
        if (queryVal) {
            queryParams[prop] = decodeURI(queryVal);
        }
      });
      if (this.recordTypes[title.charAt(0).toUpperCase() + title.slice(1)]) {
          title = this.recordTypes[title.charAt(0).toUpperCase() + title.slice(1)]
      }
      else title = title.charAt(0).toUpperCase() + title.slice(1);
      return [title, queryParams];
    },
  },
  watch: {
    currentPath: async function () {
      await this.tryRedirect();
    }
  },
  mounted: function () {
    this.$nextTick(async function () {
      await this.tryRedirect();
    });
  },
  created() {
    this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
      bodyOverflowState: true,
      drawerVisibilityState: false,
      headerVisibilityState: true,
    });
  },
  destroyed() {
    this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
      bodyOverflowState: false,
      drawerVisibilityState: false,
      headerVisibilityState: true,
    });
    this.setStickToTopLocal(false);
  },
  methods: {
    ...mapActions('records', ['fetchRecords']),
    ...mapActions({setScrollStatusLocal: 'uiController/setScrollStatus'}),
    ...mapActions({setStickToTopLocal: 'uiController/setStickToTop'}),
    onScroll: function (e) {
      let _module = this;
      _module.offsetTop = e.target.scrollTop;
      if (_module.offsetTop > 100 && _module.records.length > 1) {
          _module.setStickToTopLocal(true);
          _module.$store.dispatch("uiController/setGeneralUIAttributesAction", {
            bodyOverflowState: true,
            headerVisibilityState: false,
        });
      }
      else {
          _module.setStickToTopLocal(false);
          _module.$store.dispatch("uiController/setGeneralUIAttributesAction", {
            bodyOverflowState: true,
            drawerVisibilityState: false,
            headerVisibilityState: true,
          });
      }
      _module.offsetTop > 500 ? _module.setScrollStatusLocal(true) :
          _module.setScrollStatusLocal(false);
    },
    /**
     * Try to redirect to search of the page that is hit is /standards /databases
     * /policies or /collections
     * */
    tryRedirect: async function () {
      if (Object.keys(this.recordTypes).includes(this.$route.name)) {
        let fairsharingRegistry = this.recordTypes[this.$route.name];
        let query = this.$route.params;
        if (query && query !== {}) {
          query.fairsharingRegistry = fairsharingRegistry;
          try {
            await this.$router.push({
              name: "search",
              query: query
            });
            return true;
          }
          catch (e) {
            //
          }
        }
      }
      await this.getData()
    },
    /** This methods get the data from the client.
     * @returns {Promise}
     */
    getData: async function () {
      window.scrollTo(0, 0);
      this.errors = null;
      const _module = this;
      try {
        await _module.fetchRecords(this.getParameters());
      }
      catch (e) {
        this.errors = e.message;
      }
    },
    /**
     * Get the parameters that are allowed for this query
     * @returns {Object} parameters - parameters and types allowed for this query
     */
    getParameters: function () {
      return this.$store.getters["introspection/buildQueryParameters"](this.currentPath);
    },
  },
  /**
   * Setting up the metaInfo of the page
   * @returns {{title: String}}
   * */
  metaInfo() {
    return {
      title: 'FAIRsharing | ' + this.getTitle
    }
  },
}
</script>

<style scoped lang="scss">
.left-panel-fixed {
  position: fixed;
  top: 0;
  width: 32vw;
}

.left-panel-default {
  position: relative;
  width: 32vw;
}

.left-panel-fixed-lg {
  position: fixed;
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

.chips-holder {
  position: sticky;
  z-index: 5;
  background: #f5f5f5;
  min-height: 50px;
  border: #dbdbdb dotted 2px;
  border-radius: 10px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
}

.sticky-style-xl {
  margin: 5px 5px 5px 25.4%;
}

.sticky-style-md-lg {
  margin: 5px 5px 5px 33.3%;
}

.sticky-style-sm-xs {
  margin: 0 0 0 0;
}
</style>
