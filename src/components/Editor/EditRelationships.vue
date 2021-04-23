<template>
  <v-card id="editRelationships">
    <v-card-title class="grey lighten-4 blue--text">
      Edit Relationships
    </v-card-title>
    <Alerts target="relations" />
    <v-card-text class="pt-2">
      <v-container fluid>
        <v-row>
          <!-- LEFT PANEL -->
          <v-col
            xl="6"
            lg="6"
            md="6"
            sm="6"
            xs="12"
          >
            <v-card
              class="my-5 pl-4 grey lighten-3"
              elevation="5"
            >
              <v-card-title>
                Available records:
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="search"
                  outlined
                  label="Refine search"
                  placeholder="e.g. GenBank"
                  hide-details
                  :loading="loading"
                />
                <v-container>
                  <v-row no-gutters>
                    <v-col
                      v-for="(filterVal, filterName, filterIndex) in searchFilters"
                      :key="'filter_' + filterIndex"
                      cols="12"
                      sm="12"
                      xs="12"
                      md="6"
                      lg="6"
                      xl="3"
                      class="text-center"
                    >
                      <v-switch
                        v-model="searchFilters[filterName]"
                        inset
                        :label="`${capitalize(filterName)}(s)`"
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <v-divider class="pa-0 ma-0" />
              </v-card-text>
              <v-responsive
                v-if="!loading"
                class="overflow-y-auto"
                height="50vh"
              >
                <div v-if="availableRecords.length === 0">
                  <v-list-item>
                    No records could be found with this search term.
                  </v-list-item>
                </div>

                <v-lazy
                  v-for="(record, index) in availableRecords"
                  :key="'availableRecord_' + index"
                  v-model="record.isActive"
                  :options="{
                    threshold: 1
                  }"
                  class="py-2"
                  transition="fade-transition"
                  height="70px"
                >
                  <v-list-item>
                    <v-list-item-avatar>
                      <Icon
                        :item="record.type"
                        wrapper-class=""
                        :height="40"
                      />
                    </v-list-item-avatar>
                    <v-list-item-content
                      style="text-align: left"
                      class="bordered"
                    >
                      <v-list-item-title>
                        {{ record.name }}
                      </v-list-item-title>
                      <span class="text-capitalize">
                        {{ record.registry }} / {{ cleanString(record.type) }}
                      </span>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-btn
                        icon
                        class="blue white--text mr-2"
                        @click="showPreviewOverlay(record)"
                      >
                        <v-icon small>
                          fas fa-eye
                        </v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        class="green white--text"
                        @click="showOverlay(record)"
                      >
                        <v-icon small>
                          fa-arrow-right
                        </v-icon>
                      </v-btn>
                    </v-list-item-icon>
                  </v-list-item>
                </v-lazy>
              </v-responsive>
              <div
                v-else
                class="scrollZone"
              >
                <Loaders />
              </div>
            </v-card>
          </v-col>

          <!-- RIGHT PANEL -->
          <v-col
            xl="6"
            lg="6"
            md="6"
            sm="6"
            xs="12"
          >
            <v-card
              class="my-5 pl-4 grey lighten-3"
              elevation="5"
            >
              <v-card-title>
                <span>Associated records ({{ associations.length }})</span>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="searchAssociations"
                  outlined
                  label="Search through existing associations names"
                  hide-details
                />
                <v-container>
                  <v-row no-gutters>
                    <v-col
                      v-for="(filterVal, filterName, filterIndex) in labelsFilter"
                      :key="'filter_' + filterIndex"
                      cols="12"
                      sm="12"
                      xs="12"
                      md="6"
                      lg="6"
                      xl="3"
                      class="text-center"
                    >
                      <v-switch
                        v-model="labelsFilter[filterName]"
                        inset
                        :label="`${capitalize(filterName)}(s)`"
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <v-divider class="pa-0 ma-0" />
              </v-card-text>
              <v-list
                v-if="getAssociations.length > 0"
                id="associatedRecords"
                class="transparent scrollZone pr-3"
              >
                <v-list-item
                  v-for="(association, index) in getAssociations"
                  :id="'association_' + association.linkedRecord.id"
                  :key="'association_' + index"
                  dense
                  ripple
                  class="bordered my-1"
                  :class="{'orange lighten-3': association.new}"
                >
                  <v-list-item-avatar>
                    <Icon
                      :item="association.linkedRecord.type"
                      wrapper-class=""
                      :height="40"
                    />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <b v-if="!association.recordAssocLabel.relation">- {{ cleanString(association.recordAssocLabel.toUpperCase()) }} -</b>
                    <b v-else>- {{ cleanString(association.recordAssocLabel.relation.toUpperCase()) }} -</b>
                    <v-list-item-title>
                      {{ association.linkedRecord.name }}
                    </v-list-item-title>
                    <span class="text-capitalize">
                      {{ association.linkedRecord.registry }} / {{ cleanString(association.linkedRecord.type) }}
                    </span>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-btn
                      icon
                      class="red white--text"
                      @click="removeItem(index)"
                    >
                      <v-icon small>
                        fa-trash
                      </v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
              <v-list
                v-else
                class="transparent scrollZone pr-3"
              >
                <v-list-item>
                  This record does not have any association.
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn
        class="primary"
        :loading="saving"
        @click="saveRecord(false)"
      >
        Save and continue
      </v-btn>
      <v-btn
        :loading="saving"
        class="primary"
        @click="saveRecord(true)"
      >
        Save and exit
      </v-btn>
    </v-card-actions>

    <!-- SELECT RELATION LABEL -->
    <v-dialog
      v-model="showRelationsPanel"
      class="py-0"
      :dark="false"
      opacity="0.8"
      persistent
      width="700px"
    >
      <v-container
        fluid
        class="py-0"
      >
        <v-row justify="center">
          <v-form
            id="editRecordAssociation"
            ref="editRecordAssociation"
            v-model="formValid"
            style="width:100%"
          >
            <v-card
              v-if="addingRelation"
              class="flexCard"
              width="100%"
            >
              <v-card-title class="green white--text">
                Add a new relationship
              </v-card-title>
              <v-card-text
                v-if="!panelContent || panelContent.length === 0"
                class="mb-0 pb-0"
              >
                <v-alert
                  type="error"
                  class="mt-3"
                >
                  This source and target can't have relationship.
                </v-alert>
              </v-card-text>

              <v-card-text class="text-center py-3 px-4">
                <div
                  class="pa-3 lighten-5"
                  :class="{'blue': formValid, 'red': !formValid}"
                  style="border-radius:5px;"
                >
                  <div>
                    <b>SOURCE</b>
                    <span class="ml-1">
                      {{ sections.relations.data.name }}
                    </span>
                    <br>
                    <span>
                      ({{ cleanString(sections.relations.data.registry) }} - {{ cleanString(sections.relations.data.type) }})
                    </span>
                  </div>
                  <div>
                    <v-icon
                      x-large
                      class="my-5"
                      :class="{'blue--text': addingRelation.recordAssocLabel, 'red--text': !addingRelation.recordAssocLabel}"
                    >
                      fas fa-arrow-down
                    </v-icon>
                    <b
                      v-if="addingRelation.recordAssocLabel"
                      class="ml-3 doubleUnderline"
                    >{{ cleanString(addingRelation.recordAssocLabel.relation).toUpperCase() }}</b>
                  </div>
                  <div>
                    <b>TARGET:</b>
                    <span class="ml-1">
                      {{ addingRelation.linkedRecord.name }}
                    </span>
                    <br>
                    <span>
                      ({{ cleanString(addingRelation.linkedRecord.registry) }} - {{ cleanString(addingRelation.linkedRecord.type) }})
                    </span>
                  </div>
                </div>
              </v-card-text>
              <v-card-text
                v-if="addingRelation"
                class="pb-0 pt-3"
              >
                <v-autocomplete
                  v-model="addingRelation.recordAssocLabel"
                  :items="panelContent"
                  outlined
                  return-object
                  item-text="relation"
                  item-value="relation"
                  label="Select the type of relationship"
                  :disabled="!panelContent || panelContent.length === 0"
                  :rules="[rules.isRequired()]"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="success"
                  :disabled="!formValid"
                  @click="addItem()"
                >
                  Add relation
                </v-btn>
                <v-btn
                  class="error"
                  @click="showRelationsPanel = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-row>
      </v-container>
    </v-dialog>

    <!-- PREVIEW RECORD -->
    <v-dialog v-model="showPreview">
      <v-btn
        fab
        small
        class="grey--text absolute"
        @click="showPreview = false"
      >
        <v-icon>fa-times</v-icon>
      </v-btn>

      <v-card>
        <Record :target="targetPreview" />
      </v-card>
    </v-dialog>
    
    <!-- attempt to add duplicate relationship -->
    <v-snackbar
      v-model="duplicateRelationship"
      color="warning"
      class="text-body"
    >
      The same record/relation combination may not be added more than once.
    </v-snackbar>
  </v-card>
