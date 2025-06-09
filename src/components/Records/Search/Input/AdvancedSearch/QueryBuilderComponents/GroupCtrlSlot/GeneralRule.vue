
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
        Select a generic rule
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
  HasPublication,
  Licences,
  ObjectTypes,
  Organisations,
  RecordStatus,
  Registry,
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
          identifier: "hasPublication",
          name: "Has Publication",
          component: HasPublication,
          initialValue: "",
        },
        {
          identifier: "objectTypes",
          name: "Object Types",
          component: ObjectTypes,
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

