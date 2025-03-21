<template>
   <AutoCompleteComponent
      v-model="model"
      :item-value="itemValue"
      :item-list="getSearchSubjects"
      :loading="getLoadingStatus"
      :tool-tip-text="toolTipText"
      @input="selectedValue"
      @fetch-data="getResults"
    />
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import subjectSearch from "@/store";

import AutoCompleteComponent from "../UtilComponents/AutoCompleteComponent.vue";

export default {
  name: "Subject",
  components: { AutoCompleteComponent },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["input"],
  data: () => {
    return {
      itemSelected: [],
      itemValue: [],
      toolTipText:
        "Tags from the FAIRsharing subject ontology. Multiple selections will be joined with OR. Start typing to see Subject tags.",
    };
  },

  computed: {
    ...mapGetters("subjectSearch", ["getSearchSubjects", "getLoadingStatus"]),
    ...mapGetters("advancedSearch", ["getEditDialogStatus"]),
    model: {
      get() {
        return this.itemSelected;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  watch: {
    itemSelected(newValue) {
      this.itemValue = newValue;
    },
    /**
     * Item list for the autocomplete should not be empty
     * It is assigned with selected values when edit field is opened
     */
    getEditDialogStatus: {
      handler(open) {
        if (open) {
          if (this.value && this.value.length) {
            subjectSearch.commit("subjectSearch/setSearchSubjects", this.value);
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    //Pre-fill selected values on edit advanced search is clicked and open
    this.selectedItemValue = this.value;
  },

  methods: {
    ...mapActions("subjectSearch", ["fetchSearchSubjects"]),
    selectedValue(item) {
      this.itemSelected = item;
    },
    getResults(queryParams) {
      if (queryParams) this.fetchSearchSubjects(queryParams);
    },
  },
};
</script>
