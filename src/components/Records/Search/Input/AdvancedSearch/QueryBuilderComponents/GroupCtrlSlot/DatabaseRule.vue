
<template>
  <div class="d-flex mr-4">
    <select
      v-model="selectedDatabaseRule"
      class="query-builder-group-slot__rule-selection mb-3"
    >
      <option
        disabled
        value=""
      >
        Select a database rule
      </option>
      <option
        v-for="rule in databaseQueryBuilderComponents()"
        :key="rule.identifier"
        :value="rule.identifier"
        v-text="rule.name"
      />
    </select>
    <button
      :disabled="selectedDatabaseRule === ''"
      class="query-builder-group-slot__rule-adding-button ml-3"
      @click="addNewRule(groupCtrl, selectedDatabaseRule)"
    >
      Add Rule
    </button>
  </div>
</template>

<script>
import { sortBy } from "lodash"

import {
  AssociatedTools,
  CertificationsAndCommunityBadges,
  CitationToRelatedPublications,
  DataAccessCondition,
  DataAccessForPrePublicationReview,
  DatabaseRecordType,
  DataContactInformation,
  DataCuration,
  DataDepositionCondition,
  DataPreservationPolicy,
  DataProcessesAndConditions,
  DataVersioning,
  ResourceSustainability
} from "../index";
export default {
  name: "DatabaseRule",
  props: {
    groupCtrl: {
      type: Object,
      default: null
    }
  },
  data: () => {
    return {
      selectedDatabaseRule: "",
    };
  },

  methods:{
    databaseQueryBuilderComponents() {
      return sortBy([
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
          name: "Data Access Condition ",
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
      ], "name")
    },

    /**
     * Add rule to query builder
     * @param item - Object
     * @param selectedRule - String
     */
    addNewRule(item, selectedRule) {
      item.addRule(selectedRule)
      this.selectedDatabaseRule = ''
    },
  }
};
</script>