</template>

<script>
    import { mapState, mapActions, mapGetters } from "vuex"
    import { isEqual, capitalize } from "lodash"
    import stringUtils from '@/utils/stringUtils';
    import Record from "@/views/Records/Record";
    import Loaders from "../Navigation/Loaders";
    import Icon from "@/components/Icon";
    import Alerts from "./Alerts";
    import { isRequired } from "@/utils/rules.js"

    export default {
        name: "EditRelationships",
        components: {Alerts, Icon, Loaders, Record},
        mixins: [stringUtils],
        data(){
          return {
            saving: false,
            loading: false,
            search: null,
            searchAssociations: null,
            showRelationsPanel: false,
            panelContent: null,
            addingRelation: null,
            formValid: false,
            targets: [],
            showPreview: false,
            targetPreview: null,
            rules: { isRequired: () => {return isRequired()} },
            labelsFilter: {},
            searchFilters: {},
            initialized: false,
            lastQuery: null,
            duplicateRelationship: false
          }
        },
        computed: {
          ...mapState("record", ["sections", "currentID"]),
          ...mapState("users", ["user"]),
          ...mapState("editor", ["availableRecords", "relationsTypes"]),
          ...mapGetters("editor", ["allowedRelations", "allowedTargets"]),
          ...mapGetters("record", ["getSection"]),
          associations(){
            return this.sections.relations.data.recordAssociations;
          },
          getAssociations(){
            if (!this.labelsFilter) return this.associations;
            let searchTerm = this.searchAssociations || "";
            return this.associations.filter(obj => {
              if (obj.linkedRecord.name.includes(searchTerm)
                      && this.labelsFilter[obj.linkedRecord.registry.toLowerCase()] === true){
                return obj;
              }
            });
          },
          message(){
            let error = this.getSection("relations").error;
            return {
              error: error,
              value: this.getSection("relations").message,
            };
          }
        },
        watch: {
          async search() {
            await this.runSearch();
          },
          searchFilters: {
            deep: true,
            async handler() {
              await this.runSearch();
            }
          },
          associations: {
            deep: true,
            handler(){
              let changes = 0;
              if (!isEqual(this.sections.relations.initialData.recordAssociations,
                      this.sections.relations.data.recordAssociations)) {
                changes += 1;
              }
              this.$store.commit("record/setChanges", {
                section: "relations",
                value: changes
              });
            }
          }
        },
        mounted() {
          this.$nextTick(async function () {
            this.loading = true;
            await this.getAvailableRelationsTypes();
            this.targets = this.allowedTargets(this.sections.relations.data.registry.toLowerCase());
            this.getRelations();
            this.loading = false;
            this.initialized = true;
          });
        },
        methods: {
          ...mapActions("editor", ["getAvailableRecords", "getAvailableRelationsTypes"]),
          ...mapActions("record", ["updateRelations"]),
          capitalize,
          addItem() {
            let _module = this;
            _module.searchAssociations = null;
            Object.keys(_module.labelsFilter).forEach(filter => {
              _module.labelsFilter[filter] = true;
            });
            // If an item already exists then this shouldn't be added...
            var exists = this.sections.relations.data.recordAssociations.find(function(link) {
              if (link.linkedRecord.name === _module.addingRelation.linkedRecord.name &&
                  link.recordAssocLabel.relation === _module.addingRelation.recordAssocLabel.relation) {
                return true;
              }
            });
            if (exists) {
              _module.duplicateRelationship = true;
              return;
            }
            let newRelation = {
              linkedRecord: _module.addingRelation.linkedRecord,
              recordAssocLabel: _module.addingRelation.recordAssocLabel,
              new: true,
            };
            _module.sections.relations.data.recordAssociations.unshift(newRelation);
            _module.showRelationsPanel = false;
            _module.$nextTick(() => {
              _module.$scrollTo('#association_' + _module.addingRelation.id, 450, {
                container: '#associatedRecords',
                easing: 'ease-in',
              })
            });
          },
          removeItem(id){
            this.sections.relations.data.recordAssociations.splice(id, 1);
          },
          // OVERLAY
          showOverlay(target){
            this.showRelationsPanel = true;
            this.panelContent = null;
            this.addingRelation = {
              linkedRecord: target,
              recordAssocLabel: null,
              id: target.id
            };
            let prohibited = [];
            this.panelContent = this.allowedRelations({
                target: {
                  registry: target.registry.toLowerCase(),
                  type: target.type.toLowerCase()
                },
                sourceType: this.sections.relations.data.registry.toLowerCase(),
                prohibited: prohibited
            });
            this.$nextTick(() => {this.$refs['editRecordAssociation'].validate()});
          },
          showPreviewOverlay(record){
            this.targetPreview = record.id;
            this.showPreview = true;
          },
          getRelations() {
            let labelsFilter = {};
            let allRelations = ['standard', 'database', 'collection', 'policy'];

            let allowedRelations = this.allowedRelations({
              target: null,
              sourceType: this.sections.relations.data.registry.toLowerCase(),
              prohibited: null
            });
            allowedRelations.forEach(allowedRelation => {
              if (!Object.keys(labelsFilter).includes(allowedRelation.target)){
                /* istanbul ignore else */
                if (allRelations.includes(allowedRelation.target.toLowerCase())) {
                  labelsFilter[allowedRelation.target] = true;
                  allRelations.splice(allRelations.indexOf(allowedRelation.target.toLowerCase()), 1)
                }
              }
            });
            this.labelsFilter = {...labelsFilter};
            this.searchFilters = {...labelsFilter};
          },
          async runSearch(){
            let _module = this;
            this.loading = true;
            let search = null;
            if (this.search && this.search.trim().length >= 3) {
              search = this.search.trim();
            }
            let registries = [];
            Object.keys(this.searchFilters).forEach(filter => {
              if (this.searchFilters[filter]){
                registries.push(filter);
              }
            });
            this.lastQuery = search;
            await _module.getAvailableRecords({
              q: search,
              fairsharingRegistry: registries,
              excludeId: _module.currentID
            });

            let i = 0;
            this.availableRecords.forEach(rec => {
              rec.isActive = i < 15; // activate the 15 first items for v-lazy.
              i += 1;
            });

            if (search === this.lastQuery) this.loading = false;
          },
          async saveRecord(redirect){
            this.saving = true;
            await this.updateRelations({
              token: this.user().credentials.token,
              source: this.$route.params.id
            });
            this.saving = false;
            if (!redirect) {
              this.$scrollTo("#mainHeader");
              this.$store.commit("record/setChanges", {
                section: "relations",
                value: 0
              })
            }
            if (redirect && !this.message.error){
              await this.$router.push({path: '/' + this.$route.params.id})
            }
          }
        }
    }
</script>

<style scoped>

  .scrollZone {
    height: 50vh;
    width: 100%;
    overflow-y: scroll;
  }

  .bordered{
    border-bottom: 1px dashed #ccc;
  }

  .doubleUnderline {
    text-decoration-line: underline;
    text-decoration-style: double;
  }

  .absolute {
    position: absolute !important;
    z-index: 1;
    right: 13px;
    top: 48px;
  }


</style>
