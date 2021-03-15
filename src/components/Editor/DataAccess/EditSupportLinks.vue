<template>
  <v-container
    id="editSupportLinks"
    fluid
    class="pt-3"
  >
    <v-row>
      <b class="text-uppercase mb-2">Support links</b>
    </v-row>
    <v-row>
      <v-col col="12">
        <v-data-table
          id="supportLinksTable"
          :items="recordData"
          :headers="headers"
          group-by="type"
          show-group-by
          class="elevation-1"
          hide-default-header
          disable-pagination
          hide-default-footer
        >
          <template #item="" />
          <template #footer>
            <div class="tableFooter py-3 px-2">
              <v-chip
                class="green white--text pr-5 shadowChip"
                @click="newLink()"
              >
                <v-icon
                  small
                  class="white--text mr-3"
                >
                  fa-plus-circle
                </v-icon> Add a support link
              </v-chip>
            </div>
          </template>
          <template #[`group.summary`]="props">
            <td
              colspan="12"
              class="white"
            >
              <div class="py-2">
                <v-chip
                  v-for="(item, index) in props.items"
                  :key="'link_' + index"
                  class="blue white--text pr-5 ma-1"
                  style="cursor:pointer;"
                >
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        small
                        class="mr-2 white--text"
                        @click="editLink(getLinkIndex(item))"
                        v-on="on"
                      >
                        fas fa-pen
                      </v-icon>
                    </template>
                    <span> Edit support link </span>
                  </v-tooltip>
                  <div @click="editLink(index)">
                    <span v-if="typeof item.url === 'string'">{{ item.url }}</span>
                    <span v-else> {{ item.url.title }} ({{ item.url.url }}) </span>
                  </div>
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        small
                        class="ml-3 white--text"
                        @click="removeLink(getLinkIndex(item))"
                        v-on="on"
                      >
                        fa-times-circle
                      </v-icon>
                    </template>
                    <span> Remove support link </span>
                  </v-tooltip>
                </v-chip>
              </div>
            </td>
          </template>
          <template #[`group.header`]="{ group }">
            <td
              class="pa-3 my-2"
              colspan="12"
            >
              <v-avatar
                size="35"
                class="mr-2"
              >
                <Icon
                  :item="iconTarget(group)"
                  size="small"
                  wrapper-class=""
                />
              </v-avatar>
              <b class="pt-1">{{ group }}</b>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog
      v-model="edit.show"
      class="py-0"
      :dark="false"
      opacity="0.8"
      persistent
      width="700px"
    >
      <v-container
        v-if="edit.template"
        fluid
        class="py-0"
      >
        <v-row justify="center">
          <v-card
            class="flexCard grey black--text lighten-3"
            width="100%"
          >
            <v-form
              id="editSupportLink"
              ref="editSupportLink"
              v-model="formValid"
            >
              <v-card-title class="green white--text">
                <span v-if="edit.id">Edit</span>
                <span v-else>Create</span>
                <span class="ml-1"> support link</span>
              </v-card-title>
              <v-card-text class="pt-3">
                <v-select
                  v-model="edit.template.type"
                  :items="Object.keys(supportLinksTypes)"
                  return-object
                  outlined
                  label="Select the support link type"
                  :rules="[rules.isRequired()]"
                  :menu-props="{ bottom: true, offsetY: true }"
                />
                <v-text-field
                  v-if="rule === 'url'"
                  v-model="edit.template.url"
                  outlined
                  placeholder="Enter a URL"
                  label="Support link URL"
                  :rules="[rules.isRequired(), rules.isUrl()]"
                />
                <v-text-field
                  v-if="rule === 'email'"
                  v-model="edit.template.url"
                  outlined
                  placeholder="Enter an email"
                  label="Support link email"
                  :rules="[rules.isRequired(), rules.isEmail()]"
                />
                <v-autocomplete
                  v-if="rule === 'api'"
                  v-model="edit.template.url"
                  :items="tessRecords"
                  outlined
                  item-text="title"
                  item-value="title"
                  return-object
                  :search-input.sync="search"
                  :rules="[rules.isRequired()]"
                  :loading="loadingTessRecords"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :disabled="!formValid"
                  class="success"
                  @click="submitLink()"
                >
                  Submit support link
                </v-btn>
                <v-btn
                  class="error"
                  @click="hideOverlay()"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-row>
      </v-container>
    </v-dialog>
  </v-container>
