
<template>
  <div class="d-flex ruleWrapper">
    <select
      v-model="selectedStandardRule"
      class="query-builder-group-slot__rule-selection"
    >
      <option
        disabled
        value=""
      >
        Select a standards rule
      </option>
      <option
        v-for="rule in standardQueryBuilderComponents()"
        :key="rule.identifier"
        :value="rule.identifier"
        v-text="rule.name"
      />
    </select>
    <button
      :disabled="selectedStandardRule === ''"
      class="query-builder-group-slot__rule-adding-button ml-3"
      @click="addNewRule(groupCtrl, selectedStandardRule)"
    >
      Add Rule
    </button>
  </div>
</template>

<script>

import {
  GloballyUnique,
  IsImplemented,
  Persistent,
  Resolvable,
  StandardRecordType} from "../index";
export default {
  name: "StandardRule",
  props: {
    groupCtrl: {
      type: Object,
      default: null
    }
  },
  data: () => {
    return {
      selectedStandardRule: "",
    };
  },

  methods:{
    standardQueryBuilderComponents() {
      return [
        {
          identifier: "standardtype",
          name: "Standard Record Type",
          component: StandardRecordType,
          initialValue: () => [],
        },
        {
          identifier: "isImplemented",
          name: "Is Implemented",
          component: IsImplemented,
          initialValue: "",
        },
        {
          identifier: "globallyUnique",
          name: "Globally Unique",
          component: GloballyUnique,
          initialValue: "",
        },
        {
          identifier: "persistent",
          name: "Persistent",
          component: Persistent,
          initialValue: "",
        },
        {
          identifier: "resolvable",
          name: "Resolvable",
          component: Resolvable,
          initialValue: "",
        }
      ]
    },

    /**
     * Add rule to query builder
     * @param item - Object
     * @param selectedRule - String
     */
    addNewRule(item, selectedRule) {
      item.addRule(selectedRule)
      this.selectedStandardRule = ''
    },
  }
};
</script>

