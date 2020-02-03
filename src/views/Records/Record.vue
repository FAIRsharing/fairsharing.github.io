<template>
  <div
    v-if="content"
    class="standard"
  >
    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>

    <div v-if="!error && queryTriggered">
      <span>{{ content['fairsharingRecord'].name }}</span>
      <p>ID: {{ currentRoute }}</p>
      <div class="card">
        <div
          v-for="(field, label, index) in content['fairsharingRecord']"
          :key="index"
        >
          <b>{{ label }}: </b> {{ field }}
        </div>
      </div>

      <script
        type="application/ld+json"
      >
        {{ getJSONLD() }}
      </script>
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
                content: null,
                error: null,
                queryTriggered: false
            }
        },
        computed: {
            currentRoute: function () {
                return this.$route.params['id']
            },
        },
        watch: {
            currentRoute: async function () {
                await this.getData();
            }
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
                this.queryTriggered = false;
                this.content = null;
                this.error = null;
                searchRecords.queryParam = {};
                searchRecords.queryParam["id"] = this.currentRoute;
                this.content = await this.client.executeQuery(searchRecords);
                this.queryTriggered = true;
                if (this.content instanceof Error){
                    this.error = this.content.message;
                    return null;
                }

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
                let hasLicense = Object.prototype.hasOwnProperty.call(data, "licences");
                if (hasLicense && data["licences"].length > 0){
                    const license = data["licences"][0];
                    output.license = {
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

  .error {
    background-color: indianred;
    border:1px solid red;
    padding:20px;
    color:white;
    margin:20px;
    text-align: left;
    font-size: 18px;
  }

</style>