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
          v-if="allDataCuration"
          class="mb-2"
        >
          <v-card-text>
            The record least recently updated is:
            <a :href="getHostname() + allDataCuration.leastRecentlyUpdated.id">
              {{ allDataCuration.leastRecentlyUpdated.name }}
            </a>
            ({{ allDataCuration.leastRecentlyUpdated.updated_at }})
          </v-card-text>
        </v-card>
        <!--Tabs-->
        <v-tabs
          v-model="selectedTab"
          dark
          slider-color="primary"
          slider-size="5"
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


        <!-- System messages -->
        <v-card
          v-if="user().role === 'super_curator' || user().role === 'developer'"
          class="mb-2"
        >
          <v-card-text v-if="systemMessages">
            <v-card-title
              id="system-messages"
              class="green white--text"
            >
              SYSTEM MESSAGES
              <v-btn
                class="info ml-5"
                @click.stop="showAddMessage()"
              >
                <v-icon
                  color="white"
                  class="mr-1"
                >
                  fa fa-plus
                </v-icon>
                <span class="white--text">Add message</span>
              </v-btn>
              <v-spacer />
            </v-card-title>
            <v-data-table
              :loading="loading"
              :headers="headers.systemMessages"
              :items="systemMessages"
              class="elevation-1"
              :footer-props="{ 'items-per-page-options': [5, 10, 20, 25, 30] }"
            >
              <template
                v-if="systemMessages"
                #item="props"
              >
                <tr>
                  <td>
                    {{ props.item.id }}
                  </td>
                  <td>
                    <v-edit-dialog
                      :return-value.sync="props.item.message"
                      large
                      @save="
                        saveEditedMessage(props.item.id, props.item.message)
                      "
                    >
                      {{ props.item.message }}
                      <template #input>
                        <div class="dialogMessageEdit">
                          <div class="mt-4 title">
                            Update Message
                          </div>
                          <v-textarea
                            v-model="props.item.message"
                            width="1200px"
                            label="Edit away!"
                            filled
                          />
                        </div>
                      </template>
                    </v-edit-dialog>
                  </td>
                  <td>
                    {{ props.item.created_at }}
                  </td>
                  <td>
                    {{ props.item.updated_at }}
                  </td>
                  <td>
                    <v-icon
                      color="red"
                      dark
                      right
                      small
                      @click="deleteMessage(props.item.id)"
                    >
                      fas fa-trash
                    </v-icon>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>



        <!-- Button to obtain records created by month -->
        <v-card class="mb-2">
          <v-card-text>
            <v-card-title
              id="download-curator-summary"
              class="green white--text"
            >
              RECORDS CREATED BY MONTH
              <v-btn
                v-if="downloadRecordsByMonth"
                class="info ml-5"
              >
                <a
                  :href="downloadRecordsByMonth"
                  download="recordsCreatedByMonth.txt"
                >
                  <v-icon
                    color="white"
                    class="mr-1"
                  > fa fa-download </v-icon>
                  <span class="white--text">Obtain file</span>
                </a>
              </v-btn>
            </v-card-title>
          </v-card-text>
        </v-card>
        <!-- Button to obtain record edits by month -->
        <v-card class="mb-2">
          <v-card-text>
            <v-card-title
              id="download-curator-summary"
              class="green white--text"
            >
              RECORD EDITS BY MONTH
              <v-btn
                v-if="downloadEditsByMonth"
                class="info ml-5"
              >
                <a
                  :href="downloadEditsByMonth"
                  download="editsPerformedByMonth.txt"
                >
                  <v-icon
                    color="white"
                    class="mr-1"
                  > fa fa-download </v-icon>
                  <span class="white--text">Obtain file</span>
                </a>
              </v-btn>
            </v-card-title>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- this shouldn't appear as an unauthorised user shouldn't be here -->
    <v-row v-else>
      <v-col cols12>
        <Unauthorized />
      </v-col>
    </v-row>
    <!-- dialogs -->
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialogs.addMessage"
        max-width="700px"
      >
        <v-card>
          <v-card-title class="headline">
            Add new message
          </v-card-title>
          <v-card-text>
            <v-textarea
              v-model="dialogs.newMessage"
              name="new-message-field"
              label="New message"
              placeholder="Type a message here..."
              regular
              clearable
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="closeAddMessageMenu()"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              :disabled="!dialogs.newMessage"
              @click="addMessage()"
            >
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialogs.deleteMessage"
        max-width="700px"
      >
        <v-card>
          <v-card-title class="headline">
            Are you sure you want to
            <font style="color: red; padding-left: 5px; padding-right: 5px">
              DELETE
            </font>
            this message?
            <ul style="list-style-type: none">
              <li>ID: {{ dialogs.messageId }}</li>
            </ul>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="closeDeleteMessageMenu()"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="confirmDeleteMessage()"
            >
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

