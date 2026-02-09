<template>
  <v-col cols12>
    <div>
      <v-layout justify-center row>
        <v-dialog v-model="dialogs.deleteRecord" max-width="700px">
          <v-card>
            <v-card-title class="text-h5">
              Are you sure you want to
              <span style="color: red; padding-left: 5px; padding-right: 5px">
                DELETE
              </span>
              record {{ dialogs.recordID }}? It may take a moment...
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
    </div>
    <v-card class="mb-2">
      <v-card-text v-if="incompleteRecords">
        <v-card-title id="text-curator-search-2" class="bg-green text-white">
          <b> INCOMPLETE RECORDS </b>
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
        <v-data-table
          :footer-props="{ 'items-per-page-options': [10, 20, 30, 40, 50] }"
          :headers="headerItems"
          :items="incompleteRecords"
          :loading="loading"
          :search="searches"
        >
          <template v-if="recordType" #item="props">
            <tr>
              <td>
                <div class="d-flex align-center">
                  <v-avatar v-if="props.item.type" class="mr-2" size="40">
                    <Icon
                      :height="40"
                      :item="props.item.type"
                      wrapper-class=""
                    />
                  </v-avatar>
                  <a :href="'/' + props.item.id">
                    {{ props.item.recordNameID }}
                  </a>
                </div>
              </td>
              <td>
                {{ props.item.createdAt }}
              </td>
              <td>
                {{ props.item.required }}
              </td>
              <td>
                {{ props.item.recommended }}
              </td>
              <td>
                {{ props.item.optional }}
              </td>
              <td>
                <v-icon
                  color="red"
                  end
                  size="small"
                  @click="deleteRecordMenu(props.item.id)"
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
</template>

<script>
import { mapState } from "vuex";

import Icon from "@/components/Icon";
import RestClient from "@/lib/Client/RESTClient";
import GraphClient from "@/lib/GraphClient/GraphClient";
import getIncompleteRecords from "@/lib/GraphClient/queries/curators/getIncompleteRecords.json";
import formatDateIso from "@/utils/generalUtils";

const client = new GraphClient();
const restClient = new RestClient();

export default {
  name: "IncompleteRecords",
  components: {
    Icon,
  },
  mixins: [formatDateIso],
  props: {
    headerItems: {
      type: Array,
      default: null,
    },
  },
  data: () => {
    return {
      incompleteRecords: [],
      searches: "",
      recordType: {},
      loading: false,
      dialogs: {
        recordID: "",
        deleteRecord: false,
        disableDelButton: true,
        createReview: false,
      },
    };
  },
  computed: {
    ...mapState("users", ["user"]),
  },

  async mounted() {
    this.loading = true;
    client.setHeader(this.user().credentials.token);
    //Fetching incomplete records
    let records = await client.executeQuery(getIncompleteRecords);
    this.prepareIncompleteRecords(records);
    this.loading = false;
  },
  methods: {
    /**
     * Method to fetch incomplete records
     * @param dataCuration
     */
    prepareIncompleteRecords(dataCuration) {
      let records = dataCuration.incompleteRecords;
      records.forEach((item) => {
        let recommended = [];
        item.incomplete.recommended.forEach((rec) => {
          recommended.push(rec.field);
        });
        let required = [];
        item.incomplete.required.forEach((req) => {
          required.push(req.field);
        });
        let optional = [];
        item.incomplete.optional.forEach((req) => {
          /* v8 ignore next */
          optional.push(req.field);
        });
        let object = {
          recordNameID: `${item.name} (${item.id})`,
          type: item.type,
          id: item.id,
          recommended: recommended.sort().join(", "),
          required: required.sort().join(", "),
          optional: optional.sort().join(", "),
        };
        object.createdAt = this.formatDateIso(item.createdAt);
        this.incompleteRecords.push(object);
      });
    },
    async confirmDelete() {
      const _module = this;
      _module.dialogs.disableButton = true;
      _module.dialogs.disableDelButton = true;
      let data = await restClient.deleteRecord(
        _module.dialogs.recordID,
        this.user().credentials.token,
      );
      if (data.error) {
        _module.error.general = "error deleting record";
        _module.error.recordID = _module.dialogs.recordID;
      } else {
        const index = _module.incompleteRecords.findIndex(
          (element) => element.id === _module.dialogs.recordID,
        );
        _module.incompleteRecords.splice(index, 1);
      }
      _module.dialogs.deleteRecord = false;
    },

    deleteRecordMenu(recordID) {
      const _module = this;
      _module.dialogs.disableButton = false;
      _module.dialogs.disableDelButton = true;
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
:deep(.v-data-table-header tr th) {
  white-space: nowrap;
}

.searchField {
  width: 100%;
  max-width: 400px;
}
</style>
