<template>
  <div class="d-flex ruleWrapper">
    <select
      v-model="selectedFairassistRule"
      class="query-builder-group-slot__rule-selection"
    >
      <option disabled value="">Select a FAIRassist rule</option>
      <option
        v-for="rule in fairassistQueryBuilderComponents()"
        :key="rule.identifier"
        :value="rule.identifier"
        v-text="rule.name"
      />
    </select>
    <button
      :disabled="selectedFairassistRule === ''"
      class="query-builder-group-slot__rule-adding-button ml-3"
      @click="addNewRule(groupCtrl, selectedFairassistRule)"
    >
      Add Rule
    </button>
  </div>
</template>

<script>
import { sortBy } from "lodash";

import {
  AssociatedTools,
  FairassistRecordType
} from "../index";
export default {
  name: "FairassistRule",
  props: {
    groupCtrl: {
      type: Object,
      default: null,
    },
  },
  data: () => {
    return {
      selectedFairassistRule: "",
    };
  },

  methods: {
    fairassistQueryBuilderComponents() {
      let fairassistRecordType = [
        {
          identifier: "fairassisttype",
          name: "FAIRassist Record Type",
          component: FairassistRecordType,
          initialValue: () => [],
        },
      ];

      return fairassistRecordType.concat(this.sortedArrayList());
    },

    /**
     * Sort Array list by name
     */
    sortedArrayList() {
      return sortBy(
        [

          {
            identifier: "associatedTools",
            name: "Associated Tools",
            component: AssociatedTools,
            initialValue: "",
          }
        ],
        "name"
      );
    },

    /**
     * Add rule to query builder
     * @param item - Object
     * @param selectedRule - String
     */
    addNewRule(item, selectedRule) {
      item.addRule(selectedRule);
      this.selectedFairassistRule = "";
    },
  },
};
</script>
