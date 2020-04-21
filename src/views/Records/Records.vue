<template>
  <div
    id="SearchFAIRSharing"
    class="container-fluid pt-0"
  >
    <!-- Title banner -->
    <v-row
      style="height:250px"
      align="center"
      justify="center"
      class="secondary"
    >
      <v-col>
        <v-list class="secondary">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>
                <h1 class="text-center white--text">
                  {{ getTitle }}
                </h1>
              </v-list-item-title>
              <v-list-item-subtitle>
                <div class="text-center body-1 white--text">
                  {{ recordsSubTitles[getTitle] }}
                </div>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>



    <!-- MAIN -->
    <v-row>
      <!-- LEFT PANEL
      <div class="leftPanel col-3">
        <div class="tabs">
          <ul class="nav">
            <li class="nav-item">
              <div class="nav-link active">
                <button
                  type="button"
                  class="btn btn-light"
                  @click="setPanel('AdvSearch')"
                >
                  Advanced search
                </button>
              </div>
            </li>
            <li class="nav-item">
              <div class="nav-link">
                <button
                  type="button"
                  class="btn btn-light"
                  @click="setPanel('Facets')"
                >
                  Facets
                </button>
              </div>
            </li>
          </ul>
        </div>
        <search-filters v-if="currentPanel === 'AdvSearch'" />
        <facets v-if="currentPanel === 'Facets'" />
      </div>
      -->

      <!-- OUTPUT -->
      <v-col
        v-if="!errors"
        cols="12"
      >
        <output-grid />
      </v-col>

      <!-- ERROR HANDLING -->
      <div
        v-else
        class="col-9"
      >
        <div class="error">
          {{ errors }}
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import OutputGrid from '../../components/Records/SearchOutputGrid'

  /** This component gets the request, sends it to a service, the data from it and sends it to a child component OutputTable or OutputGrid (to be added)
   * @vue-data {Object} [recordTypes = {Standards: "Standard", Databases: "Database", Policies: "Policy", Collections: "Collection"}] - a mapping of types of records used by fairsharingRegistry
   * @vue-data {String} [Errors  = null] - a string message in case an error arises.
   * @vue-data {String} [currentPanel = "AdvSearch"] - the current panel to display between currentPanel and Facets (to be removed)
   * @vue-computed {String} currentPath - the path of the current page.
   * @vue-computed {String} getTitle - return "Search" of the fairsharing Registry name.
   * @vue-event {Promise} fetchRecords - Method to get the records based on the given parameters from the recordsStore
   */
  export default {
    name: "Records",
    components: {
      OutputGrid
    },
    data() {
      return {
        recordTypes: {
          Standards: "Standard",
          Databases: "Database",
          Policies: "Policy",
          Collections: "Collection"
        },
        recordsSubTitles: {
          Standards: "The standards in FAIRsharing are manually curated from a variety of sources, including BioPortal, " +
                  "MIBBI and the Equator Network.",
          Collections: "Collections group together one or more types of resource (standard, database or policy) by " +
                  "domain, project or organisation. A Recommendation is a core-set of resources that are selected or " +
                  "endorsed by data policies from journals, funders or other organizations.",
          Databases: "A catalogue of databases, described according to the BioDBcore guidelines, along with the standards " +
                  "used within them; partly compiled with the support of Oxford University Press (NAR Database Issue " +
                  "and DATABASE Journal).",
          Policies: "FAIRsharing policies: A catalogue of data preservation, management and sharing policies from " +
                  "international funding agencies, regulators and journals.",
          Search: "Search the FAIRsharing records using advanced filtering"
        },
        errors: null,
        currentPanel: "AdvSearch"
      }
    },
    computed: {
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
        } else {
          title = title.charAt(0).toUpperCase() + title.slice(1)
        }
        return [
          title,
          queryParams
        ];
      },
      getTitle: function () {
        const flipRecordTypes = Object.entries(this.recordTypes).reduce((obj, [key, value]) => ({
          ...obj,
          [value]: key
        }), {});
        let title = "Search";
        if (Object.prototype.hasOwnProperty.call(this.$route.query, 'fairsharingRegistry')) {
          if (Object.prototype.hasOwnProperty.call(flipRecordTypes, this.$route.query.fairsharingRegistry)) {
            title = flipRecordTypes[this.$route.query.fairsharingRegistry];
          }
        }
        return title;
      }
    },
    watch: {
      currentPath: async function () {
        this.tryRedirect();
        await this.getData();
      }
    },
    mounted: function () {
      this.$nextTick(async function () {
        this.tryRedirect();
        await this.getData();
      })
    },
    beforeDestroy: function () {
      this.$store.dispatch("records/resetFacets").then(function () {
      });
      this.$store.dispatch("records/resetRecords").then(function () {
      });
    },
    methods: {
      /**
       * Try to redirect to search of the page that is hit is /standards /databases
       * /policies or /collections
       * */
      tryRedirect: async function () {
        if (Object.keys(this.recordTypes).includes(this.$route.name)) {
          let fairsharingRegistry = this.recordTypes[this.$route.name];
          let query = this.$route.params;
          if (query) {
            query.fairsharingRegistry = fairsharingRegistry;
            try {
              this.$router.push({
                name: "search",
                query: query
              });
            } catch (e) {
              //
            }
          }
        }
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
        } catch (e) {
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
      ...mapActions('records', ['fetchRecords']),
      /**
       * Method to change the current panel to be displayed
       * @param {String} panelName - the name of the panel to display
       */
      setPanel: function (panelName) {
        this.currentPanel = panelName;
      }
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

<style scoped>
  .error {
    background-color: indianred;
    border: 1px solid red;
    padding: 20px;
    color: white;
    text-align: left;
    font-size: 18px;
  }
</style>
