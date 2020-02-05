<template>
  <div
    v-if="client"
    class="outputGrid container-fluid"
  >
    <h1>{{ currentPath }}</h1>
    <div class="row">
      <search-filters class="col-3" />
      <div
        v-if="!errors"
        class="col-9"
      >
        <output-grid
          :input-data="content"
        />
      </div>
      <div v-else class="col-9">
        <div class="error">{{ errors }}</div>
      </div>
    </div>
  </div>
</template>

<script>
    import OutputGrid from '../../components/Records/SearchOutputGrid'
    import Client from '../../components/GraphClient/GraphClient.js'
    import recordsQuery from '../../components/GraphClient/queries/getRecords.json'
    import SearchFilters from "../../components/Records/SearchFilters"

    /** This component gets the request, sends it to a service, the data from it and sends it to a child component OutputTable or OutputGrid (to be added)
     * @vue-data {Boolean} valid_request - is the request valid before sending to client
     * @vue-computed {String} currentPath - the path of the current page.
     *
     */
    export default {
        name: "Records",
        components: {
          SearchFilters,
            OutputGrid
        },
        data() {
            return {
                /* Be careful, in the current system registry and type are reversed, which is why we have registry bound
                to type and type bound to registry in the above object.
                */
                recordTypes: {
                    Standards: "Standard",
                    Databases: "Database",
                    Policies: "Policy",
                    Collections: "Collection"
                },
                content: [],
                client: null,
                filters: {},
                errors: null
            }
        },
        computed: {
            currentPath: function () {
                const title =  this.$route.path.replace('/', '');
                return title.charAt(0).toUpperCase() + title.slice(1);
            },
            currentQueryParameter: function(){
                const client = this;
                let queryParams = {};
                Object.keys(this.$route.query).forEach(function(prop){
                  let queryVal = client.$route.query[prop];
                  if (queryVal){
                    queryParams[prop] = decodeURI(queryVal);
                  }
                });
                return queryParams;
            }
        },
        watch: {
            currentPath: async function (){
                await this.getData();
            },
            currentQueryParameter: async function(){
                await this.getData();
            }
        },
        mounted: function () {
            this.$nextTick(async function () {
                this.client = new Client();
                await this.getData();
            })
        },
        methods: {
            /** This methods get the data from the client depending on the current page.
             * @returns {Promise}
             */
            getData: async function () {
                  window.scrollTo(0,0);
                  this.content = [];
                  recordsQuery.queryParam = {};
                  this.errors = null;

                  // Check if the current route correspond to a registry
                  if (Object.prototype.hasOwnProperty.call(this.recordTypes, this.currentPath)){
                      recordsQuery.queryParam['fairsharingRegistry'] =
                          this.recordTypes[this.currentPath];
                  }

                  // get the parameters from the URL and add them to the query object
                  // with the correct type (string, int, array, bool)
                  let queryParameters = this.currentQueryParameter;
                  Object.keys(queryParameters).forEach(function(param){
                    // Bool
                    if (queryParameters[param] === "true" || queryParameters[param] === "false"){
                      recordsQuery.queryParam[param] = JSON.parse(queryParameters[param]);
                    }
                    // Int
                    else if (!isNaN(parseFloat(queryParameters[param]))) {
                      recordsQuery.queryParam[param] = parseFloat(queryParameters[param]);
                    }
                    // Array
                    else if (queryParameters[param][0] === "[" && queryParameters[param][queryParameters[param].length -1] === "]"){
                      recordsQuery.queryParam[param] = queryParameters[param].replace("[","").replace("]","").split(",");
                    }
                    // String
                    else{
                      recordsQuery.queryParam[param] = queryParameters[param];
                    }
                  });

                  // Reset the query param to null if no key were added
                  if (Object.keys(recordsQuery.queryParam).length === 0){
                      recordsQuery.queryParam = null
                  }

                  // Trigger the query
                  let content = await this.client.executeQuery(recordsQuery);
                  if (content instanceof Error){
                      this.errors = content;
                      throw content;
                  }
                  this.content = content['searchFairsharingRecords']['records'];
                  this.filters = content["searchFairsharingRecords"]["aggregations"];
                  return content;
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