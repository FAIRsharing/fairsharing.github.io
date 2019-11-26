<template>
    <div class="standard" id="standard_ABA">
        <h2>ABA Adult Mouse Brain</h2>
        <p>ID: {{ currentRoute}}</p>
    </div>
</template>

<script>

    // Component to handle the display of single record.
    export default {
        name: "Record",
        id: 'ABA',
        computed: {
            // @vuese
            // Gets the current route to detect the identifier of the record
            currentRoute: function () {
                return this.$route.params['id']
            },
        },
        methods: {
            // @vuese
            // Method to build and return the page title to be included as a metadata
            getTitle: function(){
                return 'FAIRsharing | ' + this.currentRoute
            }
        },
        // @vuese
        // set the meta-data of the page
        metaInfo() {
            return {
                title: this.getTitle()
            }
        }
    }
</script>

<style scoped>

</style>