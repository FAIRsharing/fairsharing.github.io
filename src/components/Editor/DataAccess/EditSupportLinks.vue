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
      <v-list class="mb-5 px-4 grey lighten-3 large">
        <div
          v-if="currentSupportLinks.length === 0"
          class="py-2"
        >
          <i class="mt-3">This record has no support link.</i>
        </div>
        <v-list-item
          v-for="(supportLink, index) in currentSupportLinks"
          :key="'supportLink_' + index"
        >
          <v-chip
            class="blue white--text pr-5"
            style="cursor:pointer;"
          >
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  small
                  class="mr-2 white--text"
                  @click="editLink(index)"
                  v-on="on"
                >
                  fas fa-pen
                </v-icon>
              </template>
              <span> Edit support link </span>
            </v-tooltip>
            <div @click="editLink(index)">
              <b>{{ supportLink.type }}</b>: {{ supportLink.url }}
            </div>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  small
                  class="ml-3 white--text"
                  @click="removeLink(index)"
                  v-on="on"
                >
                  fa-times-circle
                </v-icon>
              </template>
              <span> Remove support link </span>
            </v-tooltip>
          </v-chip>
        </v-list-item>
        <!--ADD NEW SUPPORT LINK -->
        <div class="d-flex borderTop">
          <v-spacer />
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
      </v-list>
    </v-row>

    <v-expand-transition class="ma-5">
      <v-overlay
        v-if="edit.show"
        class="py-0"
        :dark="false"
        opacity="0.8"
      >
        <v-container
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
                  <v-autocomplete
                    v-model="edit.template.type"
                    :items="Object.keys(supportLinksTypes)"
                    return-object
                    outlined
                    label="Select the support link type"
                    :rules="[rules.isRequired()]"
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
                  <div v-if="rule === 'api'">
                    SPECIAL TESS WIDGET HERE !!!
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    :disabled="!formValid"
                    class="success"
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
      </v-overlay>
    </v-expand-transition>
  </v-container>
</template>

<script>
    import { mapState } from "vuex"
    import { orderBy } from "lodash"
    import { isRequired, isUrl, isEmail } from "@/utils/rules.js"

    export default {
        name: "EditSupportLinks",
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
            }
          }
        },
        computed: {
            ...mapState('record', ['sections']),
            ...mapState('editor', ['supportLinksTypes']),
            recordData(){
                return this.sections["dataAccess"].data['support_links']
            },
            currentSupportLinks(){
              return orderBy(this.recordData, ['type'], ['asc'])
            },
            rule(){
              if (!this.edit.template.type) return null;
              return this.supportLinksTypes[this.edit.template.type];
            }
        },
        watch: {
          'edit.template.type': function() {
            this.$nextTick(() => {
              if (this.$refs['editSupportLink']) this.$refs['editSupportLink'].validate();
            })
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
              id: null,
              template: JSON.parse(JSON.stringify(this.currentSupportLinks[id]))
            };
          },
          removeLink(id){
            this.recordData.splice(id, 1);
          },
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

</style>
