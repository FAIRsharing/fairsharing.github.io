<template>
  <SelectComponent
    v-model="model"
    :item-list="filteredRecordTypes('FAIRassist')"
    :item-value="itemValue"
    :tool-tip-text="toolTipText"
    @input="selectedValue"
  />
</template>
<script>
import { mapActions } from "vuex";

import { recordTypes } from "@/utils/advancedSearchUtils";

import SelectComponent from "../UtilComponents/SelectComponent.vue";

export default {
  name: "FairassistRecordType",
  components: { SelectComponent },
  mixins: [recordTypes],
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
        "The type of record within a FAIRassist registry. Multiple selections will be joined with OR.",
    };
  },
  computed: {
    //To get the full list of records
    // recordTypes() {
    // return this.getRecordTypes.map(({ name }) => name);
    // },
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
  },
  mounted() {
    this.fetchAllRecordTypes();
    //Pre-fill selected values on edit advanced search fields
    this.itemValue = this.value;
  },

  methods: {
    ...mapActions("recordTypes", ["fetchAllRecordTypes"]),
    selectedValue(item) {
      this.itemSelected = item;
    },
  },
};
</script>
