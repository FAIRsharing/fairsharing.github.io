<template>
    <div class="outputGrid" v-if="client">
        <h1>{{currentPath}}</h1>
        <form>
            <input type="text" v-model="searchString">
            <button type="button" @click="getData()">Search</button>
        </form>
        <output-grid :input_data="content"></output-grid>
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
            }
        },
        components: {
            OutputGrid
        },
        methods: {
            /** This methods get the data from the client depending on the current page.
             * @returns {Promise}
             */
            getData: async function () {
                if (this.client){
                    // This is data coming from the JSON query
                    if (!searchRecords.hasOwnProperty("queryParam") || searchRecords.queryParam === null){
                        searchRecords.queryParam = {};
                    }
                    searchRecords.pagination = this.pagination;
                    searchRecords.queryParam['fairsharingRegistry'] =
                        "\"" + this.recordTypes[this.currentPath] + "\"";
                    if (this.searchString !== ""){
                        searchRecords.queryParam['q'] = `"${this.searchString}"`;
                    }
                    else {
                        delete searchRecords.queryParam['q'];
                    }
                    let content = await this.client.executeQuery(searchRecords);
                    this.content = content['searchFairsharingRecords']['records'];
                    return content;
                }
            }
        },
        mounted: function () {
            this.$nextTick(async function () {
                this.client = new Client();
                await this.getData();
            })
        },
        watch: {
            currentPath: async function (){
                await this.getData();
            }
        }
    }

</script>

<style scoped>
</style>