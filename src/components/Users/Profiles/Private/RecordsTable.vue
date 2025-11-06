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
            <Icon :item="item.type" :height="30" wrapper-class="" />
          </v-avatar>
          <div class="mt-1 ml-3 alignLeft">
            {{ $filters.cleanString(item.name) }}
          </div>
        </div>
      </template>
      <template #[`item.type`]="{ item }">
        {{ $filters.cleanString(item.type) }}
      </template>
      <template #[`item.isApproved`]="{ item }">
        <StatusPills
          class="d-flex justify-center"
          :approved="item['isApproved']"
          :small="false"
        />
      </template>
      <template #[`item.status`]="{ item }">
        <StatusPills
          class="d-flex justify-center"
          :status="item.status"
          :small="false"
        />
      </template>
      <template #[`item.actions`]="{ item }">
        <v-menu>
          <template #activator="{ props }">
            <v-icon v-bind="props"> fas fa-ellipsis-v </v-icon>
          </template>
          <v-list>
            <v-list-item @click="previewRecord(item.id)">
              <template #prepend>
                <v-icon>fas fa-eye</v-icon>
              </template>
              <v-list-item-title> Preview record </v-list-item-title>
            </v-list-item>
            <v-list-item @click="goToRecord(item.id)">
              <template #prepend>
                <v-icon>fas fa-newspaper</v-icon>
              </template>
              <v-list-item-title> Go to record </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                (source !== 'maintenanceRequests' &&
                  source !== 'watchedRecords') ||
                (source === 'watchedRecords' && user().is_curator)
              "
              @click="goToEdit(item.id)"
            >
              <template #prepend>
                <v-icon>fas fa-pen</v-icon>
              </template>
              <v-list-item-title> Edit record </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template #no-data>
        <div>
          {{ noData }}
          <router-link v-if="source === 'createdRecords'" to="/new">
            here.
          </router-link>
        </div>
      </template>
    </v-data-table>

    <!-- PREVIEW RECORD -->
    <v-dialog v-model="showOverlay">
      <v-btn
        v-if="closeButton"
        class="text-black absolute"
        icon="fa fa-xmark fa-solid"
        @click="hideOverlay()"
      >
        <v-icon size="30" />
      </v-btn>
      <v-card>
        <Record :target="targetID" @show-dialog="showDialog" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";

import Icon from "@/components/Icon";
import Record from "@/views/Records/Record";

import StatusPills from "./StatusPills";

export default {
  name: "RecordsTable",
  components: { Icon, Record, StatusPills },
  props: {
    records: { type: Array, default: () => [] },
    source: { type: String, default: null },
  },
  data: () => {
    return {
      showOverlay: false,
      targetID: null,
      closeButton: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    headers() {
      let headers = [
        { title: "Name", value: "name", align: "center" },
        { title: "Registry", value: "type", align: "center" },
      ];
      if (
        this.source !== "maintenanceRequests" &&
        this.source !== "watchedRecords"
      ) {
        headers.push({
          title: "Approved",
          value: "isApproved",
          align: "center",
        });
      }
      else if (this.source === "maintenanceRequests") {
        headers.push({ title: "Status", value: "status", align: "center" });
      }
      headers.push({
        title: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
      });
      return headers;
    },
    noData() {
      return {
        maintenanceRequests: "You do not have any maintenance requests.",
        createdRecords:
          "You did not create any record yet. Start creating one ",
        maintainedRecords: "You do not maintain any records.",
        publicMaintainedRecords: "This user does not maintain any records.",
        watchedRecords: "You are not watching any record.",
      }[this.source];
    },
    perPage() {
      if (this.source === "watchedRecords") return 7;
      return 5;
    },
    footer() {
      if (this.source === "watchedRecords")
        return { "items-per-page-options": [7] };
      return { "items-per-page-options": [5] };
    },
  },
  methods: {
    goToEdit(id) {
      this.$router.push({ path: `/${id}/edit` });
    },
    previewRecord(id) {
      this.targetID = id;
      this.showOverlay = true;
    },
    goToRecord(id) {
      window.open("/" + id, "_blank");
    },
    hideOverlay() {
      this.showOverlay = false;
      this.targetID = null;
      this.closeButton = false;
    },
    showDialog(value) {
      this.closeButton = value;
    },
  },
};
</script>

<style scoped>
.alignLeft {
  text-align: left !important;
}

.userProfileRecordsTable th {
  min-width: 100px;
}

.absolute {
  position: absolute !important;
  z-index: 1;
  right: -13px;
  top: -10px;
}
</style>
