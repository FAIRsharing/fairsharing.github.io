<template>
    <div class="outputTable">
        <h1>{{currentPath}}</h1>
        <output-table :input_data="content" :headers="tableHeader">
        </output-table>
        <div class="card">
            <div class="card-header">Allowed fields</div>
            <div class="card-body">
                {{fields}}
            </div>
        </div>
    </div>
</template>

<script>
    import OutputTable from '../../components/Search/SearchOutputTable'
    import Client from '../../components/Client/Client.js'

    let client = new Client();

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
                    "Related Database": "recordAssociations{linkedRecord{name id}}",
                    Relationships: {
                        query: "recordAssociations{linkedRecord{name id}}",
                        sorting: "registry",
                        labels: [
                            "Related Databases",
                            "Related Standards",
                            "Related Policies",
                            "Related Collections/Recommendations",
                        ]
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
                fields: []
            }
        },
        computed: {
            currentPath: function () {
                return this.$route.path.replace('/', '').capitalize();
            }
        },
        components: {
            OutputTable
        },
        asyncComputed: {
            /** This methods get the data from the client depending on the current page.
             * @returns {Promise}
             */
            async function () {
                let clientModule = this; // The component itself
                clientModule.fields = await client.introspectQuery("FairsharingRecord");
                let content = await client.getRecordsOfType(clientModule.pagination,
                                                            clientModule.recordTypes[clientModule.currentPath],
                                                            clientModule.tableHeader);
                clientModule.content = content.records;
                return content;
            }
        }
    }

</script>

<style scoped>

</style>