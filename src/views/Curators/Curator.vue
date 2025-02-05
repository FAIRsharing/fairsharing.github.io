<template>
  <v-container
    id="curatorPage"
    fluid
    class="standard"
  >
    <v-row
      v-if="user().role === 'super_curator' || user().role === 'developer'"
    >
      <v-col cols12>
        <v-banner
          v-if="!messages()['getUser'].error"
          color="info"
          lines="one"
          text="white"
          :stacked="false"
          class="white--text mb-2 text-h5"
        >
          Welcome, curator {{ user().credentials.username }}
        </v-banner>
        <!-- least recently updated -->
        <v-card
          v-if="leastRecentlyDeatils"
          class="mb-2"
        >
          <v-card-text>
            The record least recently updated is:
            <a :href="getHostname() + leastRecentlyDeatils.id">
              {{ leastRecentlyDeatils.name }}
            </a>
            ({{ leastRecentlyDeatils.updatedAt }})
          </v-card-text>
        </v-card>
        <!--Tabs-->
        <v-tabs
          v-model="selectedTab"
          dark
          slider-color="primary"
          slider-size="5"
          show-arrows
        >
          <v-tab
            v-for="tab in tabs"
            :key="'tab_' + tab.name"
          >
            <div>{{ tab.name }}</div>
          </v-tab>
          <v-tabs-items v-model="selectedTab">
            <v-tab-item
              v-for="(tab, tabIndex) in tabs"
              :key="tab + '_' + tabIndex"
              class="px-1 py-3"
            >
              <component
                :is="tab.component"
                :header-items="tab.headers"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols12>
        <Unauthorized />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

import {
  DownloadRecords,
  HiddenRecords,
  MaintenanceRequests,
  RecentCuratorCreation,
  RecordsAwaitingApproval,
  SystemMessages
} from "@/components/Curators"
import Icon from "@/components/Icon";
import headersTables from "@/data/headersCuratorDashboard.json";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getLeastRecentlyUpdated from "@/lib/GraphClient/queries/curators/getLeastRecentlyUpdated.json";
import getHostname from "@/utils/generalUtils";
import Unauthorized from "@/views/Errors/403.vue";

const client = new GraphClient();

export default {
  name: "Curator",
  components: {
    Unauthorized,
    RecordsAwaitingApproval,
    MaintenanceRequests,
    HiddenRecords,
    RecentCuratorCreation,
    DownloadRecords,
    SystemMessages,
    Icon,
  },
  mixins: [getHostname],
  data: () => {
    return {
      leastRecentlyDeatils: null,
      recordType: null,
      headers: headersTables,
      loading: false,
      selectedTab: null,
      tabs: [
        {
          name: "RECORDS/EDITS AWAITING APPROVAL",
          target: "recordseditsawaitingapproval",
          component: "RecordsAwaitingApproval",
          headers: headersTables["approvalRequired"],
        },
        {
          name: "OWNERSHIP REQUESTS",
          target: "ownershiprequests",
          component: "MaintenanceRequests",
          headers: headersTables["maintenanceRequests"],
        },
        {
          name: "HIDDEN RECORDS",
          target: "hiddenrecords",
          component: "HiddenRecords",
          headers: headersTables["hiddenRecords"],
        },
        {
          name: "SYSTEM MESSAGES",
          target: "systemmessages",
          component: "SystemMessages",
          headers: headersTables["systemMessages"],
        },
        {
          name: "RECORDS CREATED BY CURATORS IN THE PAST WEEK",
          target: "recentcuatorcreation",
          component: "RecentCuratorCreation",
          headers: headersTables["recordsCreatedCuratorsLastWeek"],
        },
        {
          name: "DOWNLOAD RECORDS",
          target: "downloadrecords",
          component: "DownloadRecords",
          headers: headersTables["recordsCreatedCuratorsLastWeek"],
        },
      ],
    };
  },
  computed: {
    ...mapState("users", ["user", "messages"]),
  },
  created() {
    this.$nextTick(function () {
      this.recordType = this.$vuetify.icons.values;
    });
  },
  async mounted() {
    this.$nextTick(async function () {
      this.loading = true;
      await this.getUser();
      if (this.messages()["getUser"].error) {
        this.setError({
          field: "login",
          message: "You've been logged out automatically",
        });
        this.$router.push({ path: "/accounts/login" });
      }
      client.setHeader(this.user().credentials.token);
      let leastRecentlyUpdatedData = await client.executeQuery(getLeastRecentlyUpdated);
      this.leastRecentlyDeatils = leastRecentlyUpdatedData["leastRecentlyUpdated"]
      client.initalizeHeader();
      this.loading = false;
    });
  },
  methods: {
    ...mapActions("users", ["getUser", "setError"]),
  },
};
</script>
