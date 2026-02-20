<template>
  <v-container id="editSupportLinks" class="pt-3" fluid>
    <v-row>
      <b class="text-uppercase mb-2">Support links</b>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-data-table
          id="supportLinksTable"
          :group-by="[{ key: 'type', order: 'asc' }]"
          :headers="headers"
          :items="recordData"
          class="elevation-1"
          disable-pagination
          hide-default-footer
          hide-default-header
          show-group-by
        >
          <template #bottom>
            <div class="tableFooter py-3 px-2">
              <v-chip
                class="bg-green text-white pr-5 shadowChip"
                @click="newLink()"
              >
                <v-icon class="text-white mr-3" size="small">
                  fas fa-plus-circle
                </v-icon>
                Add a support link
              </v-chip>
            </div>
          </template>
          <template #group-header="{ item }">
            <div>
              <div class="bg-grey-lighten-3">
                <v-avatar class="mr-2" size="35">
                  <Icon
                    :item="getIconName(item.value)"
                    size="small"
                    wrapper-class=""
                  />
                </v-avatar>
                <b class="pt-1">{{ item.value }}</b>
              </div>
              <v-chip-group class="mb-5 px-4 large" column>
                <v-chip
                  v-for="(links, key) in item.items"
                  :key="key"
                  :class="[
                    !isNew(links.raw) ? 'bg-blue' : 'bg-white borderBlue',
                  ]"
                  class="pr-5"
                  style="cursor: pointer"
                  variant="flat"
                >
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <v-icon
                        class="mr-2 text-white"
                        size="small"
                        v-bind="props"
                        @click="editLink(getLinkIndex(links.raw))"
                      >
                        fas fa-pen
                      </v-icon>
                    </template>
                    <span> Edit support link </span>
                  </v-tooltip>
                  <div @click="editLink(getLinkIndex(links.raw))">
                    <span v-if="typeof links.raw.url === 'string'">{{
                      links.raw.url
                    }}</span>
                    <span v-else>
                      {{ links.raw.url.title }} ({{ links.raw.url.url }})
                    </span>
                  </div>
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <v-icon
                        class="ml-3 text-white"
                        size="small"
                        v-bind="props"
                        @click="removeLink(getLinkIndex(links.raw))"
                      >
                        fas fa-times-circle
                      </v-icon>
                    </template>
                    <span> Remove support link </span>
                  </v-tooltip>
                </v-chip>
              </v-chip-group>
            </div>
          </template>
          <template #no-data>
            <div>This record does not have any support links.</div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog
      v-model="edit.show"
      :dark="false"
      class="py-0"
      opacity="0.8"
      persistent
      width="700px"
    >
      <v-container v-if="edit.template" class="py-0" fluid>
        <v-row justify="center">
          <v-card class="flexCard bg-grey-lighten-3 text-black" width="100%">
            <v-form
              id="editSupportLink"
              ref="editSupportLink"
              v-model="formValid"
            >
              <v-card-title class="bg-green text-white">
                <span v-if="edit.id">Edit</span>
                <span v-else>Create</span>
                <span class="ml-1"> support link</span>
              </v-card-title>
              <v-card-text class="pt-3">
                <v-select
                  v-model="edit.template.type"
                  :items="Object.keys(supportLinksTypes)"
                  :menu-props="{ bottom: true, offsetY: true }"
                  :rules="[rules.isRequired()]"
                  label="Select the support link type"
                  return-object
                  variant="outlined"
                />
                <v-text-field
                  v-if="rule === 'url'"
                  v-model="edit.template.url.url"
                  :rules="[rules.isRequired(), rules.isUrl()]"
                  label="Support link URL"
                  placeholder="Enter a URL"
                  variant="outlined"
                />
                <v-text-field
                  v-if="rule === 'email'"
                  v-model="edit.template.url.url"
                  :rules="[rules.isRequired(), rules.isEmail()]"
                  label="Support link email"
                  placeholder="Enter an email"
                  variant="outlined"
                />
                <v-text-field
                  v-if="rule === 'email/url'"
                  v-model="edit.template.url.url"
                  :rules="[rules.isRequired(), rules.isEmailOrUrl()]"
                  label="Support link email or url"
                  placeholder="Enter an email or url"
                  variant="outlined"
                />
                <v-text-field
                  v-if="
                    rule === 'email' || rule === 'url' || rule === 'email/url'
                  "
                  v-model="edit.template.url.title"
                  label="Support link name"
                  placeholder="Enter a resource name"
                  variant="outlined"
                />
                <v-autocomplete
                  v-if="rule === 'api'"
                  v-model="edit.template.url"
                  v-model:search-input="search"
                  :items="tessRecords"
                  :loading="loadingTessRecords"
                  :rules="[rules.isRequired()]"
                  item-title="title"
                  item-value="title"
                  return-object
                  variant="outlined"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :disabled="!formValid"
                  class="bg-success"
                  @click="submitLink()"
                >
                  Submit support link
                </v-btn>
                <v-btn class="bg-error" @click="hideOverlay()"> Cancel</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-row>
      </v-container>
    </v-dialog>
  </v-container>
