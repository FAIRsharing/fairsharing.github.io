
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
        Select a standards rule
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
  IsImplemented,
} from "../index";
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

