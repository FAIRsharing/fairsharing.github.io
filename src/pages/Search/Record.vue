<template>
    <div class="standard" id="standard_ABA">
        <h2>ABA Adult Mouse Brain</h2>
        <p>ID: {{ currentRoute}}</p>
    </div>
</template>

<script>
/** This module receives data from the client and display the data on the page
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
            /**
             * Method to return the title of this page to be inserted as metadata
             * @returns {string}
             */
            getTitle: function(){
                return 'FAIRsharing | ' + this.currentRoute
            }
        },
    /**
     *
     * @returns {{title: (*|string)}}
     */
    metaInfo() {
            return {
                title: this.getTitle()
            }
        }
    }
</script>

<style scoped>

</style>