</template>

<script>
import { isEqual } from "lodash";
import { mapState } from "vuex";

import Icon from "@/components/Icon";
import ExternalClient from "@/lib/Client/ExternalClients.js";
import IconsMixin from "@/utils/iconsMixin.js";
import { isEmail, isEmailOrUrl, isRequired, isUrl } from "@/utils/rules.js";

let client = new ExternalClient();

export default {
  name: "EditSupportLinks",
  components: { Icon },
  mixins: [IconsMixin],
  data() {
    return {
      edit: {
        show: false,
        id: null,
        template: null,
      },
      formValid: false,
      rules: {
        isRequired: () => {
          return isRequired();
        },
        isUrl: () => {
          return isUrl();
        },
        isEmail: () => {
          return isEmail();
        },
        isEmailOrUrl: () => {
          return isEmailOrUrl();
        },
      },
      tessRecords: [],
      search: null,
      loadingTessRecords: false,
      headers: [
        {
          text: "Type",
          value: "type",
          class: "test",
          groupable: true,
          sortable: false,
        },
        { text: "Name", value: "name", groupable: false, sortable: false },
        { text: "URL", value: "url", groupable: false, sortable: false },
      ],
    };
  },
  computed: {
    ...mapState("record", ["sections"]),
    ...mapState("editor", ["supportLinksTypes"]),
    recordData() {
      return this.sections["dataAccess"].data.support_links;
    },
    rule() {
      if (!this.edit.template.type) return null;
      return this.supportLinksTypes[this.edit.template.type];
    },
    initialData() {
      return this.sections["dataAccess"].initialData.support_links;
    },
  },
  watch: {
    "edit.template.type": function () {
      this.$nextTick(() => {
        if (this.reactToTypeChange && this.edit.template) {
          this.edit.template.url = {};
        }
        /* istanbul ignore else */
        if (this.$refs["editSupportLink"])
          this.$refs["editSupportLink"].validate();
        this.reactToTypeChange = true;
      });
    },
    search: async function (val) {
      this.loadingTessRecords = true;
      this.tessRecords = val ? await this.findTessRecord(val) : [];
      this.loadingTessRecords = false;
    },
  },
  methods: {
    newLink() {
      this.edit = {
        show: true,
        id: null,
        template: {
          type: null,
          url: { url: null },
          name: null,
        },
      };
    },
    hideOverlay() {
      this.edit = {
        show: false,
        id: null,
        template: null,
      };
    },
    editLink(id) {
      this.reactToTypeChange = false;
      this.edit = {
        show: true,
        id: id,
        template: JSON.parse(JSON.stringify(this.recordData[id])),
      };
      if (typeof this.edit.template.url === "string") {
        this.edit.template.url = { url: this.edit.template.url };
      }
      if (this.recordData[id].name) {
        this.search = this.recordData[id].name;
      }
    },
    removeLink(id) {
      this.recordData.splice(id, 1);
    },
    submitLink() {
      let id = this.edit.id;
      let newLink = JSON.parse(JSON.stringify(this.edit.template));
      if (this.edit.template.type === "TeSS links to training materials") {
        newLink.title = newLink.url.title;
        newLink.name = newLink.url.title;
        newLink.url.url = newLink.url.url.replace(/.json/g, "");
      }
      if (typeof newLink.url !== "string") {
        newLink.name = newLink.url.title;
        newLink.title = newLink.url.title;
      }
      if (id !== null) {
        this.sections.dataAccess.data.support_links[id] = newLink;
      } else {
        this.sections.dataAccess.data.support_links[
          this.sections.dataAccess.data.support_links.length
        ] = newLink;
      }
      this.edit = {
        show: false,
        id: null,
        template: null,
      };
    },
    async findTessRecord(val) {
      return await client.getTessRecords(val);
    },
    getLinkIndex(item) {
      let index = 0;
      for (let support of this.recordData) {
        if (isEqual(support, item)) {
          return index;
        }
        index += 1;
      }
    },
    isNew(item) {
      return !this.initialData.filter((obj) => isEqual(obj, item))[0];
    },
    displayGroupData(item) {
      return Object.groupBy(item, ({ type }) => type);
    },
  },
};
</script>

<style>
#editSupportLinks .large {
  width: 100%;
}

#editSupportLinks .v-overlay__content {
  width: 700px;
}

#supportLinksTable thead tr th:last-child {
  width: 100px;
}

.tableFooter {
  border-top: 1px solid #ccc;
}

#supportLinksTable tr.v-data-table__empty-wrapper {
  background: #eeeeee;
  font-weight: bold;
}
</style>
