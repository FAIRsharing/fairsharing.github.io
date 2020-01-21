<template>
    <div class="outputTable">
        <h1>{{currentPath}}</h1>
        {{content}}
        <output-table>
        </output-table>
    </div>
</template>

<script>
    import OutputTable from './SearchOutputTable'
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
                tableHeader: {
                    Registry: "registry",
                    Name: "name",
                    Abbreviation: "abbreviation",
                    Type: "type",
                    Domains: "domains",
                    Subjects: "subjects",
                    Taxonomy: "taxonomies",
                    "Related Database": "recordAssociations  { recordAssocLabel linkedRecord{name registry id} } ",
                    Status: "status"
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
                content: []
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
        methods: {},
        asyncComputed: {
            /** This methods get the data from the client depending on the current page.
             * @returns {Promise}
             */
            async function () {
                let clientModule = this; // The component itself
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