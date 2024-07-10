
<template>
  <div class="d-flex ruleWrapper">
    <select
      v-model="selectedGeneralRule"
      class="query-builder-group-slot__rule-selection"
    >
      <option
        disabled
        value=""
      >
        Select a rule
      </option>
      <option
        v-for="rule in generalQueryBuilderComponents()"
        :key="rule.identifier"
        :value="rule.identifier"
        v-text="rule.name"
      />
    </select>
    <button
      :disabled="selectedGeneralRule === ''"
      class="query-builder-group-slot__rule-adding-button ml-3"
      @click="addNewRule(groupCtrl, selectedGeneralRule)"
    >
      Add Rule
    </button>
  </div>
</template>

<script>
import {
  Countries,
  Domain,
  Licences,
  Organisations,
  RecordStatus,
  Registry,
  StandardRecordType,
  Subject,
  Taxonomies,
  UserDefinedTag
} from "../index";
export default {
  name: "GeneralRule",
  props: {
    groupCtrl: {
      type: Object,
      default: null
    }
  },
  data: () => {
    return {
      selectedGeneralRule: "",
    };
  },

  methods:{
    generalQueryBuilderComponents() {
      return [
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
      ]
    },

    /**
     * Add rule to query builder
     * @param item - Object
     * @param selectedRule - String
     */
    addNewRule(item, selectedRule) {
      item.addRule(selectedRule)
      this.selectedGeneralRule = ''
    },
  }
};
</script>

