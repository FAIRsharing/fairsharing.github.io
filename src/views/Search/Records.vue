<template>
  <div
    v-if="client"
    class="outputGrid"
  >
    <h1>{{ currentPath }}</h1>
    <form>
      <input
        v-model="searchString"
        type="text"
      >
      <button
        type="button"
        @click="getData()"
      >
        Search
      </button>
    </form>
    <output-grid :input-data="content" />
  </div>
</template>

<script>
    import OutputGrid from '../../components/Search/SearchOutputGrid'
    import Client from '../../components/Client/Client.js'
    import searchRecords from '../../components/Client/queries/getRecords.json'

    /** This component gets the request, sends it to a service, the data from it and sends it to a child component OutputTable or OutputGrid (to be added)
     * @vue-data {Boolean} valid_request - is the request valid before sending to client
     * @vue-computed {String} currentPath - the path of the current page.
     *
     */
    export default {
        name: "Records",
        components: {
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
                pagination: {
                    page: 1,
                    perPage: 30
                },
                content: [],
                client: null,
                searchString: ""
            }
        },
        computed: {
            currentPath: function () {
                const title =  this.$route.path.replace('/', '');
                return title.charAt(0).toUpperCase() + title.slice(1);
            },
            currentQueryParameter: function(){
                return this.$route.query;
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
                  // This is data coming from the JSON query
                  //let recordHasProperty = Object.prototype.hasOwnProperty.call(searchRecords, "queryParam");
                  searchRecords.queryParam = {};
                  searchRecords.pagination = this.pagination;
                  searchRecords.queryParam['fairsharingRegistry'] =
                      this.recordTypes[this.currentPath];
                  if (this.searchString !== ""){
                      searchRecords.queryParam['q'] = `"${this.searchString}"`;
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
                  console.log(this.content);
                  this.content = content['searchFairsharingRecords']['records'];
                  return content;
            }
        }
    }

</script>

<style scoped>
</style>