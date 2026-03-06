<template>
  <v-card class="mb-2">
    <v-card-text v-if="approvalRequiredProcessed">
      <v-card-title id="text-curator-search-0" class="bg-green text-white">
        <b>CURATOR EDITS AWAITING APPROVAL</b>
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
        :footer-props="{ 'items-per-page-options': [10, 20, 30, 40, 50] }"
        :headers="headerItems"
        :items="approvalRequiredProcessed"
        :loading="loading"
        :search="searches"
        sort-by=""
      >
        <template v-if="recordType" #item="props">
          <tr>
            <td>
              {{ props.item.updatedAt }}
            </td>
            <td>
              <div class="priorityTag">
                {{ props.item.priority }}
              </div>
            </td>
            <td>
              <v-menu>
                <template #activator="{ props: menuProps }">
                  <v-tooltip location="bottom">
                    <template #activator="{ props: tooltipProps }">
                      <v-icon
                        class="clickable"
                        color="nordnetBlue"
                        size="small"
                        v-bind="[menuProps, tooltipProps]"
                      >
                        {{ props.item.curator }}
                      </v-icon>
                    </template>
                    <span>Assign a new curator</span>
                  </v-tooltip>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in curatorList"
                    :key="index"
                    class="thelistCurators"
                    @click="
                      assignCurator(props.item.id, item.id, item.userName)
                    "
                  >
                    <v-list-item-title>{{ item.userName }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
            <td>
              <div class="d-flex align-center">
                <v-avatar v-if="props.item.type" class="mr-2" size="40">
                  <Icon :height="40" :item="props.item.type" wrapper-class="" />
                </v-avatar>
                <a :href="'/' + props.item.id">
                  {{ props.item.recordName }}
                </a>
              </div>
            </td>
            <td>
              <div v-if="props.item.lastEditor === 'unknown'">
                {{ props.item.lastEditor }}
              </div>
              <div v-else>
                <a :href="'/users/' + props.item.idLastEditor">
                  {{ props.item.lastEditor }}
                </a>
              </div>
            </td>
            <td>
              <v-confirm-edit
                v-model:return-value="props.item.processingNotes"
                large
                @save="
                  saveProcessingNotes(props.item.id, props.item.processingNotes)
                "
              >
                {{ props.item.processingNotes }}
                <template #input>
                  <div class="dialogProcNotesEdit">
                    <div class="mt-4 text-h6">Update Processing Notes</div>
                    <v-textarea
                      v-model="props.item.processingNotes"
                      label="Edit (not long words)"
                      variant="filled"
                      width="1200px"
                    />
                  </div>
                </template>
              </v-confirm-edit>
            </td>
            <td>
              <v-icon
                color="blue"
                start
                @click.stop="
                  approveChangesMenu(
                    props.item.recordName,
                    props.item.id,
                    props.item.hidden,
                  )
                "
              >
                far fa-check-circle
              </v-icon>
              {{ props.item.actions }}
              <v-icon
                color="red"
                end
                size="small"
                @click="deleteRecordMenu(props.item.recordName, props.item.id)"
              >
                fas fa-trash
              </v-icon>
              <v-tooltip location="bottom">
                <template #activator="{ props }">
                  <span v-bind="props">
                    <a
                      :href="'/' + props.item.id + '/edit'"
                      style="padding-left: 12px"
                    >
                      Edit
                    </a>
                  </span>
                </template>
                <span>If edits are saved, record is approved.</span>
              </v-tooltip>
            </td>
            <td>
              {{ props.item.createdAt }},
              <div v-if="props.item.creator === 'unknown'">
                {{ props.item.creator }}
              </div>
              <div v-else>
                <a :href="'/users/' + props.item.idCreator">
                  {{ props.item.creator }}
                </a>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
    <v-layout justify-center row>
      <v-dialog v-model="dialogs.approveChanges" max-width="700px">
        <v-card>
          <v-card-title class="text-h5">
            Are you sure you want to
            <span style="color: blue; padding-left: 5px; padding-right: 1px">
              ACCEPT/APPROVE CHANGES
            </span>
            record?
            <ul style="list-style-type: none">
              <li>
                {{ dialogs.recordName }}
              </li>
            </ul>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="dialogs.disableButton === true"
              color="blue-darken-1"
              variant="text"
              @click="closeApproveChangesMenu()"
            >
              Cancel
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="confirmApproval()"
            >
              OK
            </v-btn>
            <v-spacer />
            <v-switch
              v-model="dialogs.createReview"
              class="pr-3"
              color="green"
              label="Create Review"
            />
            <v-switch
              v-model="dialogs.recordHidden"
              color="purple"
              label="Hide record"
            />
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    <v-layout justify-center row>
      <v-dialog v-model="dialogs.deleteRecord" max-width="700px">
        <v-card>
          <v-card-title class="text-h5">
            Are you sure you want to
            <span style="color: red; padding-left: 5px; padding-right: 5px">
              DELETE
            </span>
            this record?
            <ul style="list-style-type: none">
              <li>
                {{ dialogs.recordName }}
              </li>
            </ul>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="dialogs.disableButton === true"
              color="blue-darken-1"
              variant="text"
              @click="closeDeleteMenu()"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="
                dialogs.disableDelButton === true ||
                dialogs.disableButton === true
              "
              color="blue-darken-1"
              variant="text"
              @click="confirmDelete()"
            >
              OK
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";

import Icon from "@/components/Icon";
import RestClient from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import getCuratorApprovalsRequired from "@/lib/GraphClient/queries/curators/getCuratorApprovalsRequired.json";
import getCuratorList from "@/lib/GraphClient/queries/curators/getCuratorList.json";
import getHiddenRecords from "@/lib/GraphClient/queries/curators/getHiddenRecords.json";
import formatDate from "@/utils/generalUtils";
import compareRecordDescUpdate from "@/utils/generalUtils";

const client = new GraphClient();
const restClient = new RestClient();

export default {
  name: "CuratorRecordsAwaitingApproval",
  components: {
    Icon,
  },
  mixins: [formatDate, compareRecordDescUpdate],
  props: {
    headerItems: {
      type: Array,
      default: null,
    },
  },
  data: () => {
    return {
      dialogs: {
        approveChanges: false,
        recordName: "",
        recordID: "",
        recordHidden: false,
        deleteRecord: false,
        disableDelButton: true,
        disableButton: false,
        createReview: false,
      },
      error: {
        recordID: null,
        general: null,
      },
      searches: "",
      approvalRequiredProcessed: [],
      maintenanceRequests: [],
      approvalRequired: [],
      recordType: {},
      loading: false,
      curatorList: [],
    };
  },
  computed: {
    ...mapState("users", ["user", "messages"]),
    ...mapState("record", ["recordUpdate"]),
  },
  watch: {
    approvalRequired: function () {
      this.approvalRequiredProcessed = JSON.parse(
        JSON.stringify(this.approvalRequired),
      );
    },
    "dialogs.approveChanges"(val) {
      val || this.closeApproveChangesMenu();
    },
    "dialogs.deleteRecord"(val) {
      val || this.closeDeleteMenu();
    },
  },
  async mounted() {
    this.loading = true;
    client.setHeader(this.user().credentials.token);
    //Fetching records approval awaiting data
    let data = await client.executeQuery(getCuratorApprovalsRequired);
    let listOfCurators = await client.executeQuery(getCuratorList);
    let hiddenRecords = await client.executeQuery(getHiddenRecords);
    this.prepareApprovalRequired(data, listOfCurators, hiddenRecords);
    this.approvalRequiredProcessed = JSON.parse(
      JSON.stringify(this.approvalRequired),
    );
    this.loading = false;
  },
  methods: {
    ...mapActions("record", ["updateRecord"]),

    /**
     * Method to fetch records awaiting approval
     * @param dataCuration
     * @param listOfCurators
     * @param hiddenRecords
     */
    prepareApprovalRequired(dataCuration, listOfCurators, hiddenRecords) {
      let userRecords = dataCuration.curatorApprovalsRequired;
      userRecords.forEach((item) => {
        item.fairsharingRecords.forEach((rec) => {
          let object = {
            createdAt: rec.createdAt,
            updatedAt: rec.updatedAt,
            curator: item.username.substring(0, 6),
            recordName: `${rec.name} (${rec.id})`,
            id: rec.id,
            type: rec.type,
            processingNotes: rec.processingNotes,
            hidden: false,
          };
          if (rec.creator) {
            object.creator = rec.creator.username.substring(0, 10);
            object.idCreator = rec.creator.id;
          } else {
            object.creator = "unknown";
          }
          if (rec.priority) {
            object.priority = "Priority";
          } else {
            object.priority = "";
          }
          const index = hiddenRecords.hiddenRecords.findIndex(
            (element) => element.id === rec.id,
          );
          /* v8 ignore next 3 */
          if (index >= 0) {
            object.hidden = true;
          }
          if (rec.lastEditor) {
            object.lastEditor = rec.lastEditor.username;
            object.idLastEditor = rec.lastEditor.id;
          } else {
            object.lastEditor = "unknown";
          }
          this.approvalRequired.push(object);
        });
      });
      this.approvalRequired.sort(this.compareRecordDescUpdate);
      for (let i = 0; i < this.approvalRequired.length; i++) {
        this.approvalRequired[i].updatedAt = this.formatDate(
          this.approvalRequired[i].updatedAt,
        );
        this.approvalRequired[i].createdAt = this.formatDate(
          this.approvalRequired[i].createdAt,
        );
      }
      let curators = listOfCurators.curatorList;
      let listSuper = [];
      let listCurator = [];
      curators.forEach((item) => {
        let object = {
          id: item.id,
          userName: item.username,
        };
        let role = item.role.name;
        if (role === "super_curator") {
          listSuper.push(object);
        } else if (role === "curator") {
          listCurator.push(object);
        }
      });
      this.curatorList = listSuper.concat(listCurator);
      let object = {
        id: -1,
        userName: "none",
      };
      this.curatorList.push(object);
    },

    async saveProcessingNotes(idRecord, notesText) {
      const _module = this;
      _module.error = {
        recordID: null,
        general: null,
      };
      let preparedRecord = {
        processing_notes: "",
        skip_approval: true,
      };
      preparedRecord.processing_notes = notesText;
      let data = {
        record: preparedRecord,
        id: idRecord,
        token: _module.user().credentials.token,
      };
      await _module.updateRecord(data);
      if (_module.recordUpdate.error) {
        _module.error.general = _module.recordUpdate.message;
        _module.error.recordID = idRecord;
      }
    },

    async assignCurator(idRecord, idUser, nameUser) {
      const _module = this;
      let preparedRecord = {};
      if (nameUser === "none") {
        preparedRecord.curator_id = null;
      } else {
        preparedRecord.curator_id = idUser;
      }
      let data = {
        record: preparedRecord,
        id: idRecord,
        token: _module.user().credentials.token,
      };
      await _module.updateRecord(data);
      if (_module.recordUpdate.error) {
        _module.error.general = _module.recordUpdate.message;
        _module.error.recordID = idRecord;
      }
      const index = _module.approvalRequiredProcessed.findIndex(
        (element) => element.id === idRecord,
      );
      _module.approvalRequiredProcessed[index].curator = nameUser.substring(
        0,
        6,
      );
    },

    approveChangesMenu(recordName, recordID, recordHidden) {
      const _module = this;
      _module.dialogs.disableButton = false;
      _module.dialogs.recordName = recordName;
      _module.dialogs.recordID = recordID;
      _module.dialogs.recordHidden = recordHidden;
      _module.dialogs.approveChanges = true;
    },

    closeApproveChangesMenu() {
      this.dialogs.disableButton = true;
      this.dialogs.approveChanges = false;
    },

    async confirmApproval() {
      const _module = this;
      _module.dialogs.disableButton = true;
      let preparedRecord = {
        processing_notes: undefined,
        create_review: _module.dialogs.createReview,
        hidden: _module.dialogs.recordHidden,
      };
      let data = {
        record: preparedRecord,
        id: _module.dialogs.recordID,
        token: _module.user().credentials.token,
      };
      await _module.updateRecord(data);
      if (_module.recordUpdate.error) {
        _module.error.general = _module.recordUpdate.message;
        _module.error.recordID = _module.dialogs.recordID;
      } else {
        const index = _module.approvalRequiredProcessed.findIndex(
          (element) => element.id === _module.dialogs.recordID,
        );
        _module.approvalRequiredProcessed.splice(index, 1);
      }
      _module.dialogs.approveChanges = false;
      _module.dialogs.createReview = false;
    },

    async confirmDelete() {
      const _module = this;
      _module.dialogs.disableButton = true;
      let data = await restClient.deleteRecord(
        _module.dialogs.recordID,
        this.user().credentials.token,
      );
      if (data.error) {
        _module.error.general = "error deleting record";
        _module.error.recordID = _module.dialogs.recordID;
      } else {
        const index = _module.approvalRequiredProcessed.findIndex(
          (element) => element.id === _module.dialogs.recordID,
        );
        _module.approvalRequiredProcessed.splice(index, 1);
      }
      _module.dialogs.deleteRecord = false;
    },

    deleteRecordMenu(recordName, recordID) {
      const _module = this;
      _module.dialogs.disableButton = false;
      _module.dialogs.disableDelButton = true;
      _module.dialogs.recordName = recordName;
      _module.dialogs.recordID = recordID;
      _module.dialogs.deleteRecord = true;
      setTimeout(function () {
        _module.dialogs.disableDelButton = false;
      }, 5000);
    },

    closeDeleteMenu() {
      this.dialogs.disableButton = true;
      this.dialogs.deleteRecord = false;
    },
  },
};
</script>

<style scoped>
#text-curator-search-0
  div.theme--light.v-input:not(.v-input--is-disabled)
  input {
  color: #fff;
}

.dialogProcNotesEdit {
  width: 450px !important;
}

.priorityTag {
  background-color: red;
  color: white;
  font-size: 90%;
}

.thelistCurators {
  max-height: 100px;
  overflow-y: auto;
}

:deep(.v-data-table-header tr th) {
  white-space: nowrap;
}

.searchField {
  width: 100%;
  max-width: 400px;
}
</style>
