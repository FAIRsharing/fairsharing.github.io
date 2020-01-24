<template>
    <div class="outputTable" v-if="client">
        <h1>{{currentPath}}</h1>

        <div class="introspectionQuery container-fluid hidden">
            <div class="row">
                <div class="col-3"
                     v-for="(type, index) in queryTypes"
                     :key="index">
                    <div class="card">
                        <div class="card-header">
                            <h2>{{type.name}}</h2>
                        </div>
                        <ul>
                            <li v-for="(field, subindex) in type.fields" :key="subindex">
                                <b>{{field.name}}:</b> {{field.type}}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>


        <form>
            <input type="text" v-model="searchString">
        </form>

        <output-table :input_data="content" :headers="tableHeader">
        </output-table>

    </div>
</template>

<script>
    import OutputTable from '../../components/Search/SearchOutputTable'
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
                tableHeader: {
                    Registry: "type",
                    Name: "name",
                    Abbreviation: "abbreviation",
                    Type: "registry",
                    Domains: "domains",
                    Subjects: "subjects",
                    Taxonomy: "taxonomies",
                    Relationships: {
                        fieldTarget: ["linkedRecord"],
                        linkedRecord: ["name", "id", "registry"],
                        field: "recordAssociations",
                        sorting: "registry"
                    },
                    Status: "status",
                },
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
                return this.$route.path.replace('/', '').capitalize();
            },
            queryTypes: function(){
                return this.client.introspection.all['__schema'].types.filter(function(u){
                    return u.fields
                })
            }
        },
        components: {
            OutputTable
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
                    searchRecords.queryParam['fairsharingRegistry'] =
                        `"${this.recordTypes[this.currentPath]}"`;
                    searchRecords.queryParam['q'] = `"${this.searchString}"`;
                    await this.client.executeQuery(searchRecords, true);

                    // this is the OLD method but still active ATM
                    let clientModule = this; // The component itself
                    let content = await this.client.getRecordsOfType(
                        clientModule.pagination,
                        clientModule.recordTypes[clientModule.currentPath],
                        clientModule.tableHeader
                    );
                    clientModule.content = content.records;
                    return content;
                }
            }
        },
        mounted: function () {
            this.$nextTick(async function () {
                this.client = await new Client();
                await this.getData();
            })
        },
        watch: {
            currentPath: async function (){
                await this.getData();
            },
            searchString: async function(){
                await this.getData();
            }
        }
    }

</script>

<style scoped>

    .hidden {
        display:none;
    }

</style>