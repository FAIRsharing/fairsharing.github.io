<template>
    <div class="outputTable">
        <h1>{{currentPath}}</h1>
        <output-table>
        </output-table>
    </div>
</template>

<script>
    import OutputTable from './SearchOutputTable'

    /** This component gets the request, sends it to a service, the data from it and sends it to a child component OutputTable or OutputGrid (to be added)
     * @vue-data {Boolean} valid_request - is the request valid before sending to client
     * @vue-computed {String} currentPath - the path of the current page.
     *
     */
    export default {
        name: "Records",
        data(){
            return {
                valid_request: this.is_request_valid()
            }
        },
        computed: {
            currentPath: function(){
                return this.$route.path.replace('/', '');
            }
        },
        components: {
            OutputTable
        },
        methods: {
            /**
             * Is the request valid
             * @param {Object} request_body - the request itself
             * @returns {boolean}
             */
            is_request_valid(request_body){
                if (request_body) return true;
                return false;
            }
        }
    }
</script>

<style scoped>

</style>