<template>
  <div class="d-flex width-90">
    <TooltipComponent :tool-tip-text="toolTipText" />
    <SelectComponent
      v-model="model"
      :item-value="itemValue"
      :item-list="filteredRecordTypes('Standard')"
      @input="selectedValue"
    />
  </div>
</template>
<script>
import { mapActions } from "vuex";

import { recordTypes } from "@/utils/advancedSearchUtils";

import SelectComponent from "../UtilComponents/SelectComponent.vue";
import TooltipComponent from "../UtilComponents/TooltipComponent.vue";

export default {
  name: "StandardRecordType",
  components: { TooltipComponent, SelectComponent },
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
        "The type of record within a FAIRsharing Standard registry. Multiple selections will be joined with OR.",
    };
  },
  computed: {
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
