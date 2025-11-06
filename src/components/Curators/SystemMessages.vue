<template>
  <div>
    <v-col cols12>
      <v-card
        v-if="user().role === 'super_curator' || user().role === 'developer'"
        class="mb-2"
      >
        <v-card-text v-if="systemMessages">
          <v-card-title id="system-messages" class="bg-green text-white">
            SYSTEM MESSAGES
            <v-btn class="bg-info ml-5" @click.stop="showAddMessage()">
              <v-icon color="white" class="mr-1"> fa fa-plus </v-icon>
              <span class="text-white">Add message</span>
            </v-btn>
            <v-spacer />
          </v-card-title>
          <v-data-table
            :loading="loading"
            :headers="headerItems"
            :items="systemMessages"
            :footer-props="{ 'items-per-page-options': [5, 10, 20, 25, 30] }"
          >
            <template v-if="systemMessages" #item="props">
              <tr>
                <td>
                  {{ props.item.id }}
                </td>
                <td>
                  <v-edit-dialog
                    v-model:return-value="props.item.message"
                    large
                    @save="saveEditedMessage(props.item.id, props.item.message)"
                  >
                    {{ props.item.message }}
                    <template #input>
                      <div class="dialogMessageEdit">
                        <div class="mt-4 text-h6">Update Message</div>
                        <v-textarea
                          v-model="props.item.message"
                          width="1200px"
                          label="Edit away!"
                          variant="filled"
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
                    end
                    size="small"
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
    </v-col>
    <!-- this shouldn't appear as an unauthorised user shouldn't be here -->
    <v-row>
      <!-- dialogs -->
      <v-layout row justify-center>
        <v-dialog v-model="dialogs.addMessage" max-width="700px">
          <v-card>
            <v-card-title class="text-h5"> Add new message </v-card-title>
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
                color="blue-darken-1"
                variant="text"
                @click="closeAddMessageMenu()"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
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
      <v-layout row justify-center>
        <v-dialog v-model="dialogs.deleteMessage" max-width="700px">
          <v-card>
            <v-card-title class="text-h5">
              Are you sure you want to
              <span style="color: red; padding-left: 5px; padding-right: 5px">
                DELETE
              </span>
              this message?
              <ul style="list-style-type: none">
                <li>ID: {{ dialogs.messageId }}</li>
              </ul>
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="closeDeleteMessageMenu()"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="confirmDeleteMessage()"
              >
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

import RestClient from "@/lib/Client/RESTClient";
import GraphClient from "@/lib/GraphClient/GraphClient";
import getMessages from "@/lib/GraphClient/queries/getMessages.json";
import store from "@/store";
import formatDate from "@/utils/generalUtils";

const restClient = new RestClient();
const client = new GraphClient();

export default {
  name: "SystemMessages",
  mixins: [formatDate],
  props: {
    headerItems: {
      type: Array,
      default: null,
    },
  },
  data: () => {
    return {
      systemMessages: [],
      loading: false,
      dialogs: {
        id: null,
        message: null,
        addMessage: false,
        deleteMessage: false,
        newMessage: null,
        messageId: null,
      },
      error: {
        general: null,
      },
    };
  },
  computed: {
    ...mapState("users", ["user", "messages"]),
  },

  async mounted() {
    this.loading = true;
    client.setHeader(this.user().credentials.token);
    //Fetching hidden records
    let messages = await client.executeQuery(getMessages);
    this.prepareSystemMessages(messages);
    this.loading = false;
  },
  methods: {
    /**
     * Method to fetch messages from system
     * @param dataCuration
     */
    prepareSystemMessages(dataCuration) {
      if (
        Array.isArray(dataCuration.messages) &&
        dataCuration.messages.length
      ) {
        dataCuration.messages.forEach((item) => {
          this.systemMessages.push({
            id: item.id,
            message: item.message,
            created_at: this.formatDate(item.createdAt),
            updated_at: this.formatDate(item.updatedAt),
          });
        });
      }
    },

    showAddMessage() {
      const _module = this;
      _module.dialogs.addMessage = true;
    },

    async saveEditedMessage(id, message) {
      let _module = this;
      let data = {
        id: id,
        message: message,
      };
      let response = await restClient.updateMessage(
        data,
        this.user().credentials.token,
      );
      if (response.error) {
        _module.error.general = response.error;
      }
      else {
        _module.systemMessages.forEach(function (m) {
          if (m.id === id) {
            m.message = message;
          }
        });
        await store.dispatch("messages/setMessages");
      }
    },

    deleteMessage(messageId) {
      const _module = this;
      _module.dialogs.messageId = messageId;
      _module.dialogs.deleteMessage = true;
    },

    closeAddMessageMenu() {
      const _module = this;
      _module.dialogs.addMessage = false;
    },

    async addMessage() {
      const _module = this;
      let data = {
        message: _module.dialogs.newMessage,
      };
      let response = await restClient.createMessage(
        data,
        this.user().credentials.token,
      );
      if (response.error) {
        _module.error.general = response.error;
      }
      else {
        _module.systemMessages.push({
          id: response.id,
          message: response.message,
          created_at: this.formatDate(response.created_at),
          updated_at: this.formatDate(response.updated_at),
        });
        await store.dispatch("messages/setMessages");
      }
      _module.dialogs.addMessage = false;
      _module.dialogs.newMessage = null;
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
        this.user().credentials.token,
      );
      if (response.error) {
        _module.error.general = response.error;
      }
      else {
        let filtered = _module.systemMessages.filter(function (f) {
          return f.id !== _module.dialogs.messageId;
        });
        _module.systemMessages = filtered;
        await store.dispatch("messages/setMessages");
      }
      _module.dialogs.deleteMessage = false;
      _module.dialogs.messageId = null;
    },
  },
};
</script>

<style scoped>
:deep(.v-data-table-header tr th) {
  white-space: nowrap;
}
</style>
