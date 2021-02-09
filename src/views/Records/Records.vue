<template>
  <v-main>
    <transition name="fade">
      <jump-to-top v-if="scrollStatus" />
    </transition>
    <v-container
      fluid
      class="pa-0"
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
      <v-row no-gutters>
        <v-col
          cols="12"
          lg="4"
          md="4"
          xl="3"
          class="d-none d-md-flex mt-2 ml-2"
        >
          <SearchInput
            id="search-input-mb"
            :class="[responsiveClassObject]"
          />
        </v-col>
        <v-col class="mt-2">
          <SearchOutput class="pb-5 mr-0 mr-md-2" />
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
import filterChipsUtils from "@/utils/filterChipsUtils";

export default {
  name: "Records",
  components: {JumpToTop, SearchOutput, SearchInput},
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
    ...mapState('uiController', ['scrollStatus', 'stickToTop']),
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
      this.$scrollTo('body',50,{})
      await this.tryRedirect();
    }
  },
  mounted: function () {
    window.addEventListener("scroll", this.onScroll);
    this.$nextTick(async function () {
      await this.tryRedirect();
      this.$scrollTo('body',50,{})
    });
  },
  destroyed() {
    this.$scrollTo('body',50,{})
    window.removeEventListener("scroll", this.onScroll);
    this.setStickToTop(false);
    this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
      drawerVisibilityState: false,
      headerVisibilityState: true,
    });
  },
  methods: {
    ...mapActions('records', ['fetchRecords']),
    ...mapActions('uiController', ['setScrollStatus', 'setStickToTop']),
    onScroll: function () {
      let _module = this;
      _module.offsetTop = window.top.scrollY;
      if (_module.offsetTop > 100 && _module.records.length > 1) {
        _module.setStickToTop(true);
        _module.$store.dispatch("uiController/setGeneralUIAttributesAction", {
          headerVisibilityState: false,
        });
      }
      else {
        _module.setStickToTop(false);
        _module.$store.dispatch("uiController/setGeneralUIAttributesAction", {
          drawerVisibilityState: false,
          headerVisibilityState: true,
        });
      }
      _module.offsetTop > 500 ? _module.setScrollStatus(true) :
          _module.setScrollStatus(false);
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
      await this.getData();
    },
    /** This methods get the data from the client.
     * @returns {Promise}
     */
    getData: async function () {
      this.$scrollTo('body',50,{})
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

#search-input-mb{
  margin-bottom: 105px;
}
</style>
