<template>
  <v-fade-transition>
    <div>
      <v-overlay
        v-model="loading"
        :absolute="false"
        class="align-center justify-center"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </div>
  </v-fade-transition>
  <v-col cols12>
    <v-card class="mb-2">
      <v-card-text v-if="maintenanceRequestsProcessed">
        <v-card-title
          id="text-curator-search-5"
          class="bg-green text-white d-flex align-center"
        >
          <b> OWNERSHIP REQUESTS </b>
          <v-spacer />
          <v-text-field
            v-model="searches"
            class="searchField"
            clearable
            color="white"
            hide-details
            label="Search"
            single-line
            variant="solo"
          />
        </v-card-title>
        <v-card-text v-if="error.general">
          <v-alert type="error">
            Problem saving/updating record with id: {{ error.recordID }}
            {{ error.general }}
          </v-alert>
        </v-card-text>
        <v-data-table
          :headers="headerItems"
          :items="maintenanceRequestsProcessed"
          :items-per-page-options="[10, 20, 30, 40, 50]"
          :loading="loading"
          :search="searches"
          return-object
        >
          <template v-if="recordType" #item="{ item }">
            <tr>
              <td>
                {{ item.createdAt }}
              </td>
              <td>
                <div class="d-flex align-center">
                  <v-avatar v-if="item.type" class="mr-2" size="40">
                    <Icon :height="40" :item="item.type" wrapper-class="" />
                  </v-avatar>
                  <a :href="'/' + item.id" @click.prevent="navigateTo(item.id)">
                    {{ item.recordName }}
                  </a>
                </div>
              </td>
              <td>
                <a
                  :href="'/users/' + item.userId"
                  @click.prevent="navigateTo('/users/' + item.userId)"
                >
                  {{ item.userName }}
                </a>
              </td>
              <td>
                <v-menu
                  :close-on-content-click="false"
                  location="bottom"
                  min-width="400"
                >
                  <template #activator="{ props: menuProps }">
                    <span style="cursor: pointer" v-bind="menuProps">
                      {{ item.processingNotes || "Click to edit..." }}
                    </span>
                  </template>
                  <template #default="{ isActive }">
                    <v-card class="pa-2">
                      <v-card-title class="text-h6">
                        Update Processing Notes
                      </v-card-title>

                      <v-card-text class="pt-2">
                        <v-textarea
                          v-model="item.processingNotes"
                          hide-details
                          label="Edit (not long words)"
                          variant="filled"
                        />
                      </v-card-text>

                      <v-card-actions>
                        <v-btn
                          v-if="item.processingNoteId"
                          color="red"
                          size="small"
                          slim
                          variant="elevated"
                          @click="
                            deleteProcessingNote(item);
                            isActive.value = false;
                          "
                        >
                          Delete
                        </v-btn>
                        <v-spacer />
                        <v-btn
                          color="primary"
                          variant="text"
                          @click="
                            saveProcessingNotes(
                              item.id,
                              item.processingNotes,
                              item,
                            );
                            isActive.value = false;
                          "
                        >
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-menu>
              </td>
              <td>
                <div class="d-flex">
                  <v-icon
                    color="blue"
                    start
                    @click.stop="
                      assignMaintenanceOwner(
                        item.recordName,
                        item.id,
                        item.userName,
                        item.requestID,
                      )
                    "
                  >
                    fas fa-check-circle
                  </v-icon>
                  {{ item.actions }}
                  <v-icon
                    color="red"
                    end
                    @click="
                      rejectMaintenanceOwner(
                        item.recordName,
                        item.id,
                        item.userName,
                        item.requestID,
                      )
                    "
                  >
                    fas fa-ban
                  </v-icon>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-dialog v-model="dialogs.confirmAssignment" max-width="900px">
        <v-card>
          <v-card-title class="text-h5">
            Are you sure you want to
            <span style="color: blue; padding-left: 5px; padding-right: 5px">
              ACCEPT
            </span>
            this ownership?
            <ul style="list-style-type: none">
              <li>
                <span style="color: gray"> Record: </span>
                {{ dialogs.recordName }}
              </li>
              <li>
                <span style="color: gray"> User: </span>
                {{ dialogs.userName }}
              </li>
            </ul>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="dialogs.disableDelButton === true"
              color="red-darken-1"
              persistent
              variant="elevated"
              @click="closeMaintenanceAssign()"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="dialogs.disableDelButton === true"
              color="blue-darken-1"
              persistent
              variant="elevated"
              @click="assignMaintenanceOwnConfirm('approved')"
            >
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogs.rejectAssignment" max-width="900px">
        <v-card>
          <v-card-title class="text-h5">
            Are you sure you want to
            <span style="color: red; padding-left: 5px; padding-right: 5px">
              REJECT
            </span>
            this ownership?
            <ul style="list-style-type: none">
              <li>
                <span style="color: gray"> Record: </span>
                {{ dialogs.recordName }}
              </li>
              <li>
                <span style="color: gray"> User: </span>
                {{ dialogs.userName }}
              </li>
            </ul>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="dialogs.disableDelButton === true"
              color="blue-darken-1"
              persistent
              variant="elevated"
              @click="closeMaintenanceReject()"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="dialogs.disableDelButton === true"
              color="blue-darken-1"
              persistent
              variant="elevated"
              @click="assignMaintenanceOwnConfirm('rejected')"
            >
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-col>
</template>

