<template>
    <div class="outputTable">
        <h1>{{currentPath}}</h1>
        <output-table>
        </output-table>
    </div>
</template>

<script>
    import OutputTable from './SearchOutputTable'

    /**
     This module receives data from the client and display the data on the page
     * @vue-data {Boolean} valid_request - is the current request valid or not (check before triggering the client)
     * @vue-computed {String} currentPath - return the current path
     */
    export default {
        name: "Records",
        data: function(){
            return {
                valid_request: this.is_request_valid("none")
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
            /** Verify that the input request is valid
             * @param {String} request_body
             * @returns {boolean} is valid or not
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