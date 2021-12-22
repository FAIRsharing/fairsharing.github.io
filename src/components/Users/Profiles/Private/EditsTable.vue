<template>
  <div>
    <v-data-table
      class="userProfileEditsTable"
      :items="edits"
      :headers="headers"
      :items-per-page="perPage"
      :footer-props="footer"
      calculate-widths
    >
      <template #[`item.record`]="{ item }">
        <div class="d-flex justify-start align-center">
          <v-avatar size="30">
            <Icon
              :item="item.fairsharingRecord.type"
              :height="30"
              wrapper-class=""
            />
          </v-avatar>
          <div class="mt-1 ml-3 alignLeft">
            {{ item.fairsharingRecord.name | cleanString }}
          </div>
        </div>
      </template>

      <template #[`item.event`]="{ item }">
        <div class="d-flex justify-start align-center">
          <div class="mt-1 ml-3 alignLeft">
            {{ item.editEvent }}
          </div>
        </div>
      </template>

      <template #[`item.type`]="{ item }">
        <div class="d-flex justify-start align-center">
          <div class="mt-1 ml-3 alignLeft">
            {{ item.editType }}
          </div>
        </div>
      </template>

      <template #[`item.date`]="{ item }">
        <div class="d-flex justify-start align-center">
          <div class="mt-1 ml-3 alignLeft">
            {{ moment(item.createdAt) }}
          </div>
        </div>
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
            <v-list-item @click="previewRecord(item.fairsharingRecord.id)">
              <v-list-item-avatar><v-icon>fas fa-eye</v-icon></v-list-item-avatar>
              <v-list-item-content><v-list-item-title> Preview record </v-list-item-title></v-list-item-content>
            </v-list-item>
            <v-list-item @click="goToRecord(item.fairsharingRecord.id)">
              <v-list-item-avatar><v-icon>fas fa-newspaper</v-icon></v-list-item-avatar>
              <v-list-item-content><v-list-item-title> Go to record </v-list-item-title></v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
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
//import StatusPills from "./StatusPills";
import Record from "@/views/Records/Record";
import Icon from "@/components/Icon";
import moment from "moment";

export default {
  name: "EditsTable",
  //components: {Icon, Record, StatusPills},
  components: {Icon, Record},
  mixins: [cleanString],
  props: {
    edits: {type: Array, default: () => []}
  },
  data: () => {
    return {
      showOverlay: false,
      targetID: null
    }
  },
  computed: {
    ...mapState('users', ['user']),
    headers() {
      let headers = [
        {text: 'Record', value: 'record', align: 'center'},
        {text: 'Event', value: 'event', align: 'center'},
        {text: 'Type', value: 'type', align: 'center'},
        {text: 'Date', value: 'date', align: 'center'},
        {text: 'Actions', value: 'actions', align: 'center', sortable: 'false'}
      ];
      return headers;
    },
    noData(){
      return "This user has not edited any records."
    },
    perPage(){
      return 10;
    },
    footer(){
      return {'items-per-page-options': [10]}
    },
  },
  methods: {
    moment (date) {
      return moment(date).format('dddd, MMMM Do YYYY, H:mm');
    },
    previewRecord(id) {
      this.targetID = id;
      this.showOverlay = true;
    },
    goToRecord(id) {
      window.open("/" + id, '_blank');
    },
    hideOverlay(){
      this.showOverlay = false;
      this.targetID = null;
    }
  }
}
</script>

<style scoped>
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