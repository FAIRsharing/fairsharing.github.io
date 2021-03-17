<template>
  <div id="editLicences">
    <v-container
      fluid
      class="pt-3"
    >
      <v-row>
        <b class="text-uppercase mb-2">Licences</b>
      </v-row>
      <v-row>
        <v-chip-group
          class="mb-5 px-4 grey lighten-3 large"
          column
        >
          <div
            v-if="currentLicences.length === 0"
            class="pt-2"
          >
            <i class="mt-3">This record has no licence.</i>
          </div>
          <v-chip
            v-for="(licenceLink, index) in currentLicences"
            :key="'licence_' + index"
            class="pr-5"
            :class="[!isNew(licenceLink) ? 'white--text blue' : ' blue--text white borderBlue']"
          >
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  small
                  class="mr-2 white--text"
                  v-on="on"
                  @click="showEditItem(index)"
                >
                  fas fa-pen
                </v-icon>
              </template>
              <span> Change licence </span>
            </v-tooltip>
            <div @click="showEditItem(index)">
              {{ licenceLink.licence.name }}
              <span
                v-if="licenceLink.relation && licenceLink.relation !== 'undefined' "
                class="ml-1"
              >({{ licenceLink.relation }})</span>
            </div>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  small
                  class="ml-3 white--text"
                  v-on="on"
                  @click="removeLicenceLink(index)"
                >
                  fa-times-circle
                </v-icon>
              </template>
              <span> Remove licence </span>
            </v-tooltip>
          </v-chip>
          <v-spacer />
          <!--ADD NEW LICENCE -->
          <v-chip
            class="green white--text pr-5 shadowChip"
            @click="showEditItem()"
          >
            <v-icon
              small
              class="white--text mr-3"
            >
              fa-plus-circle
            </v-icon> Add a new licence
          </v-chip>
        </v-chip-group>
      </v-row>
    </v-container>
    <v-expand-transition class="ma-5">
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
              class="flexCard grey black--text"
              width="100%"
              :class="{'lighten-0': showCreator, 'lighten-3': !showCreator}"
            >
              <v-card-title class="green white--text">
                <span v-if="edit.id">Edit</span>
                <span v-else> Create new</span>
                <span class="ml-2">Licence Link</span>
              </v-card-title>
              <v-card-text class="pt-3">
                <v-form
                  id="editLink"
                  ref="editLink"
                  v-model="formValid.link"
                >
                  <!-- LICENCE -->
                  <v-card
                    class="d-flex flex-row transparent elevation-0"
                    :disabled="!!showCreator"
                  >
                    <v-autocomplete
                      v-model="edit.template.licence"
                      :items="availableLicences"
                      item-value="id"
                      item-text="name"
                      outlined
                      return-object
                      label="Select the Licence name"
                      :rules="[rules.isRequired()]"
                    >
                      <template #selection="data">
                        <v-chip class="blue white--text px-3 py-1 short">
                          <span>{{ data.item.name }}</span>
                        </v-chip>
                      </template>
                      <template #item="data">
                        <v-list-item-content class="menuItem">
                          {{ data.item.name }}
                        </v-list-item-content>
                      </template>
                    </v-autocomplete>
                    <v-btn
                      fab
                      small
                      class="green white--text mt-2 ml-2"
                      @click="showCreator = true"
                    >
                      <v-icon small>
                        fa-plus
                      </v-icon>
                    </v-btn>
                  </v-card>
                  <!-- NEW LICENCE -->
                  <v-form
                    ref="newLicence"
                    v-model="formValid.licence"
                  >
                    <v-card
                      v-if="showCreator"
                      class="elevation-0 lighten-3 grey mb-10 pb-3 px-3"
                      style="border: 2px dashed grey !important; border-radius:5px;"
                    >
                      <v-card-text class="pt-6">
                        <v-text-field
                          v-model="newLicence.name"
                          outlined
                          label="License's name"
                          :rules="[rules.isRequired()]"
                        />
                        <v-text-field
                          v-model="newLicence.url"
                          outlined
                          label="Licence's URL"
                          :rules="[rules.isRequired(), rules.isUrl()]"
                        />
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn
                          :disabled="!formValid.licence"
                          class="success"
                          @click="createNewLicence()"
                        >
                          Create new licence
                        </v-btn>
                        <v-btn
                          class="error"
                          @click="showCreator = false"
                        >
                          Cancel
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-form>
                  <!-- RELATION -->
                  <v-card
                    class="d-flex flex-row transparent elevation-0"
                    :disabled="!!showCreator"
                  >
                    <v-autocomplete
                      v-model="edit.template.relation"
                      :items="licenceRelations"
                      outlined
                      return-object
                      label="Select the Licence relation"
                      :rules="[rules.isRequired()]"
                    />
                  </v-card>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="success"
                  :disabled="showCreator || !formValid.link"
                  @click="updateLink()"
                >
                  <span v-if="edit.id">Edit</span>
                  <span v-else>Create</span>
                  <span class="ml-1">licence link</span>
                </v-btn>
                <v-btn
                  class="error"
                  @click="hideEdit()"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-container>
      </v-dialog>
    </v-expand-transition>
  </div>
