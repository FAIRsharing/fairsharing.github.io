
<template>
  <div class="d-flex mr-4">
    <select
      v-model="selectedPolicyRule"
      class="query-builder-group-slot__rule-selection mb-3"
    >
      <option
        disabled
        value=""
      >
        Select a policy rule
      </option>
      <option
        v-for="rule in policyQueryBuilderComponents()"
        :key="rule.identifier"
        :value="rule.identifier"
        v-text="rule.name"
      />
    </select>
    <button
      :disabled="selectedPolicyRule === ''"
      class="query-builder-group-slot__rule-adding-button ml-3"
      @click="addNewRule(groupCtrl, selectedPolicyRule)"
    >
      Add Rule
    </button>
  </div>
</template>

<script>
import { sortBy } from "lodash"

import {
  DataAvailabilityStatement,
  DataCitation, DataPreservation,
  DataProtection,
  ExceptionsToDataSharing,
  MandatedDataSharing,
  MandatedDmpCreation,
  PolicyRecordType,
  SharingResearchSoftware,
  TimingOfDmp
} from "../index";
export default {
  name: "PolicyRule",
  props: {
    groupCtrl: {
      type: Object,
      default: null
    }
  },
  data: () => {
    return {
      selectedPolicyRule: "",
    };
  },

  methods:{
    policyQueryBuilderComponents() {
      return sortBy([
        {
          identifier: "policytype",
          name: "Policy Record Type",
          component: PolicyRecordType,
          initialValue: () => [],
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
          name: "Mandated Dmp Creation",
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
          name: "Timing Of Dmp",
          component: TimingOfDmp,
          initialValue: () => [],
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
      this.selectedPolicyRule = ''
    },
  }
};
</script>

