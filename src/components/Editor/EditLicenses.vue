<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card id="editLicenses">
    <v-card-text />
    <v-card-text>
      <v-autocomplete
        v-model="currentRecord['fairsharingRecord'].licences"
        :items="licences"
        item-text="name"
        item-value="id"
        multiple
        outlined
        return-object
        label="Add or remove licences"
      >
        <!-- autocomplete selected -->
        <template v-slot:selection="data">
          <v-chip
            color="blue"
            text-color="white"
            close
            @click:close="removeItem(data.item)"
          >
            {{ data.item.name }}
          </v-chip>
        </template>
      </v-autocomplete>
    </v-card-text>
    <v-card-actions>
      <v-btn
        disabled
        class="primary"
        @click="submitRecord"
      >
        Submit Licences
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
    import { mapState } from "vuex"
    import licenceQuery from "@/components/GraphClient/queries/getLicences.json"
    import GraphClient from "@/components/GraphClient/GraphClient.js"
    import RESTClient from "@/components/Client/RESTClient.js"

    let graphClient = new GraphClient();
    let restClient = new RESTClient();

    export default {
        name: "EditLicenses",
        data(){
            return {
              licences: [],
              newLicence: {
                name: "",
                url: ""
              }
            }
        },
        computed: {
          ...mapState("record", ["currentRecord"])
        },
        mounted(){
          this.$nextTick(async function () {
            this.licences = await this.getLicences();
          })
        },
        methods: {
          getLicences: async function(){
            let licences = await graphClient.executeQuery(licenceQuery);
            return licences['searchLicences']
          },
          createNewLicence: async function(){
            console.log(this.newLicence)
          },
          removeItem: function(item){
            this.currentRecord['fairsharingRecord'].licences = this.currentRecord['fairsharingRecord'].licences.filter(obj => obj.name !== item.name);
          },
          submitRecord: async function(){
            let record = {
              id: 'id',
              token: 'token',
              record: {
                licences: this.currentRecord['fairsharingRecord'].licences
              }
            };
            console.log(record);
            console.log(restClient);
          }
        }
    }
</script>

<style scoped>

</style>
