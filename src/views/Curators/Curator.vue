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
          class="text-white mb-2 text-h5"
        >
          Welcome, curator {{ user().credentials.username }}
        </v-banner>
        <!-- least recently updated -->
        <v-card
          v-if="leastRecentlyDetails"
          class="mb-2"
        >
          <v-card-text>
            The record least recently updated is:
            <a :href="getHostname() + leastRecentlyDetails.id">
              {{ leastRecentlyDetails.name }}
            </a>
            ({{ formatDate(leastRecentlyDetails.updatedAt) }})
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
          <v-tabs-window v-model="selectedTab">
            <v-tabs-window-item
              v-for="(tab, tabIndex) in tabs"
              :key="tab + '_' + tabIndex"
              class="px-1 py-3"
            >
              <component
                :is="tab.component"
                :header-items="tab.headers"
              />
            </v-tabs-window-item>
          </v-tabs-window>
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
  CuratorRecordsAwaitingApproval,
  DownloadRecords,
  HiddenRecords,
  IncompleteRecords,
  MaintenanceRequests,
  RecentCuratorCreation,
  SystemMessages,
  UserRecordsAwaitingApproval,
} from "@/components/Curators";
import Icon from "@/components/Icon";
import headersTables from "@/data/headersCuratorDashboard.json";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getLeastRecentlyUpdated from "@/lib/GraphClient/queries/curators/getLeastRecentlyUpdated.json";
import getHostname from "@/utils/generalUtils";
import formatDate from "@/utils/generalUtils";
import Unauthorized from "@/views/Errors/403.vue";

const client = new GraphClient();

export default {
  name: "Curator",
  components: {
    Unauthorized,
    CuratorRecordsAwaitingApproval,
    MaintenanceRequests,
    HiddenRecords,
    IncompleteRecords,
    RecentCuratorCreation,
    DownloadRecords,
    SystemMessages,
    UserRecordsAwaitingApproval,
    Icon,
  },
  mixins: [getHostname, formatDate],
  data: () => {
    return {
      leastRecentlyDetails: null,
      recordType: null,
      headers: headersTables,
      loading: false,
      selectedTab: null,
      tabs: [
        {
          name: "USER EDITS AWAITING APPROVAL",
          target: "userrecordseditsawaitingapproval",
          component: "UserRecordsAwaitingApproval",
          headers: headersTables["approvalRequired"],
        },
        {
          name: "CURATOR EDITS AWAITING APPROVAL",
          target: "curatorrecordseditsawaitingapproval",
          component: "CuratorRecordsAwaitingApproval",
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
          name: "INCOMPLETE RECORDS",
          target: "incompleterecords",
          component: "IncompleteRecords",
          headers: headersTables["incompleteRecords"],
        },
        {
          name: "RECORDS CREATED BY CURATORS IN THE PAST WEEK",
          target: "recentcuatorcreation",
          component: "RecentCuratorCreation",
          headers: headersTables["recordsCreatedCuratorsLastWeek"],
        },
        {
          name: "SYSTEM MESSAGES",
          target: "systemmessages",
          component: "SystemMessages",
          headers: headersTables["systemMessages"],
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
  watch: {
    "dialogs.deleteRecord"(val) {
      val || this.closeDeleteMenu();
    }
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
      let leastRecentlyUpdatedData = await client.executeQuery(
        getLeastRecentlyUpdated
      );
      this.leastRecentlyDetails =
        leastRecentlyUpdatedData["leastRecentlyUpdated"];
      client.initalizeHeader();
      this.loading = false;
    });
  },
  methods: {
    ...mapActions("users", ["getUser", "setError"]),
  },
};
</script>