</template>

<script>
    import { mapState } from "vuex"
    import { isEqual } from "lodash"
    import { isRequired, isUrl, isEmail } from "@/utils/rules.js"
    import ExternalClient from "@/components/Client/ExternalClients.js"
    import Icon from "@/components/Icon";

    let client = new ExternalClient();

    export default {
        name: "EditSupportLinks",
      components: {Icon},
      data(){
          return {
            edit: {
              show: false,
              id: null,
              template: null
            },
            formValid: false,
            rules: {
              isRequired: () => {return isRequired()},
              isUrl: () => {return isUrl()},
              isEmail: () => { return isEmail() }
            },
            tessRecords: [],
            search: null,
            loadingTessRecords: false,
            headers: [
              { text: 'Type', value: 'type', class: "test", groupable: true, sortable: false },
              { text: 'Name', value: 'name', groupable: false, sortable: false },
              { text: 'URL', value: 'url', groupable: false, sortable: false }
            ]
          }
        },
        computed: {
            ...mapState('record', ['sections']),
            ...mapState('editor', ['supportLinksTypes']),
            recordData(){
                return this.sections["dataAccess"].data.support_links
            },
            rule(){
              if (!this.edit.template.type) return null;
              return this.supportLinksTypes[this.edit.template.type];
            }
        },
        watch: {
          'edit.template.type': function(val) {
            this.$nextTick(() => {
              if (this.edit.template
                      && typeof this.edit.template.url !== "string"
                      && val !== "TeSS links to training materials") {
                this.edit.template.url = null;
              }
              else if (this.edit.template
                      && typeof this.edit.template.url === "string"
                      && val === "TeSS links to training materials") {
                this.edit.template.url = null;
              }
              /* istanbul ignore else */
              if (this.$refs['editSupportLink']) this.$refs['editSupportLink'].validate();
            })
          },
          search: async function(val){
            this.loadingTessRecords = true;
            this.tessRecords = (val) ? await this.findTessRecord(val) : [];
            this.loadingTessRecords = false;
          }
        },
        methods: {
          newLink(){
            this.edit = {
              show: true,
              id: null,
              template: {
                type: null,
                url: null
              }
            }
          },
          hideOverlay(){
             this.edit = {
               show: false,
               id: null,
               template: null
             }
          },
          editLink(id){
            this.edit = {
              show: true,
              id: id,
              template: JSON.parse(JSON.stringify(this.recordData[id]))
            };
            if (this.recordData[id].name) {
              this.search = this.recordData[id].name;
            }
          },
          removeLink(id){
            this.recordData.splice(id, 1);
          },
          submitLink(){
            let id = this.edit.id;
            let newLink = JSON.parse(JSON.stringify(this.edit.template));
            if (this.edit.template.type === "TeSS links to training materials") {
              newLink.title = newLink.url.title;
              newLink.name = newLink.url.title;
              newLink.url.url = newLink.url.url.replace(/.json/g, "");
            }
            if (id !== null) {
              this.$set(this.sections.dataAccess.data.support_links, id,  newLink);
            }
            else {
              this.$set(this.sections.dataAccess.data.support_links,
                      this.sections.dataAccess.data.support_links.length,
                      newLink);
            }
            this.edit = {
              show: false,
              id: null,
              template: null
            }
          },
          async findTessRecord(val){
            return await client.getTessRecords(val);
          },
          iconTarget(iconName){
            return iconName.replace(/ /g, '_').replace(/\(/g, '_').replace(/\)/g, '_').toLowerCase() || null
          },
          getLinkIndex(item){
            let index = 0;
            for (let support of this.recordData){
              if (isEqual(support, item)){
                return index
              }
              index += 1;
            }
          }
        }
    }
</script>

<style>
  #editSupportLinks .large {
    width: 100%;
  }

  .borderTop {
    border-top: 1px solid #ccc;
    margin-top:5px;
    padding-top: 10px;
  }

  #editSupportLinks .v-overlay__content {
    width: 700px;
  }

  #supportLinksTable thead tr th:last-child {
    width: 100px;
  }

  .tableFooter{
    border-top: 1px solid #ccc;
  }
</style>
