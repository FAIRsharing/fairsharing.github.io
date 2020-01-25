<template>
    <div class="standard" :id="content['fairsharingRecord'].id" v-if="content">
        <h2>{{content['fairsharingRecord'].name}}</h2>
        <p>ID: {{ currentRoute}}</p>
        <div class="card">
            <div v-for="(field, label, index) in content['fairsharingRecord']" :key="index">
                <b>{{label}}: </b> {{field}}
            </div>
        </div>

    </div>
</template>

<script>
    import Client from '../../components/Client/Client.js'
    import searchRecords from '../../components/Client/queries/getRecord.json'

    /** Component to handle the display of single record.
     * @vue-computed {String} currentRoute - the route of the current page
     */
    export default {
        name: "Record",
        data() {
            return {
                content: null
            }
        },
        computed: {
            currentRoute: function () {
                return this.$route.params['id']
            },
        },
        methods: {
            /** Method to build and return the page title to be included as a metadata
             *  @returns {String} - the title of the current page
             */
            getTitle: function(){
                return 'FAIRsharing | ' + this.currentRoute
            },
            getData: async function(){
                searchRecords.queryParam["id"] = this.currentRoute;
                let data = await this.client.executeQuery(searchRecords);
                this.content = data;
            }
        },
        /**
         * Setting up the metaInfo of the page
         * @returns {{title: String}}
         * */
        metaInfo() {
            return {
                title: this.getTitle()
            }
        },
        mounted: function () {
            this.$nextTick(async function () {
                this.client = await new Client();
                await this.getData();
            })
        },
    }
</script>

<style scoped>

</style>