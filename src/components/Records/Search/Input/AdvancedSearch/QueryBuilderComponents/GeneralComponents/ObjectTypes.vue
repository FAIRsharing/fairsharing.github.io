<template>
  <AutoCompleteComponent
    v-model="model"
    :item-value="itemValue"
    :item-list="getObjectTypes"
    :loading="getLoadingData"
    :tool-tip-text="toolTipText"
    @input="selectedValue"
    @fetch-data="getResults"
  />
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import objectTypes from "@/store";

import AutoCompleteComponent from "../UtilComponents/AutoCompleteComponent.vue";

export default {
  name: "ObjectTypes",
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
      toolTipText:
        "Object types applicable to this resource or its data. Multiple selections will be joined with OR. Start typing to see available types.",
    };
  },

  computed: {
    ...mapGetters("objectTypes", ["getObjectTypes", "getLoadingData"]),
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
            objectTypes.commit("objectTypes/setObjectTypes", this.value);
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
    ...mapActions("objectTypes", ["fetchObjectTypes"]),

    selectedValue(item) {
      this.itemSelected = item;
    },
    getResults(queryParams) {
      if (queryParams) this.fetchObjectTypes(queryParams);
    },
  },
};
</script>
