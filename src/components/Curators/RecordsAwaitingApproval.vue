<template>
  <v-card>
    <v-card-text v-if="approvalRequiredProcessed">
      <v-card-title
        id="text-curator-search-0"
        class="green white--text"
      >
        <b> RECORDS/EDITS AWAITING APPROVAL </b>
        <v-spacer />
        <v-text-field
          v-model="searches"
          label="Search"
          color="white--text"
          single-line
          hide-details
        />
      </v-card-title>
      <v-card-text v-if="error.general">
        <v-alert type="error">
          Problem saving/updating record with id: {{ error.recordID }}
          {{ error.general }}
        </v-alert>
      </v-card-text>
      <v-data-table
        :loading="loading"
        :headers="headers"
        :items="approvalRequiredProcessed"
        :search="searches"
        class="elevation-1"
        :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
        sort-by=""
      >
        <template
          v-if="recordType"
          #item="props"
        >
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
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip bottom>
                    <template #activator="{ on: tooltip }">
                      <v-icon
                        class="clickable"
                        small
                        color="nordnetBlue"
                        v-bind="attrs"
                        v-on="{ ...tooltip, ...menu }"
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
                    @click="assignCurator(props.item.id,item.id,item.userName)"
                  >
                    <v-list-item-title>{{ item.userName }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
            <td>
              <v-avatar
                v-if="props.item.type"
                class="mr-2"
                :height="40"
              >
                <Icon
                  :item="props.item.type"
                  :height="40"
                  wrapper-class=""
                />
              </v-avatar>
              <a :href="'#/' + props.item.id">
                {{ props.item.recordName }}
              </a>
            </td>
            <td>
              <div v-if="props.item.lastEditor === 'unknown'">
                {{ props.item.lastEditor }}
              </div>
              <div v-else>
                <a :href="'#/users/' + props.item.idLastEditor">
                  {{ props.item.lastEditor }}
                </a>
              </div>
            </td>
            <td>
              <v-edit-dialog
                :return-value.sync="props.item.processingNotes"
                large
                @save="saveProcessingNotes(props.item.id,props.item.processingNotes)"
              >
                {{ props.item.processingNotes }}
                <template #input>
                  <div class="dialogProcNotesEdit">
                    <div class="mt-4 title">
                      Update Processing Notes
                    </div>
                    <v-textarea
                      v-model="props.item.processingNotes"
                      width="1200px"
                      label="Edit (not long words)"
                      filled
                    />
                  </div>
                </template>
              </v-edit-dialog>
            </td>
            <td>
              <v-icon
                color="blue"
                dark
                left
                @click.stop="approveChangesMenu(props.item.recordName,props.item.id)"
              >
                far fa-check-circle
              </v-icon>
              {{ props.item.actions }}
              <v-icon
                color="red"
                dark
                right
                small
                @click="deleteRecordMenu(props.item.recordName,props.item.id)"
              >
                fas fa-trash
              </v-icon>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                  >
                    <a
                      :href="'#/' + props.item.id+ '/edit'"
                      style="padding-left: 12px;"
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
                <a :href="'#/users/' + props.item.idCreator">
                  {{ props.item.creator }}
                </a>
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="dialogs.approveChanges"
        max-width="700px"
      >
        <v-card>
          <v-card-title
            class="headline"
          >
            Are you sure you want to
            <font style="color:blue; padding-left: 5px; padding-right: 1px;">
              ACCEPT/APPROVE CHANGES
            </font>
            record?
            <ul style="list-style-type:none;">
              <li>
                {{ dialogs.recordName }}
              </li>
            </ul>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="dialogs.disableButton === true"
              color="blue darken-1"
              text
              @click="closeApproveChangesMenu()"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="dialogs.disableButton === true"
              color="blue darken-1"
              text
              @click="confirmApproval()"
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
        v-model="dialogs.deleteRecord"
        max-width="700px"
      >
        <v-card>
          <v-card-title
            class="headline"
          >
            Are you sure you want to
            <font
              style="color:red; padding-left: 5px; padding-right: 5px;"
            >
              DELETE
            </font>
            this record?
            <ul style="list-style-type:none;">
              <li>
                {{ dialogs.recordName }}
              </li>
            </ul>
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :disabled="dialogs.disableButton === true"
              color="blue darken-1"
              text
              @click="closeDeleteMenu()"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="dialogs.disableDelButton === true || dialogs.disableButton === true"
              color="blue darken-1"
              text
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
    import { mapActions, mapState }  from "vuex"
    import RestClient from "@/lib/Client/RESTClient.js"
    import Icon from "@/components/Icon"

    const restClient = new RestClient();

    export default {
        name: "RecordsAwaitingApproval",
        components: {
          Icon
        },
        props: {
            maintenanceRequests: {
                type: Array,
                default: null
            },
            approvalRequired: {
                type: Array,
                default: null
            },
            headers: {
                type: Array,
                default: null
            },
            recordType: {
                type: Object,
                default: null
            },
            loading: {
                type: Boolean,
                default: false
            },
            curatorList: {
              type: Array,
              default: null
            }
        },
        data: () => {
            return {
              dialogs: {
                approveChanges: false,
                recordName: "",
                recordID: "",
                deleteRecord: false,
                disableDelButton: true,
                disableButton: false
              },
              error: {
                recordID: null,
                general: null
              },
              searches: '',
              approvalRequiredProcessed: []
            }
        },
        computed: {
          ...mapState('users', ['user', "messages"]),
          ...mapState("record", ["recordUpdate"])
        },
        watch: {
          approvalRequired: function(){
            this.approvalRequiredProcessed = JSON.parse(JSON.stringify(this.approvalRequired));
          },
          'dialogs.approveChanges' (val) {
            val || this.closeApproveChangesMenu()
          },
          'dialogs.deleteRecord' (val) {
            val || this.closeDeleteMenu()
          }
        },
        mounted: function () {
          this.approvalRequiredProcessed = JSON.parse(JSON.stringify(this.approvalRequired));
        },
        methods: {
            ...mapActions("record", ["updateRecord"]),

            async saveProcessingNotes(idRecord,notesText){
              const _module = this;
              _module.error = {
                recordID: null,
                general: null
              };
              let preparedRecord = {
                processing_notes: "",
                skip_approval: true
              };
              preparedRecord.processing_notes = notesText;
              let data = {
                record: preparedRecord,
                id: idRecord,
                token: _module.user().credentials.token
              };
              await _module.updateRecord(data);
              if (_module.recordUpdate.error){
                _module.error.general = _module.recordUpdate.message;
                _module.error.recordID = idRecord;
              }
            },

            async assignCurator(idRecord, idUser, nameUser){
              const _module = this;
              let preparedRecord = {
                skip_approval: true
              };
              if (nameUser === 'none'){
                preparedRecord.curator_id = null;
              }else{
                preparedRecord.curator_id = idUser;
              }
              let data = {
                record: preparedRecord,
                id: idRecord,
                token: _module.user().credentials.token
              };
              await _module.updateRecord(data);
              if (_module.recordUpdate.error){
                _module.error.general = _module.recordUpdate.message;
                _module.error.recordID = idRecord;
              }
              const index = _module.approvalRequiredProcessed.findIndex((element) => element.id === idRecord);
              _module.approvalRequiredProcessed[index].curator=nameUser.substring(0,6);
            },

            approveChangesMenu(recordName, recordID){
              const _module = this;
              _module.dialogs.disableButton = false;
              _module.dialogs.recordName = recordName;
              _module.dialogs.recordID = recordID;
              _module.dialogs.approveChanges = true;
            },

            closeApproveChangesMenu () {
              this.dialogs.disableButton = true;
              this.dialogs.approveChanges = false;
            },

            async confirmApproval () {
              const _module = this;
              _module.dialogs.disableButton = true;
              let preparedRecord = {
                approved: null
              };
              preparedRecord.approved = true;
              let data = {
                record: preparedRecord,
                id: _module.dialogs.recordID,
                token: _module.user().credentials.token
              };
              await _module.updateRecord(data);
              if (_module.recordUpdate.error){
                _module.error.general = _module.recordUpdate.message;
                _module.error.recordID = _module.dialogs.recordID;
              }else{
                const index = _module.approvalRequiredProcessed.findIndex((element) => element.id === _module.dialogs.recordID);
                _module.approvalRequiredProcessed.splice(index, 1);
                if (_module.maintenanceRequests.findIndex((element) => element.id === _module.dialogs.recordID) < 0){
                    await _module.saveProcessingNotes(_module.dialogs.recordID,"");
                }
              }
              _module.dialogs.approveChanges = false;
            },

            async confirmDelete(){
              const _module = this;
              _module.dialogs.disableButton = true;
              let data = await restClient.deleteRecord(_module.dialogs.recordID,this.user().credentials.token);
              if (data.error){
                _module.error.general = "error deleting record";
                _module.error.recordID = _module.dialogs.recordID;
              }else{
                const index = _module.approvalRequiredProcessed.findIndex((element) => element.id === _module.dialogs.recordID);
                _module.approvalRequiredProcessed.splice(index, 1);
              }
              _module.dialogs.deleteRecord = false;
            },

            deleteRecordMenu(recordName, recordID){
              const _module = this;
              _module.dialogs.disableButton = false;
              _module.dialogs.disableDelButton = true
              _module.dialogs.recordName = recordName;
              _module.dialogs.recordID = recordID;
              _module.dialogs.deleteRecord = true;
              setTimeout(function () {
                _module.dialogs.disableDelButton = false;
              }, 5000);
            },

            closeDeleteMenu () {
              this.dialogs.disableButton = true;
              this.dialogs.deleteRecord = false;
            }

        }
    }

</script>

<style scoped>
#text-curator-search-0 div.theme--light.v-input:not(.v-input--is-disabled) input {
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
</style>
