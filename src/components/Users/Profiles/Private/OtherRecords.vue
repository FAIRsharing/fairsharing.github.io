<template>
  <v-card>
    <v-card-title class="primary white--text">
      {{ name }} ({{ records.length }})
    </v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-row v-if="records.length > 0">
          <v-col
            v-for="(record, index) in records"
            :key="'recordCol_'+index"
            cols="12"
            xl="3"
            md="6"
          >
            <v-card height="100%">
              <CardTitle
                :icon="record.type"
                :name="record.name"
              />
              <v-card-text class="">
                <v-divider class="py-0 mb-2 mt-0" />
                <DOIField :doi="record.doi" />
                <StatusPills :approved="record['isApproved']" />
              </v-card-text>
              <CardActions :id="record.id" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
    import { mapState } from "vuex"
    import CardTitle from "./CardTitle";
    import CardActions from "./CardActions";
    import DOIField from "./DOIField";
    import StatusPills from "./StatusPills";

    export default {
        name: "OtherRecords",
        components: {DOIField, CardActions, CardTitle, StatusPills},
        props: {
          recordsType: {type: String, default: null}
        },
        computed: {
            ...mapState('users', ['user']),
            records(){
              return this.user().records[this.recordsType];
            },
            name() {
              return {
                maintenanceRequests: "Maintenance Requests",
                createdRecords: "Created Records",
                maintainedRecords: "Maintained Records",
                watchedRecords: "Watched Records",
                recordsInCuration: "Records In Curation"
              }[this.recordsType];
            }
        }
    }
</script>

<style scoped>

</style>
