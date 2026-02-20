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
  name: "RecordStatus",
  components: { SelectComponent },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {
      itemList: ["ready", "deprecated", "uncertain", "in_development"],
      itemSelected: [],
      itemValue: [],
      toolTipText:
        "The status of this resource. Multiple selections will be joined with OR.",
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