</template>

<script>
    import { mapState } from "vuex"
    import { isEqual } from 'lodash'
    import { isRequired, isUrl } from "@/utils/rules.js"

    export default {
        name: "EditLicences",
        data(){
            return {
                edit: {
                    show: false,
                    id: null,
                    template: null
                },
                formValid: {
                  link: false,
                  licence: false
                },
                showCreator: false,
                rules: {
                  isRequired: function(){return isRequired()},
                  isUrl: function(){return isUrl()},
                },
                newLicence: {
                  name: null,
                  url: null
                }
            }
        },
        computed: {
            ...mapState('record', ['sections']),
            ...mapState('editor', ['availableLicences', 'licenceRelations']),
            currentLicences(){
                return this.sections.dataAccess.data.licences
            },
            initialLicences(){
              return this.sections.dataAccess.initialData.licences
            }
        },
        watch: {
          'edit.template': function () {
            this.$nextTick(() => {
              /* istanbul ignore else */
              if (this.$refs['editLink']) {
                this.$refs['editLink'].validate();
              }
            })
          }
        },
        methods: {
          showEditItem(id){
              this.edit = {
                show: true,
                id: id > -1 ? id : null,
                template: {
                  relation: id > -1 ? this.currentLicences[id].relation : null,
                  target: id > -1 ? this.currentLicences[id].id : null
                }
              };
              if (id >= -1) {
                this.edit.template.licence = {
                  name: this.currentLicences[id].licence.name,
                  id: this.currentLicences[id].licence.id
                };
              }
          },
          hideEdit(){
            this.edit = {
              show: false,
              id: null,
              template: null
            };
            this.showCreator = false;
          },
          updateLink(){
            let id = this.edit.id;
            let newLink = JSON.parse(JSON.stringify(this.edit.template));
            if (id !== null) {
              let link = this.sections.dataAccess.data.licences[id];
              link.licence = newLink.licence;
              link.relation = newLink.relation;
            }
            else {
              let createLink = {
                fairsharingRecord: {id: this.$route.params["id"]},
                licence: newLink.licence,
                relation: newLink.relation
              };
              this.sections.dataAccess.data.licences.push(createLink);
            }
            this.edit = {
              show: false,
              id: null,
              template: null
            }
          },
          removeLicenceLink(id){
            this.sections.dataAccess.data.licences.splice(id, 1);
          },
          createNewLicence(){
            // make sure name is unique !!!!!

            let newLicence = JSON.parse(JSON.stringify(this.newLicence));
            this.availableLicences.push(newLicence);
            this.edit.template.licence = newLicence;
            this.showCreator = false;
            this.newLicence = {
              name: null,
              url: null
            }
          },
          isNew(item){
            return !this.initialLicences.filter(obj => isEqual(obj, item))[0];
          }
        }
    }
</script>

<style scoped>
    #editLicences .large {
        width: 100%;
    }

    #editLicences .v-overlay__content {
      width: 700px;
    }

    .menuItem {
      max-width: 580px;
    }

</style>
