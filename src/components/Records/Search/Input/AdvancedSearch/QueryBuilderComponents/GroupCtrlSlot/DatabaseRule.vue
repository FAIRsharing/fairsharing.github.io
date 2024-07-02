
<template>
  <!-- General Component -->
  <div class="d-flex">
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
import {
  DataAccessCondition,
  DatabaseRecordType,
  DataCuration,
  DataDepositionCondition,
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
      return [
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
      ]
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

