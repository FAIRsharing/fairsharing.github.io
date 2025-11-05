<template>
  <v-card id="editRelationships">
    <v-card-title class="bg-grey-lighten-4 text-blue">
      Edit Relationships
    </v-card-title>
    <Alerts target="relations" />
    <v-card-text class="pt-2">
      <v-container fluid>
        <v-row>
          <!-- LEFT PANEL -->
          <v-col xl="6" lg="6" md="12" sm="12" xs="12">
            <v-card class="my-5 px-4 bg-grey-lighten-3" elevation="5">
              <v-card-title> Available records: </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="search"
                  variant="outlined"
                  label="Refine search"
                  placeholder="e.g. GenBank"
                  hide-details
                  :loading="loading"
                  color="primary"
                  append-inner-icon="fas fa-search"
                  clearable
                />
                <v-container>
                  <v-row no-gutters>
                    <v-col
                      v-for="(
                        filterVal, filterName, filterIndex
                      ) in searchFilters"
                      :key="'filter_' + filterIndex"
                      cols="12"
                      sm="12"
                      xs="12"
                      md="6"
                      lg="6"
                      xl="3"
                      class="text-center"
                    >
                      <!-- switch for unattached records -->
                      <v-switch
                        v-model="searchFilters[filterName]"
                        inset
                        :label="`${prepareFilterName(filterName)}`"
                        color="primary"
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <v-divider thickness="1" class="pa-0 ma-0 border-opacity-100" />
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
                  v-for="(record, index) in recordsList"
                  :key="'availableRecord_' + index"
                  v-model="record.isActive"
                  :options="{
                    threshold: 1,
                  }"
                  class="py-2"
                  transition="fade-transition"
                  height="70px"
                >
                  <div class="d-flex justify-space-between bordered pb-2">
                    <div class="d-flex full-width">
                      <div>
                        <Icon :item="record.type" wrapper-class :height="40" />
                      </div>
                      <div class="mx-4 full-width">
                        <v-list-item-title class="text-pre-wrap">
                          {{ record.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                          class="text-capitalize text-pre-wrap"
                        >
                          {{ record.registry }} / {{ cleanString(record.type) }}
                        </v-list-item-subtitle>
                      </div>
                    </div>
                    <div class="d-flex align-center">
                      <RecordStatus
                        :record="record"
                        :show-only-status="true"
                        :in-edit-form="true"
                      />
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-btn
                            icon
                            class="bg-blue text-white mr-2"
                            v-bind="props"
                            size="36"
                            @click="viewRecord(record)"
                          >
                            <v-icon size="small"> fas fa-eye </v-icon>
                          </v-btn>
                        </template>
                        View Record
                      </v-tooltip>
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-btn
                            icon
                            class="bg-green text-white"
                            v-bind="props"
                            size="36"
                            @click="showOverlay(record)"
                          >
                            <v-icon size="small"> fas fa-arrow-right </v-icon>
                          </v-btn>
                        </template>
                        Add
                      </v-tooltip>
                    </div>
                  </div>
                </v-lazy>
              </v-responsive>
              <div v-else class="scrollZone">
                <Loaders />
              </div>
            </v-card>
          </v-col>

          <!-- RIGHT PANEL -->
          <v-col xl="6" lg="6" md="12" sm="12" xs="12">
            <v-card class="my-5 pl-4 bg-grey-lighten-3" elevation="5">
              <v-card-title>
                <span>Associated records ({{ associations.length }})</span>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="searchAssociations"
                  variant="outlined"
                  label="Search through existing associations names"
                  hide-details
                  color="primary"
                  append-inner-icon="fas fa-search"
                  clearable
                />
                <v-container>
                  <v-row no-gutters>
                    <v-col
                      v-for="(
                        filterVal, filterName, filterIndex
                      ) in labelsFilter"
                      :key="'filter_' + filterIndex"
                      cols="12"
                      sm="12"
                      xs="12"
                      md="6"
                      lg="6"
                      xl="3"
                      class="text-center"
                    >
                      <!-- switches for records that are already linked -->
                      <v-switch
                        v-model="labelsFilter[filterName]"
                        inset
                        color="primary"
                        :label="`${prepareFilterName(filterName)}`"
                      />
                    </v-col>
                  </v-row>
                </v-container>
                <v-divider thickness="1" class="pa-0 ma-0 border-opacity-100" />
              </v-card-text>
              <v-list
                v-if="getAssociations.length > 0"
                id="associatedRecords"
                class="bg-transparent scrollZone pr-3"
              >
                <v-list-item
                  v-for="(association, index) in getAssociations"
                  :id="'association_' + association.linkedRecord.id"
                  :key="'association_' + index"
                  density="compact"
                  ripple
                  class="my-1"
                  :class="{ 'bg-orange-lighten-3': association.new }"
                >
                  <div class="d-flex justify-space-between bordered pb-2">
                    <div>
                      <Icon
                        :item="association.linkedRecord.type"
                        wrapper-class=""
                        :height="40"
                      />
                    </div>
                    <div class="mx-4 full-width">
                      <b v-if="!association.recordAssocLabel.relation"
                        >-
                        {{
                          cleanString(
                            association.recordAssocLabel.toUpperCase(),
                          )
                        }}
                        -</b
                      >
                      <b v-else
                        >-
                        {{
                          cleanString(
                            association.recordAssocLabel.relation.toUpperCase(),
                          )
                        }}
                        -</b
                      >
                      <v-list-item-title
                        style="font-size: 0.8125rem; font-weight: 500"
                        class="text-pre-wrap"
                      >
                        {{ association.linkedRecord.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle
                        class="text-capitalize text-pre-wrap"
                        style="font-size: 14px; font-weight: 400"
                      >
                        {{ association.linkedRecord.registry }} /
                        {{ cleanString(association.linkedRecord.type) }}
                      </v-list-item-subtitle>
                    </div>
                    <div class="d-flex align-center">
                      <RecordStatus
                        :record="association.linkedRecord"
                        :show-only-status="true"
                        :in-edit-form="true"
                      />
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-btn
                            icon
                            class="bg-blue text-white mr-2"
                            v-bind="props"
                            size="36"
                            @click="viewRecord(association.linkedRecord)"
                          >
                            <v-icon size="small"> fas fa-eye </v-icon>
                          </v-btn>
                        </template>
                        View Record
                      </v-tooltip>
                      <v-tooltip location="top">
                        <template #activator="{ props }">
                          <v-btn
                            icon
                            class="bg-red text-white"
                            v-bind="props"
                            size="36"
                            @click="removeItem(association)"
                          >
                            <v-icon size="small"> fas fa-trash </v-icon>
                          </v-btn>
                        </template>
                        Remove Relation
                      </v-tooltip>
                    </div>
                  </div>
                </v-list-item>
              </v-list>
              <v-list v-else class="bg-transparent scrollZone pr-3">
                <v-list-item>
                  This record does not have any associations.
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn
        class="bg-primary"
        :loading="continueLoader"
        variant="elevated"
        style="font-size: 14px"
        @click="saveRecord(false, $event.target)"
      >
        Save and continue
      </v-btn>
      <v-btn
        :loading="exitLoader"
        class="bg-primary"
        variant="elevated"
        style="font-size: 14px"
        @click="saveRecord(true, $event.target)"
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
      <v-container fluid class="py-0">
        <v-row justify="center">
          <v-form
            id="editRecordAssociation"
            ref="editRecordAssociation"
            v-model="formValid"
            style="width: 100%"
          >
            <v-card
              v-if="addingRelation"
              class="flexCard"
              width="100%"
              min-height="450px"
            >
              <v-card-title class="bg-green text-white">
                Add a new relationship
              </v-card-title>
              <v-card-text
                v-if="!panelContent || panelContent.length === 0"
                class="mb-0 pb-0"
              >
                <v-alert type="error" class="mt-3">
                  This source and target can't have relationship.
                </v-alert>
              </v-card-text>

              <v-card-text class="text-center py-3 px-4">
                <div
                  class="pa-3"
                  :class="{
                    'bg-blue-lighten-5': formValid,
                    'bg-red-lighten-5': !formValid,
                  }"
                  style="border-radius: 5px"
                >
                  <div>
                    <b>SOURCE</b>
                    <span class="ml-1">
                      {{ sections.relations.data.name }}
                    </span>
                    <br />
                    <span>
                      ({{ cleanString(sections.relations.data.registry) }} -
                      {{ cleanString(sections.relations.data.type) }})
                    </span>
                  </div>
                  <div>
                    <v-icon
                      size="x-large"
                      class="my-5"
                      :class="{
                        'text-blue': addingRelation.recordAssocLabel,
                        'text-red': !addingRelation.recordAssocLabel,
                      }"
                    >
                      fas fa-arrow-down
                    </v-icon>
                    <b
                      v-if="addingRelation.recordAssocLabel"
                      class="ml-3 doubleUnderline"
                      >{{
                        cleanString(
                          addingRelation.recordAssocLabel.relation,
                        ).toUpperCase()
                      }}</b
                    >
                  </div>
                  <div>
                    <b>TARGET:</b>
                    <span class="ml-1">
                      {{ addingRelation.linkedRecord.name }}
                    </span>
                    <br />
                    <span>
                      ({{ cleanString(addingRelation.linkedRecord.registry) }} -
                      {{ cleanString(addingRelation.linkedRecord.type) }})
                    </span>
                  </div>
                </div>
              </v-card-text>
              <v-card-text v-if="addingRelation" class="pb-0 pt-3">
                <v-autocomplete
                  v-model="addingRelation.recordAssocLabel"
                  :items="panelContent"
                  variant="outlined"
                  return-object
                  item-title="relation"
                  item-value="relation"
                  label="Select the type of relationship"
                  :disabled="!panelContent || panelContent.length === 0"
                  :rules="[rules.isRequired()]"
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="bg-success"
                  :disabled="!formValid"
                  @click="addItem()"
                >
                  Add relation
                </v-btn>
                <v-btn class="bg-error" @click="showRelationsPanel = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-row>
      </v-container>
    </v-dialog>

    <!-- attempt to add duplicate relationship -->
    <v-snackbar
      v-model="duplicateRelationship"
      color="warning"
      class="text-body"
    >
      The same record/relation combination may not be added more than once.
    </v-snackbar>
    <v-snackbar
      v-model="multipleRelationship"
      color="warning"
      class="text-body"
    >
      {{ multipleRelationshipMessage }}
    </v-snackbar>
  </v-card>
</template>

<script>
import { capitalize, isEqual } from "lodash";
import { mapActions, mapGetters, mapState } from "vuex";

import Icon from "@/components/Icon";
import RecordStatus from "@/components/Records/Shared/RecordStatus";
import { isRequired } from "@/utils/rules.js";
import stringUtils from "@/utils/stringUtils";

import Loaders from "../Navigation/Loaders";
import Alerts from "./Alerts";

export default {
  name: "EditRelationships",
  components: { Alerts, Icon, Loaders, RecordStatus },
  mixins: [stringUtils],
  data() {
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
      targetPreview: null,
      rules: {
        isRequired: () => {
          return isRequired();
        },
      },
      labelsFilter: {},
      searchFilters: {},
      initialized: false,
      lastQuery: null,
      duplicateRelationship: false,
      multipleRelationship: false,
      multipleRelationshipMessage: null,
      recordsList: [],
      fairsharingRegistries: [
        "collection",
        "standard",
        "database",
        "policy",
        "fairassist",
      ],
      continueLoader: false,
      exitLoader: false,
    };
  },
  computed: {
    ...mapState("record", ["sections", "currentID", "currentRecord"]),
    ...mapState("users", ["user"]),
    ...mapState("editor", ["availableRecords", "relationsTypes"]),
    ...mapGetters("editor", ["allowedRelations", "allowedTargets"]),
    ...mapGetters("record", ["getSection"]),
    associations() {
      return this.sections.relations.data.recordAssociations;
    },
    getAssociations() {
      if (!this.labelsFilter) return this.associations;
      let searchTerm = this.searchAssociations || "";
      return this.associations.filter((obj) => {
        // Some linkedRecords have a null abbreviation, and so cannot be searched as requested in:
        // https://github.com/FAIRsharing/fairsharing.github.io/issues/1459
        // If it is null, compare the search string only against the name...
        if (obj.linkedRecord.abbreviation == null) {
          if (
            obj.linkedRecord.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) &&
            (this.labelsFilter[obj.linkedRecord.registry.toLowerCase()] ===
              true ||
              this.labelsFilter[obj.linkedRecord.type.toLowerCase()] === true)
          ) {
            return obj;
          }
        }
        // ...otherwise, compare against both name and abbreviation.
        else {
          /* istanbul ignore next */
          if (
            (obj.linkedRecord.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
              obj.linkedRecord.abbreviation
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) &&
            (this.labelsFilter[obj.linkedRecord.registry.toLowerCase()] ||
              this.labelsFilter[obj.linkedRecord.type.toLowerCase()]) === true
          ) {
            return obj;
          }
        }
      });
    },
    message() {
      let error = this.getSection("relations").error;
      return {
        error: error,
        value: this.getSection("relations").message,
      };
    },
  },
  watch: {
    async search() {
      await this.runSearch();
    },
    searchFilters: {
      deep: true,
      async handler() {
        await this.runSearch();
      },
    },
    associations: {
      deep: true,
      handler() {
        let changes = 0;
        if (
          !isEqual(
            this.sections.relations.initialData.recordAssociations,
            this.sections.relations.data.recordAssociations,
          )
        ) {
          changes += 1;
        }
        this.$store.commit("record/setChanges", {
          section: "relations",
          value: changes,
        });
      },
    },
  },
  mounted() {
    this.$nextTick(async function () {
      this.loading = true;
      await this.getAvailableRelationsTypes();
      this.targets = this.allowedTargets(
        this.sections.relations.data.registry.toLowerCase(),
      );
      this.getRelations();
      this.loading = false;
      this.initialized = true;
    });
  },
  methods: {
    ...mapActions("editor", [
      "getAvailableRecords",
      "getAvailableRelationsTypes",
    ]),
    ...mapActions("record", ["updateRelations"]),
    capitalize,
    addItem() {
      let _module = this;
      _module.searchAssociations = null;
      Object.keys(_module.labelsFilter).forEach((filter) => {
        _module.labelsFilter[filter] = true;
      });
      let exists = this.associations.find(function (link) {
        let tmpRelation;
        if (typeof link.recordAssocLabel.relation == "undefined") {
          tmpRelation = link.recordAssocLabel;
        }
        else {
          tmpRelation = link.recordAssocLabel.relation;
        }
        return (
          link.linkedRecord.name === _module.addingRelation.linkedRecord.name &&
          tmpRelation === _module.addingRelation.recordAssocLabel.relation
        );
      });
      // Check if a duplicate relation is being added.
      if (exists) {
        _module.duplicateRelationship = true;
        return;
      }
      // Check if the user is trying to add multiple examples of FAIRassist relations.
      // https://github.com/FAIRsharing/FAIRsharing-API/issues/1137
      if (
        _module.currentRecord.fairsharingRecord.type === "metric" ||
        _module.currentRecord.fairsharingRecord.type === "principle"
      ) {
        let parts_of =
          _module.sections.relations.data.recordAssociations.filter((item) => {
            return item.recordAssocLabel === "part_of";
          });
        if (
          parts_of.length > 0 &&
          _module.addingRelation.recordAssocLabel.relation === "part_of"
        ) {
          _module.multipleRelationship = true;
          _module.multipleRelationshipMessage =
            "A principle or metric can be part of no more than 1 other of the same type.";
          return;
        }
      }
      // Finally get to add the new relation.
      let newRelation = {
        linkedRecord: _module.addingRelation.linkedRecord,
        recordAssocLabel: _module.addingRelation.recordAssocLabel,
        new: true,
      };
      _module.sections.relations.data.recordAssociations.unshift(newRelation);
      _module.showRelationsPanel = false;
      _module.$nextTick(() => {
        _module.$scrollTo("#association_" + _module.addingRelation.id, 450, {
          container: "#associatedRecords",
          easing: "ease-in",
        });
      });
    },
    removeItem(selected) {
      //this.sections.relations.data.recordAssociations.splice(id, 1);
      let newData = this.sections.relations.data.recordAssociations.filter(
        (item) => {
          if (
            item.linkedRecord.id == selected.linkedRecord.id &&
            item.recordAssocLabelId == selected.recordAssocLabelId
          ) {
            return false;
          }
          return true;
        },
      );
      this.sections.relations.data.recordAssociations = newData;
    },
    showOverlay(target) {
      this.showRelationsPanel = true;
      this.panelContent = null;
      this.addingRelation = {
        linkedRecord: target,
        recordAssocLabel: null,
        id: target.id,
      };
      let prohibited = [];
      this.panelContent = this.allowedRelations({
        target: {
          registry: target.registry.toLowerCase(),
          type: target.type.toLowerCase(),
        },
        sourceRegistry: this.sections.relations.data.registry.toLowerCase(),
        sourceType: this.sections.relations.data.type.toLowerCase(),
        prohibited: prohibited,
      });
      this.$nextTick(() => {
        this.$refs["editRecordAssociation"].validate();
      });
    },
    viewRecord(record) {
      window.open("/" + record.id, "_blank");
    },
    getRelations() {
      let labelsFilter = {};
      let allRegistries = [
        "standard",
        "database",
        "collection",
        "policy",
        "fairassist",
      ];
      let types = [];
      let allowedRelations = this.allowedRelations({
        target: null,
        sourceRegistry: this.sections.relations.data.registry.toLowerCase(),
        sourceType: this.sections.relations.data.type.toLowerCase(),
        prohibited: null,
      });
      allowedRelations.forEach((allowedRelation) => {
        if (!Object.keys(labelsFilter).includes(allowedRelation.target)) {
          /* istanbul ignore else */
          if (allRegistries.includes(allowedRelation.target.toLowerCase())) {
            labelsFilter[allowedRelation.target] = true;
            allRegistries.splice(
              allRegistries.indexOf(allowedRelation.target.toLowerCase()),
              1,
            );
          }
          else {
            // This must therefore be a record type.
            labelsFilter[allowedRelation.target] = true;
            types.push(allowedRelation.target);
          }
        }
      });
      this.labelsFilter = { ...labelsFilter };
      this.searchFilters = { ...labelsFilter };
    },
    async runSearch() {
      let _module = this;
      this.loading = true;
      let search = null;
      if (this.search && this.search.trim().length >= 3) {
        search = this.search.trim();
      }
      let registries = [];
      let types = [];
      Object.keys(this.searchFilters).forEach((filter) => {
        if (this.searchFilters[filter]) {
          // Check if this is a registry or type
          if (this.fairsharingRegistries.indexOf(filter) > -1) {
            registries.push(filter);
          }
          else {
            types.push(filter);
          }
        }
      });
      this.lastQuery = search;
      await _module.getAvailableRecords({
        q: search,
        fairsharingRegistry: registries,
        recordType: types,
        excludeId: _module.currentID,
        searchAnd: false,
      });
      let i = 0;
      this.availableRecords.forEach((rec) => {
        rec.isActive = i < 15; // activate the 15 first items for v-lazy.
        i += 1;
      });

      if (search === this.lastQuery) {
        this.recordsList = this.availableRecords;
      }
      if (search === this.lastQuery) this.loading = false;
    },
    async saveRecord(redirect, item) {
      if (item.textContent.trim() === "Save and continue") {
        this.continueLoader = true;
        this.exitLoader = false;
      }
      else if (item.textContent.trim() === "Save and exit") {
        this.continueLoader = false;
        this.exitLoader = true;
      }
      await this.updateRelations({
        token: this.user().credentials.token,
        source: this.$route.params.id,
      });
      this.continueLoader = false;
      this.exitLoader = false;
      if (!redirect) {
        this.$scrollTo("#mainHeader");
        this.$store.commit("record/setChanges", {
          section: "relations",
          value: 0,
        });
      }
      if (redirect && !this.message.error) {
        await this.$router.push({ path: "/" + this.$route.params.id });
      }
    },
    prepareFilterName(name) {
      if (name == "fairassist") {
        return "FAIRassist";
      }
      return capitalize(name) + "(s)";
    },
  },
};
</script>

<style lang="scss" scoped>
.scrollZone {
  height: 50vh;
  width: 100%;
  overflow-y: scroll;
}

.bordered {
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
:deep(.v-switch__track) {
  opacity: 1;
}
</style>
