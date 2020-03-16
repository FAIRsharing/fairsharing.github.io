<template>
  <div
    class="a outputGrid container-fluid"
  >
    <h1>{{ currentPath[1].fairsharingRegistry?currentPath[1].fairsharingRegistry:currentPath[0]}}</h1>

    <!-- PAGINATION -->
    <Pagination
      class="row col-12"
      :total-pages="this.$store.state.records.totalPages"
    />

    <!-- CHIPS -->
    <div class="chips">
      <FiltersChip />
    </div>

    <div class="row">
      <!-- LEFT PANEL -->
      <div class="leftPanel col-3">
        <!-- navigation -->
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

        <!-- filters and facets -->
        <search-filters v-if="currentPanel === 'AdvSearch'" />
        <facets v-if="currentPanel === 'Facets'" />
      </div>

      <!-- OUTPUT -->
      <div
        v-if="!errors"
        class="col-9"
      >
        <output-grid :total-pages="this.$store.state.records.totalPages" />
      </div>

      <!-- ERROR HANDLING -->
      <div
        v-else
        class="col-9"
      >
        <div class="error">
          {{ errors }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import OutputGrid from '../../components/Records/SearchOutputGrid'
    import SearchFilters from "../../components/Records/SearchFilters"
    import Facets from "../../components/Records/Facets";
    import FiltersChip from "../../components/Records/FiltersChip";
    import Pagination from "../../components/Records/Pagination";

    /** This component gets the request, sends it to a service, the data from it and sends it to a child component OutputTable or OutputGrid (to be added)
     * @vue-data {Object} [recordTypes = {Standards: "Standard", Databases: "Database", Policies: "Policy", Collections: "Collection"}] - a mapping of types of records used by fairsharingRegistry
     * @vue-data {String} [Errors  = null] - a string message in case an error arises.
     * @vue-data {String} [currentPanel = "AdvSearch"] - the current panel to display between currentPanel and Facets (to be removed)
     * @vue-computed {String} currentPath - the path of the current page.
     * @vue-event {Promise} fetchRecords - Method to get the records based on the given parameters from the recordsStore
     */

    export default {
        name: "Records",
        components: {
            Pagination,
            FiltersChip,
            Facets,
            SearchFilters,
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
                form: {
                    data: {}
                },
                errors: null,
                currentPanel: "AdvSearch"
            }
        },
        computed: {
            currentPath: function () {
                let title = this.$route.path.replace('/', '');
                const client = this;
              /*
              let formData = {};
              this.$router.push({
                name: _module.$route.name,
                query: formData
              });
              */
              let queryParams = {};
                Object.keys(this.$route.query).forEach(function (prop) {
                    let queryVal = client.$route.query[prop];
                    console.log('prop',prop);
                    console.log('queryVal',queryVal);
                    if (queryVal) {
                        queryParams[prop] = decodeURI(queryVal);
                    }
                });
                console.log('Title ' + title);
                console.log('route ' + this.recordTypes[title.charAt(0).toUpperCase() + title.slice(1)]);

                    // this.currentPath[1].fairsharingRegistry?title=this.currentPath[1].fairsharingRegistry:title=this.currentPath[0];
                    // title=this.currentPath[1].fairsharingRegistry;
                      title = title.charAt(0).toUpperCase() + title.slice(1);
                    //IT IS SEARCH PAGE NOT THE RECORDTYPE ONES
                    console.log('title else ' + title);

              console.log('queryParam ', queryParams);
              return [
                    title,
                    queryParams
                ];
            },
        },
        watch: {
            currentPath: async function () {
                await this.getData();
            }
        },
        mounted: function () {
            this.$nextTick(async function () {
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
            /** This methods get the data from the client.
             * @returns {Promise}
             */
            getData: async function () {
                window.scrollTo(0, 0);
                this.errors = null;

                try {
                    console.log('getParameters', this.getParameters());
                    console.log('currentPath', this.currentPath);
                    await this.fetchRecords(this.getParameters());
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
        }
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