import {
  DownloadRecords,
  HiddenRecords,
  MaintenanceRequests,
  RecentCuratorCreation,
  RecordsAwaitingApproval
} from "@/components/Curators"
import Icon from "@/components/Icon";
import headersTables from "@/data/headersCuratorDashboard.json";
import RestClient from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getCurationRecords from "@/lib/GraphClient/queries/curators/getSummary.json";
import store from "@/store";
import getHostname from "@/utils/generalUtils";
import Unauthorized from "@/views/Errors/403.vue";

const client = new GraphClient();
const restClient = new RestClient();

function formatDate(d) {
  let date = new Date(d);
  return (
    date.toLocaleString("default", { month: "short" }) +
    " " +
    date.getUTCDate() +
    ", " +
    date.getUTCFullYear()
  );
}

/**
 * @vue-data {Object} hideFields - an array of field to NOT display
 * */

export default {
  name: "Curator",
  components: {
    Unauthorized,
    RecordsAwaitingApproval,
    MaintenanceRequests,
    HiddenRecords,
    RecentCuratorCreation,
    DownloadRecords,
    Icon,
  },
  mixins: [getHostname],
  data: () => {
    return {
      dialogs: {
        id: null,
        message: null,
        addMessage: false,
        deleteMessage: false,
        newMessage: null,
        messageId: null,
      },
      allDataCuration: null,
      recordsInCuration: [],
      hiddenRecords: [],
      // curatorList: [],
      systemMessages: [],
      recordType: null,
      headers: headersTables,
      searches: {
        recentCuratorCreations: "",
        recordsInCuration: "",
        hiddenRecords: "",
      },
      loading: false,
      downloadContent: null,
      downloadRecordsByMonth: null,
      downloadEditsByMonth: null,
      error: {
        general: null,
      },
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
    ...mapState("record", ["recordUpdate"]),
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
      let data = await client.executeQuery(getCurationRecords);
      console.log("getCurationRecords::", data);
      this.allDataCuration = data.curationSummary;
      client.initalizeHeader();
      this.prepareData();

      await this.obtainFileRecordCreatedByMonth();
      await this.obtainFileEditByMonth();
      this.loading = false;
    });
  },
  methods: {
    ...mapActions("users", ["getUser", "setError"]),
    ...mapActions("record", ["updateRecord"]),

    prepareData() {
      this.prepareRecordsInCuration(this.allDataCuration);
      this.prepareSystemMessages(this.allDataCuration);
    },


    prepareRecordsInCuration(dataCuration) {
      let userRecords = dataCuration.recordsInCuration;
      userRecords.forEach((item) => {
        item.fairsharingRecords.forEach((rec) => {
          let object = {
            curator: item.username,
            recordNameID: `${rec.name} (${rec.id})`,
            recordMaintainers: "none",
          };
          let numMaint = 0;
          rec.maintainers.forEach((main) => {
            if (numMaint > 0) {
              object.recordMaintainers +=
                ", " + main.username + " (" + main.id + ")";
            } else {
              object.recordMaintainers = main.username + " (" + main.id + ")";
            }
            numMaint += 1;
          });
          this.recordsInCuration.push(object);
        });
      });
    },

    prepareSystemMessages(dataCuration) {
      dataCuration.messages.forEach((item) => {
        this.systemMessages.push({
          id: item.id,
          message: item.message,
          created_at: formatDate(item.createdAt),
          updated_at: formatDate(item.updatedAt),
        });
      });
    },

    async obtainFileRecordCreatedByMonth() {
      let data = await restClient.getRecordCreatedByMonth(
        this.user().credentials.token
      );
      if (data) {
        let content = JSON.stringify(data)
          .replace(/^\[(.+)\]$/, "$1")
          .replace(/","/g, '"\r\n"')
          .replace(/['"]+/g, "");
        this.downloadRecordsByMonth =
          "data:text/json;charset=utf-8," + encodeURIComponent(content);
      } else {
        this.downloadRecordsByMonth = "data:text/json;charset=utf-8," + "";
      }
    },
    async obtainFileEditByMonth() {
      let data = await restClient.getEditByMonth(this.user().credentials.token);
      if (data) {
        let content = JSON.stringify(data)
          .replace(/^\[(.+)\]$/, "$1")
          .replace(/","/g, '"\r\n"')
          .replace(/['"]+/g, "");
        this.downloadEditsByMonth =
          "data:text/json;charset=utf-8," + encodeURIComponent(content);
      } else {
        this.downloadEditsByMonth = "data:text/json;charset=utf-8," + "";
      }
    },
    showAddMessage() {
      const _module = this;
      _module.dialogs.addMessage = true;
    },
    async addMessage() {
      const _module = this;
      let data = {
        message: _module.dialogs.newMessage,
      };
      let response = await restClient.createMessage(
        data,
        this.user().credentials.token
      );
      if (response.error) {
        _module.error.general = response.error;
      } else {
        _module.systemMessages.push({
          id: response.id,
          message: response.message,
          created_at: formatDate(response.created_at),
          updated_at: formatDate(response.updated_at),
        });
        await store.dispatch("messages/setMessages");
      }
      _module.dialogs.addMessage = false;
      _module.dialogs.newMessage = null;
    },
    closeAddMessageMenu() {
      const _module = this;
      _module.dialogs.addMessage = false;
    },
    deleteMessage(messageId) {
      const _module = this;
      _module.dialogs.messageId = messageId;
      _module.dialogs.deleteMessage = true;
    },
    closeDeleteMessageMenu() {
      const _module = this;
      _module.dialogs.messageId = null;
      _module.dialogs.deleteMessage = false;
    },
    async confirmDeleteMessage() {
      const _module = this;
      let response = await restClient.deleteMessage(
        _module.dialogs.messageId,
        this.user().credentials.token
      );
      if (response.error) {
        _module.error.general = response.error;
      } else {
        let filtered = _module.systemMessages.filter(function (f) {
          return f.id !== _module.dialogs.messageId;
        });
        _module.systemMessages = filtered;
        await store.dispatch("messages/setMessages");
      }
      _module.dialogs.deleteMessage = false;
      _module.dialogs.messageId = null;
    },
    async saveEditedMessage(id, message) {
      let _module = this;
      let data = {
        id: id,
        message: message,
      };
      let response = await restClient.updateMessage(
        data,
        this.user().credentials.token
      );
      if (response.error) {
        _module.error.general = response.error;
      } else {
        _module.systemMessages.forEach(function (m) {
          if (m.id === id) {
            m.message = message;
          }
        });
        await store.dispatch("messages/setMessages");
      }
    },
  },
};
</script>

<style scoped>
#text-curator-search-1
  div.theme--light.v-input:not(.v-input--is-disabled)
  input {
  color: #fff;
}
#text-curator-search-2
  div.theme--light.v-input:not(.v-input--is-disabled)
  input {
  color: #fff;
}
#text-curator-search-3
  div.theme--light.v-input:not(.v-input--is-disabled)
  input {
  color: #fff;
}
</style>
