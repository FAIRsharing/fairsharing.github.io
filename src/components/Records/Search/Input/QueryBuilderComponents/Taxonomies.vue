<template>
  <AutoCompleteComponent
    v-model="model"
    :item-value="itemValue"
    :item-list="getSearchTaxonomies"
    @input="selectedValue"
    @fetchData="getResults"
  />
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import taxonomiesSearch from "@/store";

import AutoCompleteComponent from "./AutoCompleteComponent.vue";

export default {
  name: "Taxonomies",
  components: { AutoCompleteComponent },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {
      itemSelected: [],
      itemValue: [],
    };
  },

  computed: {
    ...mapGetters("taxonomiesSearch", ["getSearchTaxonomies"]),
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
            taxonomiesSearch.commit(
              "taxonomiesSearch/setSearchTaxonomies",
              this.value
            );
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    //Pre-fill selected values on edit advanced search is clicked and open
    this.itemValue = this.value;
  },
  methods: {
    ...mapActions("taxonomiesSearch", ["fetchSearchTaxonomies"]),

    selectedValue(item) {
      this.itemSelected = item;
    },
    getResults(queryParams) {
      if (queryParams) this.fetchSearchTaxonomies(queryParams);
    },
  },
};
</script>
