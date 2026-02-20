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
  name: "DataAccessCondition",
  components: { SelectComponent },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {
      itemList: ["open", "partially open", "controlled", "not found"],
      itemSelected: [],
      itemValue: [],
      toolTipText:
        "Data access mechanisms and terms to define access at repository and/or dataset level; what is the process through which access can be requested (and granted)? For example, if the data is freely available or subject to a request and approval process. Multiple selections will be joined with OR.",
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
