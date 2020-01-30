<template>
  <div
    v-if="content"
    :id="content['fairsharingRecord'].id"
    class="standard"
  >
    <h2>{{ content['fairsharingRecord'].name }}</h2>
    <p>ID: {{ currentRoute }}</p>
    <div class="card">
      <div
        v-for="(field, label, index) in content['fairsharingRecord']"
        :key="index"
      >
        <b>{{ label }}: </b> {{ field }}
      </div>
    </div>
    <div class="card">
      <div
        v-for="(field, label, index) in domains"
        :key="index"
      >
        <b>{{ label }}: </b> {{ field }}
      </div>
    </div>

    <script
      type="application/json+ld"
    >
      {{ getJSONLD() }}
    </script>
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
                content: null,
                domains: null
            }
        },
        computed: {
            currentRoute: function () {
                return this.$route.params['id']
            },
        },
        mounted: function () {
            this.$nextTick(async function () {
                this.client = new Client();
                await this.getData();
            })
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
                this.content = await this.client.executeQuery(searchRecords);
            },
            getJSONLD: function(){
                const data = this.content["fairsharingRecord"];
                let output = {
                    "@context": "http://schema.org",
                    "@type": "Dataset",
                    "@id": "https://doi.org/10.25504/" + data['doi'],
                    alternateName: data['abbreviation'],
                    description: "This FAIRsharing record describes: " + data.description,
                    identifier: "10.25504/" + data['doi'],
                    name: "FAIRsharing record for " + data.name,
                    url: "https://doi.org/10.25504/" + data['doi'],
                    citation: [
                        {
                            "@type": "CreativeWork",
                            identifier: "https://doi.org/10.25504/" + data['doi'],
                            name: "Citing FAIRsharing record for " + data.name
                        }
                    ]
                };
                if (data["licenses"].length > 0){
                    const license = data["licenses"][0];
                    output.licences = {
                        "@type": "CreativeWork",
                        name: license.name,
                        url: license.url
                    };
                }
                return output;
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
    }
</script>

<style scoped>

</style>