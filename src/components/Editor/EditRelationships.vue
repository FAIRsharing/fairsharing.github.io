<template>
  <v-card id="editRelationships">
    <v-card-title>
      Edit Relationships
    </v-card-title>

    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="records"
        :items-per-page="10"
        :loading="!loaded"
      />
    </v-card-text>

  </v-card>
</template>

<script>
    import { mapState } from "vuex";
    import recordQuery from "@/components/GraphClient/queries/getAllRecords.json";
    import graphClient from "@/components/GraphClient/GraphClient.js";

    const client = new graphClient();

    export default {
        name: "EditRelationships",
        data(){
          return {
            headers: [
              {
                text: 'Record Name',
                align: 'start',
                sortable: true,
                value: 'name',
              },
              {
                text: 'Registry',
                value: 'registry'
              },
            ],
            loaded: false,
            records: []
          }
        },
        computed: {
          ...mapState('users', ["user"])
        },
        async mounted(){
          await this.$nextTick(async function () {
            let _module = this;
            await _module.getRecords();
            _module.loaded = true;
          })
        },
        methods: {
          async getRecords(){
            const _module = this;
            client.login(_module.user().credentials.token);
            const records = await client.executeQuery(recordQuery);
            _module.records = records['allFairsharingRecords'];
          }
        }
    }

    /* What we need:
    1. the user jwt_token --- OK
    2. the json query ---
    3. the graphQL
    4. for later: the rest client

  */
</script>

<style scoped>

</style>
