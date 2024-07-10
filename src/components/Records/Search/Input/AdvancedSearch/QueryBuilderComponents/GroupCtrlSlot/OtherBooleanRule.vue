
<template>
  <div class="d-flex ruleWrapper">
    <select
      v-model="selectedOtherBooleanRule"
      class="query-builder-group-slot__rule-selection"
    >
      <option
        disabled
        value=""
      >
        Select an additional rule
      </option>
      <option
        v-for="rule in otherBooleanQueryBuilderComponents()"
        :key="rule.identifier"
        :value="rule.identifier"
        v-text="rule.name"
      />
    </select>
    <button
      :disabled="selectedOtherBooleanRule === ''"
      class="query-builder-group-slot__rule-adding-button ml-3"
      @click="addNewRule(groupCtrl, selectedOtherBooleanRule)"
    >
      Add Rule
    </button>
  </div>
</template>

<script>
import { sortBy } from "lodash"

import {
  GuidanceToHelpEnableCompliance,
  HasPublication,
  IsImplemented,
  MonitoringOfCompliance,
  RecommendsDatabase,
  RecommendsStandard,
  UpdatingOfDmp,
  UsesPersistentIdentifier} from "../index";
export default {
  name: "OtherBooleanRule",
  props: {
    groupCtrl: {
      type: Object,
      default: null
    }
  },
  data: () => {
    return {
      selectedOtherBooleanRule: "",
    };
  },

  methods:{
    otherBooleanQueryBuilderComponents() {
      return sortBy([
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
          name: "Recommends Database",
          component: RecommendsDatabase,
          initialValue: "",
        },
        {
          identifier: "recommendsStandard",
          name: "Recommends Standard",
          component: RecommendsStandard,
          initialValue: "",
        },
        {
          identifier: "updatingOfDmp",
          name: "Updating Of Dmp",
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
      ], "name")
    },

    /**
     * Add rule to query builder
     * @param item - Object
     * @param selectedRule - String
     */
    addNewRule(item, selectedRule) {
      item.addRule(selectedRule)
      this.selectedOtherBooleanRule = ''
    },
  }
};
</script>

