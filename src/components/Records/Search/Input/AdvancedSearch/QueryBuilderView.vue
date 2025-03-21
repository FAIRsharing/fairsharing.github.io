<template>
  <query-builder
    v-model="query"
    :config="config"
  >
    <!-- To use the custom text instead of default text 'Operator' -->

    <template #groupOperator="props">
      <div class="query-builder-group__group-selection">
        <div class="tooltip">
          <v-icon
            size="small"
            class="mr-1 text-white tooltipIcon"
          >
            fas fa-question-circle
          </v-icon>
          <span class="tooltiptext" />
        </div>
        <span class="query-builder-group__group-operator">
          Select an Operator to apply across all groups
        </span>
        <select
          class="operatorSelect"
          :value="props.currentOperator"
          @input="props.updateCurrentOperator($event.target.value)"
        >
          <option
            disabled
            value=""
          >
            Select an operator
          </option>
          <option
            v-for="operator in props.operators"
            :key="operator.identifier"
            :value="operator.identifier"
            v-text="operator.name"
          />
        </select>
      </div>
    </template>
    <template #groupControl="props">
      <GroupCtrlSlot :group-ctrl="props" />
    </template>
  </query-builder>
</template>

<script>
import QueryBuilder from "query-builder-vue-3";
import { mapGetters } from "vuex";

import advancedSearch from "@/store";
import { uniqueValues } from "@/utils/advancedSearchUtils";

import {
  AssociatedTools,
  CertificationsAndCommunityBadges,
  CitationToRelatedPublications,
  Countries,
  DataAccessCondition,
  DataAccessForPrePublicationReview, DataAvailabilityStatement,
  DatabaseRecordType,
  DataCitation,
  DataContactInformation,
  DataCuration,
  DataDepositionCondition,
  DataPreservation,
  DataPreservationPolicy,
  DataProcessesAndConditions,
  DataProtection,
  DataVersioning,
  Domain,
  ExceptionsToDataSharing,
  GroupCtrlSlot,
  GuidanceToHelpEnableCompliance,
  HasPublication,
  IsImplemented,
  Licences,
  LicencesForOutputs,
  MandatedDataSharing,
  MandatedDmpCreation,
  MonitoringOfCompliance,
  Organisations,
  PolicyRecordType,
  RecommendsDatabase,
  RecommendsStandard,
  RecordStatus,
  Registry,
  ResourceSustainability,
  SharingResearchSoftware,
  StandardRecordType,
  Subject,
  SupportedCosts,
  Taxonomies,
  TimingOfDmp,
  UpdatingOfDmp,
  UserDefinedTag,
  UsesPersistentIdentifier
} from "./QueryBuilderComponents"

