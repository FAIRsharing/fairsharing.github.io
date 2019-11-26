<template>
    <div class="outputTable">
        <h1>{{currentPath}}</h1>
        <output-table>
        </output-table>
    </div>
</template>

<script>
    import OutputTable from './SearchOutputTable'

    // This component gets the request, sends it to a service,
    // the data from it and sends it to a child component OutputTable
    // or OutputGrid (to be added)
    export default {
        name: "Records",
        data: function(){
              return {
                  valid_request: this.is_request_valid()
              }
        },
        computed: {
            // @vuese
            // Gets the current path of the page to detect Standards, Databases, Polices or Collections
            currentPath: function(){
                return this.$route.path.replace('/', '');
            }
        },
        components: {
            OutputTable
        },
        methods: {
            // @vuese
            // Used to check if the request is valid
            // @arg The argument is a request data body
            is_request_valid(request_body){
                if (request_body) return true;
                return false;
            }
        }
    }
</script>

<style scoped>

</style>