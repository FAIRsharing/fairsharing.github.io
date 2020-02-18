<template>
  <div
    class="outputGrid container-fluid"
  >
    <h1>{{ currentPath[0] }}</h1>

    <div class="chips">
      <FiltersChip></FiltersChip>
    </div>

    <div class="row">
      <!-- Left panel -->
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
      <div
        v-if="!errors"
        class="col-9"
      >
        <output-grid :total-pages="this.$store.state.records.totalPages" />
      </div>
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
    import { mapActions } from 'vuex'
    import OutputGrid from '../../components/Records/SearchOutputGrid'
    import SearchFilters from "../../components/Records/SearchFilters"
    import Facets from "../../components/Records/Facets";
    import FiltersChip from "../../components/Records/FiltersChip";

    /** This component gets the request, sends it to a service, the data from it and sends it to a child component OutputTable or OutputGrid (to be added)
     * @vue-data {Boolean} valid_request - is the request valid before sending to client
     * @vue-computed {String} currentPath - the path of the current page.
     */
    export default {
        name: "Records",
        components: {
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
                content: [],
                buckets: {},
                errors: null,
                currentPanel: "AdvSearch"
            }
        },
        computed: {
            currentPath: function () {
                const title =  this.$route.path.replace('/', '');
                const client = this;
                let queryParams = {};
                Object.keys(this.$route.query).forEach(function(prop){
                    let queryVal = client.$route.query[prop];
                    if (queryVal){
                        queryParams[prop] = decodeURI(queryVal);
                    }
                });
                return [
                    title.charAt(0).toUpperCase() + title.slice(1),
                    queryParams
                ];
            },
        },
        watch: {
            currentPath: async function (){
                await this.getData();
            }
        },
        mounted: function () {
            this.$nextTick(async function () {
                await this.getData();
            })
        },
        beforeDestroy: function(){
            this.$store.dispatch("records/resetFacets").then(function(){});
            this.$store.dispatch("records/resetRecords").then(function(){});
        },
        methods: {
            /** This methods get the data from the client depending on the current page.
             * @returns {Promise}
             */
            getData: async function () {
                  window.scrollTo(0,0);
                  this.content = [];
                  this.errors = null;
                  try {
                    await this.fetchRecords(this.getParameters());
                  }
                  catch(e){
                    this.errors = e.message;
                  }

            },
            getParameters: function(){
                return this.$store.getters["introspection/buildQueryParameters"](this.currentPath);
            },
            ...mapActions('records', ['fetchRecords']),
            setPanel: function(panelName){
              this.currentPanel = panelName;
            }
        }
    }

</script>

<style scoped>
  .error {
    background-color: indianred;
    border:1px solid red;
    padding:20px;
    color:white;
    text-align: left;
    font-size: 18px;
  }
</style>