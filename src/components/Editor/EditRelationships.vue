<template>
  <v-card id="editRelationships">
    <v-card-title class="grey lighten-4 blue--text">
      Edit Relationships
    </v-card-title>
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
              </v-card-text>
              <v-list
                v-if="availableRecords.length > 0"
                class="transparent scrollZone pr-3"
                style="border-bottom: 1px solid #ccc;"
              >
                <v-list-item
                  v-for="(record, index) in availableRecords"
                  :key="'availableRecord_' + index"
                  dense
                  ripple
                  class="bordered"
                >
                  <v-list-item-avatar>
                    <v-img :src="icons()[record.type]" />
                  </v-list-item-avatar>
                  <v-list-item-content>
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
                      <!--@click="addItem(index)"-->
                      <v-icon small>
                        fas fa-eye
                      </v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      class="green white--text"
                      @click="showOverlay(record)"
                    >
                      <!--@click="addItem(index)"-->
                      <v-icon small>
                        fa-arrow-right
                      </v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
              <v-list
                v-else
                class="transparent scrollZone pr-3"
              >
                <v-list-item>No records could be found with this search term.</v-list-item>
              </v-list>
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
                  placeholder="e.g. GenBank"
                  hide-details
                />
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
                    <v-img :src="icons()[association.linkedRecord.type]" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ association.linkedRecord.name }}
                    </v-list-item-title>
                    <span class="text-capitalize">
                      {{ association.linkedRecord.registry }} / {{ cleanString(association.linkedRecord.type) }}
                    </span>
                    <b>- {{ cleanString(association.recordAssocLabel.toUpperCase()) }} -</b>
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
      >
        Save and continue
      </v-btn>
      <v-btn
        :loading="saving"
        class="primary"
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
                    >{{ cleanString(addingRelation.recordAssocLabel).toUpperCase() }}</b>
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
  </v-card>
</template>

<script>
    import { mapState, mapActions, mapGetters } from "vuex"
    import { isEqual } from "lodash"
    import { isRequired } from "@/utils/rules.js"
    import stringUtils from '@/utils/stringUtils';
    import Record from "../../views/Records/Record";

    export default {
        name: "EditRelationships",
        components: {Record},
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
          }
        },
        computed: {
          ...mapState("record", ["sections"]),
          ...mapState("editor", ["icons", "availableRecords", "relationsTypes"]),
          ...mapGetters("editor", ["allowedRelations", "allowedTargets"]),
          associations(){
            return this.sections.relations.data.recordAssociations;
          },
          getAssociations(){
            if (!this.searchAssociations) return this.associations;
            return this.associations.filter(obj => {
              return obj.linkedRecord.name.includes(this.searchAssociations)
            });
          }
        },
        watch: {
          async search() {
            this.loading = true;
            let search = null;
            if (this.search.trim().length >= 3) {
              search = this.search.trim();
            }
            await this.getAvailableRecords({q: search, fairsharingRegistry: this.targets});
            this.loading = false;
          },
          associations: {
            deep: true,
            handler(){
              let changes = 0;
              if (!isEqual(this.sections.relations.initialData, this.sections.relations.data)) changes += 1;
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
            await this.getAvailableRecords({q: null, fairsharingRegistry: this.targets});
            this.loading = false;
          });
        },
        methods: {
          ...mapActions("editor", ["getAvailableRecords", "getAvailableRelationsTypes"]),
          addItem() {
            this.searchAssociations = null;
            let newRelation = {
              linkedRecord: this.addingRelation.linkedRecord,
              recordAssocLabel: this.addingRelation.recordAssocLabel,
              new: true,
            };
            this.sections.relations.data.recordAssociations.push(newRelation);
            this.showRelationsPanel = false;
            this.$nextTick(() => {
              this.$scrollTo('#association_' + this.addingRelation.id, 450, {
                container: '#associatedRecords',
                easing: 'ease-in',
              })
            });
          },
          removeItem(id){
            this.sections.relations.data.recordAssociations.splice(id, 1);
          },
          showOverlay(target){
            this.showRelationsPanel = true;
            this.panelContent = null;
            this.addingRelation = {
              linkedRecord: target,
              recordAssocLabel: null,
              id: target.id
            };
            let prohibited = [];
            this.associations.forEach(association => {
                if (association.linkedRecord.id === target.id) prohibited.push(association.recordAssocLabel)
            });
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
