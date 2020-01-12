<template>
    <div class="home container-fluid" id="homePage">
        <div class="card">
            <div class="card-header">
                <h2>Fairsharing records</h2>
            </div>
            <div class="card-body">
                <div class="pagination">
                    {{pagination}}
                </div>
                <table class="table table-striped table-hover">
                    <thead>

                    </thead>
                    <tbody>
                        <tr v-for="(record, index) in records" :key="'record_' + index">
                            <td v-for="(field, fieldIndex) in record" :key="'field_' + fieldIndex">
                                {{field}}
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                pagination: {}
            }
        },
        methods: {
            getData: async function() {
                const pagination = "(page:1, perPage:10)";
                let data = await client.getRecordsList(pagination);
                this.records = data.records;
                this.pagination = {
                    currentPage: data.currentPage,
                    totalPage: data.totalPages,
                    perPage: data.perPage,
                    totalCount: data.totalCount,
                    firstPage: data.firstPage
                };
                return data;
            }
        },
        created() {
            this.getData()
        }
    };

    export default myVue;
</script>

<style scoped>

</style>