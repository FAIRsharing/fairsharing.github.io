<template>
  <v-card>
    <v-card-title class="primary white--text">
      Maintenance Requests ({{ records.length }})
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
              <v-card-text class="pb-0 px-4">
                <v-divider class="py-0 mb-2 mt-0" />
                <DOIField :doi="record.doi" />
                <StatusPills :status="record.status"/>
                <div
                  v-if="record.createdAt"
                  class="mt-2"
                >
                  <div>
                    <v-avatar size="40">
                      <v-icon> fa-edit </v-icon>
                    </v-avatar>
                    <b class="mr-1"> Create at </b> {{ record.createdAt }}
                  </div>
                </div>
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
    import { orderBy } from 'lodash'
    import CardTitle from "./CardTitle";
    import CardActions from "./CardActions";
    import DOIField from "./DOIField";
    import StatusPills from "./StatusPills";

    export default {
        name: "MaintenanceRequests",
        components: {StatusPills, DOIField, CardActions, CardTitle},
        computed: {
            ...mapState('users', ['user']),
            records(){
                let output = [];
                this.user().records.maintenanceRequests.forEach(function(record){
                    output.push({
                        ...record["fairsharingRecord"],
                        createdAt: record.createdAt,
                        status: record.status
                    })
                });
                let ordered = orderBy(output, 'status');
                output = Object.keys(ordered).map(k => ordered[k]);
                return output;
            }
        }
    }
</script>

<style scoped>
</style>
