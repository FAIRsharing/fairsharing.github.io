<template>
    <div class="standard" id="standard_ABA">
        <h2>ABA Adult Mouse Brain</h2>
        <p>ID: {{ currentRoute}}</p>
    </div>
</template>

<script>

    /** Component to handle the display of single record.
     * @vue-computed {String} currentRoute - the route of the current page
     */
    export default {
        name: "Record",
        id: 'ABA',
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
        }
    }
</script>

<style scoped>

</style>