<template>
  <div
    v-if="client"
    class="outputGrid container-fluid"
  >
    <h1>{{ currentPath }}</h1>
    <div class="row">
      <search-filters class="col-3" :filters="filters" />
      <output-grid class="col-9" :input-data="content" />
    </div>
  </div>
</template>

<script>
    import OutputGrid from '../../components/Records/SearchOutputGrid'
    import Client from '../../components/Client/Client.js'
    import searchRecords from '../../components/Client/queries/getRecords.json'
    import SearchFilters from "../../components/Records/SearchFilters";

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
                searchString: "",
                filters: {}
            }
        },
        computed: {
            currentPath: function () {
                const title =  this.$route.path.replace('/', '');
                return title.charAt(0).toUpperCase() + title.slice(1);
            },
            currentQueryParameter: function(){
                let client = this;
                let queryParams = {};
                for (let prop in this.$route.query){
                    let queryVal = client.$route.query[prop];
                    queryParams[prop] = decodeURI(queryVal);
                }
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
                  let recordHasRegistry = Object.prototype.hasOwnProperty.call(this.recordTypes, this.currentPath);
                  searchRecords.queryParam = {};
                  if (recordHasRegistry){
                      searchRecords.queryParam['fairsharingRegistry'] =
                          this.recordTypes[this.currentPath];
                  }
                  if (this.searchString !== ""){
                      searchRecords.queryParam['q'] = this.searchString;
                  }
                  else {
                      delete searchRecords.queryParam['q'];
                  }

                  let extraParams = this.currentQueryParameter;
                  for (let param in extraParams){
                      if (extraParams[param] === "true" || extraParams[param] === "false"){
                          searchRecords.queryParam[param] = JSON.parse(extraParams[param]);
                      }
                      else {
                          searchRecords.queryParam[param] = extraParams[param];
                      }
                  }

                  let content = await this.client.executeQuery(searchRecords);
                  if (content instanceof Error){
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
</style>