<script>
import { mapActions, mapState } from "vuex";

import Icon from "@/components/Icon";
import RestClient from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import getPendingMaintenanceRequests from "@/lib/GraphClient/queries/curators/getPendingMaintenanceRequests.json";
import formatDate from "@/utils/generalUtils";
import navigateTo from "@/utils/generalUtils";
import Loaders from "@/components/Navigation/Loaders.vue";

const client = new GraphClient();
const restClient = new RestClient();

export default {
  name: "MaintenanceRequests",
  components: {
    Loaders,
    Icon,
  },
  mixins: [formatDate, navigateTo],
  props: {
    headerItems: {
      type: Array,
      default: null,
    },
  },
  data: () => {
    return {
      dialogs: {
        confirmAssignment: false,
        recordName: "",
        recordID: "",
        userName: "",
        requestId: "",
        rejectAssignment: false,
        disableDelButton: false,
      },
      error: {
        recordID: null,
        general: null,
      },
      searches: "",
      maintenanceRequestsProcessed: [],
      maintenanceRequests: [],
      approvalRequired: [],
      recordType: {},
      loading: false,
    };
  },
  computed: {
    ...mapState("users", ["user", "messages"]),
    ...mapState("record", ["recordUpdate"]),
  },
  watch: {
    maintenanceRequests: function () {
      this.maintenanceRequestsProcessed = JSON.parse(
        JSON.stringify(this.maintenanceRequests),
      );
    },
    "dialogs.confirmAssignment"(val) {
      val || this.closeMaintenanceAssign();
    },
    "dialogs.rejectAssignment"(val) {
      val || this.closeMaintenanceReject();
    },
  },
  async mounted() {
    this.loading = true;
    client.setHeader(this.user().credentials.token);
    //Fetching records approval awaiting data
    let data = await client.executeQuery(getPendingMaintenanceRequests);
    this.prepareMaintenanceRequests(data);
    this.maintenanceRequestsProcessed = JSON.parse(
      JSON.stringify(this.maintenanceRequests),
    );
    this.loading = false;
  },
  methods: {
    ...mapActions("record", ["updateRecord"]),

    /**
     * Method to fetch records awaiting ownership/maintenance request
     * @param dataCuration
     */
    prepareMaintenanceRequests(dataCuration) {
      let requests = dataCuration.pendingMaintenanceRequests;
      requests.forEach((item) => {
        let object = {
          createdAt: item.createdAt,
          recordName: `${item.fairsharingRecord.name} (${item.fairsharingRecord.id})`,
          id: item.fairsharingRecord.id,
          type: item.fairsharingRecord.type,
          userName: `${item.user.username}`,
          userId: `${item.user.id}`,
          processingNotes: item.fairsharingRecord.processingNotes
            ? item.fairsharingRecord.processingNotes.note
            : "",
          processingNoteId: item.fairsharingRecord.processingNotes
            ? item.fairsharingRecord.processingNotes.id
            : null,
          requestID: item.id,
        };
        this.maintenanceRequests.push(object);
      });
      this.maintenanceRequests.sort(this.compareRecordDesc);
      for (let i = 0; i < this.maintenanceRequests.length; i++) {
        this.maintenanceRequests[i].createdAt = this.formatDate(
          this.maintenanceRequests[i].createdAt,
        );
      }
    },

    /**
     * Create processing notes for a record
     * @param idRecord {Number} - FAIRshairing record id
     * @param notesText {String} - Processing notes text
     * @param item {Object} - Record object
     * @return {Promise<void>}
     */
    async saveProcessingNotes(idRecord, notesText, item) {
      const token = this.user().credentials.token;
      try {
        if (item.processingNoteId) {
          this.loading = true;
          // UPDATE EXISTING
          await restClient.updateProcessingNotes(
            item.processingNoteId,
            notesText,
            idRecord,
            token,
          );
          this.loading = false;
        } else {
          // CREATE NEW
          this.loading = true;
          const response = await restClient.createProcessingNotes(
            notesText,
            idRecord,
            token,
          );
          // Store the new ID so the next click becomes an "update"
          const newId = response.data ? response.data.id : response.id;
          item.processingNoteId = newId;
          this.loading = false;
        }
      } catch (err) {
        this.loading = false;
        this.error.general = "Failed to save processing note.";
        this.error.recordID = idRecord;
      }
    },
    /**
     * Delete a processing notes for a record
     * @param item
     * @return {Promise<void>}
     */
    async deleteProcessingNote(item) {
      if (!item.processingNoteId) {
        // If no ID exists, it's not in the database, just clear the text
        item.processingNotes = "";
        return;
      }

      try {
        this.loading = true;
        const token = this.user().credentials.token;
        await restClient.deleteProcessingNote(item.processingNoteId, token);
        // Clear local state
        item.processingNotes = "";
        item.processingNoteId = null;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        this.error.general = "Failed to delete processing note.";
        this.error.recordID = item.id;
      }
    },

    assignMaintenanceOwner(recordName, recordID, userNameID, requestID) {
      const _module = this;
      _module.dialogs.disableDelButton = false;
      _module.dialogs.recordName = recordName;
      _module.dialogs.recordID = recordID;
      _module.dialogs.userName = userNameID;
      _module.dialogs.requestId = requestID;
      _module.dialogs.confirmAssignment = true;
    },
    closeMaintenanceAssign() {
      this.dialogs.disableDelButton = true;
      this.dialogs.confirmAssignment = false;
    },
    async assignMaintenanceOwnConfirm(newStatus) {
      const _module = this;
      _module.dialogs.disableDelButton = true;
      _module.error = {
        recordID: null,
        general: null,
      };
      let data = await restClient.updateStatusMaintenanceRequest(
        _module.dialogs.requestId,
        newStatus,
        this.user().credentials.token,
      );
      /* v8 ignore start */
      if (!data.error) {
        const index = _module.maintenanceRequestsProcessed.findIndex(
          (element) => element.requestID === _module.dialogs.requestId,
        );
        _module.maintenanceRequestsProcessed.splice(index, 1);
        if (
          _module.approvalRequired.findIndex(
            (element) => element.id === _module.dialogs.recordID,
          ) < 0
        ) {
          if (
            _module.maintenanceRequestsProcessed.findIndex(
              (element) => element.id === _module.dialogs.recordID,
            ) < 0
          ) {
            await _module.saveProcessingNotes(_module.dialogs.recordID, null);
          }
        }
      } else {
        _module.error.general = "error assigning " + newStatus;
        _module.error.recordID = _module.dialogs.recordID;
      }
      if (newStatus === "approved") {
        _module.dialogs.confirmAssignment = false;
      } else {
        _module.dialogs.rejectAssignment = false;
      }
    },
    /* v8 ignore end */
    rejectMaintenanceOwner(recordName, recordID, userNameID, requestID) {
      const _module = this;
      _module.dialogs.disableDelButton = false;
      _module.dialogs.recordName = recordName;
      _module.dialogs.recordID = recordID;
      _module.dialogs.userName = userNameID;
      _module.dialogs.requestId = requestID;
      _module.dialogs.rejectAssignment = true;
    },
    closeMaintenanceReject() {
      this.dialogs.disableDelButton = true;
      this.dialogs.rejectAssignment = false;
    },
    compareRecordDesc(a, b) {
      if (a.createdAt > b.createdAt) {
        return -1;
      } else {
        return 1;
      }
    },
  },
};
</script>

<style scoped>
#text-curator-search-5
  div.theme--light.v-input:not(.v-input--is-disabled)
  input {
  color: #fff;
}

.testDialog {
  width: 600px !important;
}

:deep(.v-data-table-header tr th) {
  white-space: nowrap;
}

.searchField {
  width: 100%;
  max-width: 400px;
}
</style>
