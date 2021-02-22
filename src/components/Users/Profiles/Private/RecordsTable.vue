<template>
  <div>
    <v-data-table
      class="userProfileRecordsTable"
      :items="records"
      :headers="headers"
      :items-per-page="perPage"
      :footer-props="footer"
      calculate-widths
    >
      <template #[`item.name`]="{ item }">
        <div class="d-flex justify-start align-center">
          <v-avatar size="30">
            <v-img :src="icons()[item.type]" />
          </v-avatar>
          <div class="mt-1 ml-3 alignLeft">
            {{ item.name | cleanString }}
          </div>
        </div>
      </template>
      <template #[`item.type`]="{ item }">
        {{ item.type | cleanString }}
      </template>
      <template #[`item.isApproved`]="{ item }">
        <StatusPills
          class="d-flex justify-center"
          :approved="item['isApproved']"
          :small="true"
        />
      </template>
      <template #[`item.status`]="{ item }">
        <StatusPills
          class="d-flex justify-center"
          :status="item.status"
          :small="true"
        />
      </template>
      <template #[`item.actions`]="{ item }">
        <v-menu offset-x>
          <template #activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
            >
              fas fa-ellipsis-v
            </v-icon>
          </template>
          <v-list>
            <v-list-item @click="previewRecord(item.id)">
              <v-list-item-avatar><v-icon>fas fa-eye</v-icon></v-list-item-avatar>
              <v-list-item-content><v-lis-item-title> Preview record </v-lis-item-title></v-list-item-content>
            </v-list-item>
            <v-list-item
              v-if="(source !== 'maintenanceRequests' && source !== 'watchedRecords') || (source === 'watchedRecords' && user().is_curator)"
              @click="goToEdit(item.id)"
            >
              <v-list-item-avatar><v-icon>fas fa-pen</v-icon></v-list-item-avatar>
              <v-list-item-content><v-lis-item-title> Edit record </v-lis-item-title></v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template slot="no-data">
        <div>
          {{ noData }}
          <router-link
            v-if="source === 'createdRecords'"
            to="/new"
          >
            here.
          </router-link>
        </div>
      </template>
    </v-data-table>

    <!-- PREVIEW RECORD -->
    <v-dialog v-model="showOverlay">
      <v-btn
        fab
        small
        class="grey--text absolute"
        @click="hideOverlay()"
      >
        <v-icon>fa-times</v-icon>
      </v-btn>

      <v-card>
        <Record :target="targetID" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    import { mapState } from "vuex"
    import { cleanString } from "@/utils/stringUtils"
    import StatusPills from "./StatusPills";
    import Record from "@/views/Records/Record";

    export default {
        name: "RecordsTable",
        components: {Record, StatusPills},
        mixins: [cleanString],
        props: {
            records: { type: Array, default: null },
            source: { type: String, default: null }
        },
        data: () => {
            return {
                showOverlay: false,
                targetID: null
            }
        },
        computed: {
            ...mapState('editor', ['icons']),
            ...mapState('users', ['user']),
            headers(){
                let headers = [
                    {text: 'Name', value: 'name', align: 'center'},
                    {text: 'Registry', value: 'type', align: 'center'}
                ];
                if (this.source !== 'maintenanceRequests' && this.source !== 'watchedRecords'){
                  headers.push({text: 'Approved', value: 'isApproved', align: 'center'});
                }
                else if (this.source === 'maintenanceRequests') {
                  headers.push({text: 'Status', value: 'status', align: 'center'});
                }
                headers.push({text: 'Actions', value: 'actions', align: 'center', sortable: false});
                return headers;
            },
            noData(){
                return {
                    maintenanceRequests: "You do not have any maintenance requests.",
                    createdRecords: "You did not create any record yet. Start creating one ",
                    maintainedRecords: "You do not maintain any records.",
                    watchedRecords: "You are not watching any record"
                }[this.source];
            },
            perPage(){
              if (this.source === 'watchedRecords') return 7;
              return 5
            },
            footer(){
              if (this.source === 'watchedRecords') return {'items-per-page-options': [7]};
              return {'items-per-page-options': [5]}
            }
        },
        methods: {
            goToEdit(id){
                this.$router.push({path: `/${id}/edit`})
            },
            previewRecord(id) {
                this.targetID = id;
                this.showOverlay = true;
            },
            hideOverlay(){
                this.showOverlay = false;
                this.targetID = null;
            }
        }
    }
</script>

<style>
  .alignLeft {
    text-align: left !important;
  }

  .userProfileRecordsTable th {
    min-width: 100px
  }

  .absolute {
      position: absolute !important;
      z-index: 1;
      right: 13px;
  }
</style>
