<template>
    <div class="home container-fluid" id="homePage">
        <div class="card">
            <div class="card-header">
                <h2>Fairsharing records</h2>
            </div>
            <div class="card-body">
                <table class="table table-striped table-hover">
                    <thead></thead>
                    <tbody>
                        <tr v-for="(record, index) in records" :key="'record_' + index">
                            <td v-for="(field, fieldIndex) in record" :key="'field_' + fieldIndex">
                                {{field}}
                            </td>
                        </tr>
                    </tbody>

                    <tbody>
                    <tr v-for="(record, index) in databases" :key="'record_' + index">
                        <td v-for="(field, fieldIndex) in record" :key="'field_' + fieldIndex">
                            {{field}}
                        </td>
                    </tr>
                    </tbody>

                </table>


                <form>
                    <select v-model="pagination.perPage">
                        <option value="1">1</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                    </select>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    /** Component to handle the front page (landing page)
     *
     */

    import Client from '../../components/Client/Client.js'
    let client = new Client();

    let myVue = {
        name: "Home",
        data(){
            return {
                records: [],
                databases: [],
                pagination: {
                    page: 1,
                    perPage: 30
                }
            }
        },
        asyncComputed: {
            async function(){
                let clientModule = this;
                let standard = await client.getRecordsOfType(clientModule.pagination, "Standard");
                clientModule.records = standard.records;
                let databases = await client.getRecordsOfType(clientModule.pagination, "Database");
                clientModule.databases = databases.records
            }
        }
    };

    export default myVue;
</script>

<style scoped>

</style>