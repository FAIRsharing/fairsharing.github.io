<template>
  <SelectComponent
    v-model="model"
    :item-value="itemValue"
    :item-list="itemList"
    :tool-tip-text="toolTipText"
    @input="selectedValue"
  />
</template>

<script>
import SelectComponent from "../UtilComponents/SelectComponent.vue";

export default {
  name: "MandatedDmpCreation",
  components: { SelectComponent },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {
      itemList: ["required", "suggested", "not covered", "other"],
      itemSelected: [],
      itemValue: [],
      toolTipText:
        "Mandates the development of a data management plan. Multiple selections will be joined with OR.",
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
    //Pre-fill selected values on edit advanced search fields
    this.itemValue = this.value;
  },

  methods: {
    selectedValue(item) {
      this.itemSelected = item;
    },
  },
};
</script>
