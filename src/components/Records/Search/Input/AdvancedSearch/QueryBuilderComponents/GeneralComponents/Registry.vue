<template>
  <div class="d-flex width-90">
    <TooltipComponent :tool-tip-text="toolTipText" />
    <SelectComponent
      v-model="model"
      :item-value="itemValue"
      :item-list="registryTypes"
      @input="selectedValue"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import SelectComponent from "../UtilComponents/SelectComponent.vue";
import TooltipComponent from "../UtilComponents/TooltipComponent.vue";

export default {
  name: "Registry",
  components: { SelectComponent, TooltipComponent },
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
      toolTipText: "The FAIRsharing Registry to which this resource belongs, e.g. Standard, Database or Policy. Multiple selections will be joined with OR.",
    };
  },
  computed: {
    ...mapGetters("recordTypes", ["getRecordTypes"]),
    registryTypes() {
      const registry = this.getRecordTypes.map(({ fairsharingRegistry }) =>
        fairsharingRegistry["name"].toLowerCase()
      );
      return [...new Set(registry)];
    },
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
    //Pre-fill selected values on edit advanced search is clicked and open
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
