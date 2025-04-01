<template>
  <div class="d-flex width-90 align-center">
    <SelectComponent
      v-model="model"
      :item-value="itemValue"
      :item-list="filteredRecordTypes('Database')"
      :tool-tip-text="toolTipText"
      @input="selectedValue"
    />
  </div>
</template>
<script>
import { mapActions } from "vuex";

import { recordTypes } from "@/utils/advancedSearchUtils";

import SelectComponent from "../UtilComponents/SelectComponent.vue";

export default {
  name: "DatabaseRecordType",
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
        "The type of record within a FAIRsharing Database registry. Multiple selections will be joined with OR.",
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