export default {
  name: "QueryBuilderView",
  components: { QueryBuilder, GroupCtrlSlot },
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      query: {
        operatorIdentifier: "_and",
        children: [],
      },
    };
  },
  computed: {
    ...mapGetters("advancedSearch", [
      "getEditDialogStatus",
      "getEditAdvancedSearch",
    ]),
    config() {
      return {
        operators: [
          {
            name: "AND",
            identifier: "_and",
          },
          {
            name: "OR",
            identifier: "_or",
          },
        ],
        rules: [
          {
            identifier: "registry",
            name: "Registry",
            component: Registry,
            initialValue: () => [],
          },
          {
            identifier: "standardtype",
            name: "Standard Record Type",
            component: StandardRecordType,
            initialValue: () => [],
          },
          {
            identifier: "policytype",
            name: "Policy Record Type",
            component: PolicyRecordType,
            initialValue: () => [],
          },
          {
            identifier: "subjects",
            name: "Subject",
            component: Subject,
            initialValue: () => [],
          },
          {
            identifier: "domains",
            name: "Domain",
            component: Domain,
            initialValue: () => [],
          },
          {
            identifier: "userDefinedTags",
            name: "User Defined Tag",
            component: UserDefinedTag,
            initialValue: () => [],
          },
          {
            identifier: "status",
            name: "Record Status",
            component: RecordStatus,
            initialValue: () => [],
          },
          {
            identifier: "taxonomies",
            name: "Taxonomies",
            component: Taxonomies,
            initialValue: () => [],
          },
          {
            identifier: "licences",
            name: "Licences",
            component: Licences,
            initialValue: () => [],
          },
          {
            identifier: "countries",
            name: "Countries",
            component: Countries,
            initialValue: () => [],
          },
          {
            identifier: "organisations",
            name: "Organisations",
            component: Organisations,
            initialValue: () => [],
          },
          {
            identifier: "databasetype",
            name: "Database Record Type",
            component: DatabaseRecordType,
            initialValue: () => [],
          },
          {
            identifier: "dataCuration",
            name: "Data Curation",
            component: DataCuration,
            initialValue: () => [],
          },
          {
            identifier: "dataDepositionCondition",
            name: "Data Deposition Condition",
            component: DataDepositionCondition,
            initialValue: () => [],
          },
          {
            identifier: "dataAccessCondition",
            name: "Data Access Condition",
            component: DataAccessCondition,
            initialValue: () => [],
          },
          {
            identifier: "citationToRelatedPublications",
            name: "Citation To Related Publications",
            component: CitationToRelatedPublications,
            initialValue: () => [],
          },
          {
            identifier: "dataAccessForPrePublicationReview",
            name: "Data Access For Pre Publication Review",
            component: DataAccessForPrePublicationReview,
            initialValue: () => [],
          },
          {
            identifier: "dataContactInformation",
            name: "Data Contact Information",
            component: DataContactInformation,
            initialValue: () => [],
          },
          {
            identifier: "dataVersioning",
            name: "Data Versioning",
            component: DataVersioning,
            initialValue: () => [],
          },
          {
            identifier: "associatedTools",
            name: "Associated Tools",
            component: AssociatedTools,
            initialValue: "",
          },
          {
            identifier: "certificationsAndCommunityBadges",
            name: "Certifications And Community Badges",
            component: CertificationsAndCommunityBadges,
            initialValue: "",
          },
          {
            identifier: "dataProcessesAndConditions",
            name: "Data Processes And Conditions",
            component: DataProcessesAndConditions,
            initialValue: "",
          },
          {
            identifier: "dataPreservationPolicy",
            name: "Data Preservation Policy",
            component: DataPreservationPolicy,
            initialValue: "",
          },
          {
            identifier: "resourceSustainability",
            name: "Resource Sustainability",
            component: ResourceSustainability,
            initialValue: "",
          },
          {
            identifier: "dataAvailabilityStatement",
            name: "Data Availability Statement",
            component: DataAvailabilityStatement,
            initialValue: "",
          },
          {
            identifier: "dataProtection",
            name: "Data Protection",
            component: DataProtection,
            initialValue: "",
          },
          {
            identifier: "dataCitation",
            name: "Data Citation",
            component: DataCitation,
            initialValue: "",
          },
          {
            identifier: "dataPreservation",
            name: "Data Preservation",
            component: DataPreservation,
            initialValue: "",
          },
          {
            identifier: "exceptionsToDataSharing",
            name: "Exceptions To Data Sharing",
            component: ExceptionsToDataSharing,
            initialValue: "",
          },
          {
            identifier: "mandatedDataSharing",
            name: "Mandated Data Sharing",
            component: MandatedDataSharing,
            initialValue: () => [],
          },
          {
            identifier: "mandatedDmpCreation",
            name: "Mandated DMP Creation",
            component: MandatedDmpCreation,
            initialValue: () => [],
          },
          {
            identifier: "sharingResearchSoftware",
            name: "Sharing Research Software",
            component: SharingResearchSoftware,
            initialValue: () => [],
          },
          {
            identifier: "timingOfDmp",
            name: "Timing Of DMP",
            component: TimingOfDmp,
            initialValue: () => [],
          },
          {
            identifier: "licencesForOutputs",
            name: "Licences For Outputs",
            component: LicencesForOutputs,
            initialValue: "",
          },
          {
            identifier: "supportedCosts",
            name: "Supported Costs",
            component: SupportedCosts,
            initialValue: "",
          },
          {
            identifier: "isImplemented",
            name: "Is Implemented",
            component: IsImplemented,
            initialValue: "",
          },
          {
            identifier: "hasPublication",
            name: "Has Publication",
            component: HasPublication,
            initialValue: "",
          },
          {
            identifier: "usesPersistentIdentifier",
            name: "Uses Persistent Identifier",
            component: UsesPersistentIdentifier,
            initialValue: "",
          },
          {
            identifier: "recommendsDatabase",
            name: "Recommends At Least One Database",
            component: RecommendsDatabase,
            initialValue: "",
          },
          {
            identifier: "recommendsStandard",
            name: "Recommends At Least One Standard",
            component: RecommendsStandard,
            initialValue: "",
          },
          {
            identifier: "updatingOfDmp",
            name: "Updating of DMP",
            component: UpdatingOfDmp,
            initialValue: "",
          },
          {
            identifier: "guidanceToHelpEnableCompliance",
            name: "Guidance To Help Enable Compliance",
            component: GuidanceToHelpEnableCompliance,
            initialValue: "",
          },
          {
            identifier: "monitoringOfCompliance",
            name: "Monitoring Of Compliance",
            component: MonitoringOfCompliance,
            initialValue: "",
          },

        ],
        colors: ["#599C0F", "#CB9221", "#A04545"],
      };
    },

    /**
     * Removes duplicate entries and return unique values
     * @returns {Object}
     */
    uniqueGetEditAdvancedSearch() {
      let searchValues = {
        operatorIdentifier: this.getEditAdvancedSearch["operatorIdentifier"],
        children: [],
      };
      if (
        this.getEditAdvancedSearch["children"] &&
        this.getEditAdvancedSearch["children"].length
      ) {
        this.getEditAdvancedSearch["children"].forEach((item) => {
          if (item["children"] && item["children"].length) {
            let fieldsObj = {
              operatorIdentifier: item["operatorIdentifier"],
              children: uniqueValues(item["children"]),
            };
            searchValues["children"].push(fieldsObj);
          }
        });
      }
      return searchValues;
    },
  },

  watch: {
    query(newValue) {
      newValue = JSON.parse(JSON.stringify(newValue))
      console.log("newValue::", newValue)
      advancedSearch.commit("advancedSearch/setAdvancedSearch", newValue);
      //Updating edit advanced search only if newValue has some data
      if (newValue["children"] && newValue["children"].length) {
        newValue["children"].forEach((item) => {
          if (item["children"] && item["children"].length) {
            advancedSearch.commit(
              "advancedSearch/setEditAdvancedSearch",
              newValue
            );
          }
        });
      }
    },

    /**
     * Reset the dialog box when closed and opened again
     * @param open - Boolean
     */
    isDialog: {
      handler(open) {
        //On click of Reset/Open Advanced search button
        if (open && !this.getEditDialogStatus) {
          this.query = {
            operatorIdentifier: "_and",
            children: [
              {
                operatorIdentifier: "_and",
                children: [],
              },
            ],
          };
        }
      },
      immediate: true,
    },

    /**
     * Populate the dialog box with advanced search selection
     * @param open - Boolean
     */
    getEditDialogStatus: {
      handler(open) {
        if (open) {
          this.query = this.uniqueGetEditAdvancedSearch;
        }
      },
      immediate: true,
    },
  },

};
</script>
<style lang="scss" scoped>
@use "vuetify/settings";
//@use "@/styles/queryBuilderView";
//@use "../../../styles/queryBuilderView.scss";
</style>
