
<template>
  <div class="d-flex ruleWrapper">
    <select
      v-model="selectedPolicyRule"
      class="query-builder-group-slot__rule-selection"
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
  DataCitation,
  DataPreservation,
  DataProtection,
  ExceptionsToDataSharing,
  GuidanceToHelpEnableCompliance,
  LicencesForOutputs,
  MandatedDataSharing,
  MandatedDmpCreation,
  MonitoringOfCompliance,
  PolicyRecordType,
  RecommendsDatabase,
  RecommendsStandard,
  SharingResearchSoftware,
  SupportedCosts,
  TimingOfDmp, UpdatingOfDmp
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

