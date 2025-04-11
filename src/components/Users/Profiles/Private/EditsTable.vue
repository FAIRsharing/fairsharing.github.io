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
      <template #[`item.fairsharingRecord.name`]="{ item }">
        <div class="d-flex justify-start align-center">
          <v-avatar size="30">
            <Icon
              :item="item.fairsharingRecord.type"
              :height="30"
              wrapper-class=""
            />
          </v-avatar>
          <div class="mt-1 ml-3 alignLeft">
            {{ $filters.cleanString(item.fairsharingRecord.name) }}
          </div>
        </div>
      </template>

      <template #[`item.editEvent`]="{ item }">
        <div class="d-flex justify-start align-center">
          <div class="mt-1 ml-3 alignLeft">
            {{ item.editEvent }}
          </div>
        </div>
      </template>

      <template #[`item.editType`]="{ item }">
        <div class="d-flex justify-start align-center">
          <div class="mt-1 ml-3 alignLeft">
            {{ item.editType }}
          </div>
        </div>
      </template>

      <template #[`item.createdAt`]="{ item }">
        <div class="d-flex justify-start align-center">
          <div class="mt-1 ml-3 alignLeft">
            {{ moment(item.createdAt) }}
          </div>
        </div>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-menu>
          <template #activator="{ props }">
            <v-icon
             
              v-bind="props"
            >
              fas fa-ellipsis-v
            </v-icon>
          </template>
          <v-list>
            <v-list-item @click="previewRecord(item.fairsharingRecord.id)">
              <v-avatar><v-icon>fas fa-eye</v-icon></v-avatar>
              <v-list-item-title> Preview record </v-list-item-title>
            </v-list-item>
            <v-list-item @click="goToRecord(item.fairsharingRecord.id)">
              <v-avatar><v-icon>fas fa-newspaper</v-icon></v-avatar>
              <v-list-item-title> Go to record </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template #no-data>
        <v-btn
          class="ma-1 text-white"
          color="orange"
          :disabled="loading"
          @click="loadEditEvents"
        >
          <v-progress-circular
            :size="25"
            :class="'pa-1' + [loading ? 'd-flex' : ' d-none']"
            color="white"
            indeterminate
          />
          <span
            :class="[!loading ? 'd-flex' : ' d-none']"
          >
            Load
          </span>
        </v-btn>
      </template>
    </v-data-table>

    <!-- PREVIEW RECORD -->
    <v-dialog v-model="showOverlay">
      <v-btn
        size="small"
        class="text-grey absolute"
        @click="hideOverlay()"
      >
        <v-icon>fas fa-times</v-icon>
      </v-btn>

      <v-card>
        <Record :target="targetID" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";
import {mapActions, mapState} from "vuex"

import Icon from "@/components/Icon";
//import StatusPills from "./StatusPills";
import Record from "@/views/Records/Record";

export default {
  name: "EditsTable",
  //components: {Icon, Record, StatusPills},
  components: {Icon, Record},
  data: () => {
    return {
      showOverlay: false,
      targetID: null,
      edits: [],
      loading: false
    }
  },
  computed: {
    ...mapState('users', ['user']),
    headers() {
      let headers = [
        {text: 'Record', value: 'fairsharingRecord.name', align: 'center'},
        {text: 'Event', value: 'editEvent', align: 'center'},
        {text: 'Type', value: 'editType', align: 'center'},
        {text: 'Date', value: 'createdAt', align: 'center'},
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
    ...mapActions('users', ['getUserEditEvents']),
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
    },
    async loadEditEvents() {
      this.loading = true;
      // The means of getting a user's ID differs depending on whether this component is active in the
      // public or private profile. I'm checking the route to see which it is.
      let loc = this.$router.currentRoute.path;
      let data;
      let userId;
      if (loc === '/accounts/profile') {
        userId = this.user().id;
      }
      else {
        userId = loc.split('/')[2]
      }
      if (userId) {
        data = await this.getUserEditEvents(userId);
        this.edits = data.user.editEvents;
      }
      // If everything went as planned...
      this.loading = false
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