<template>
  <SelectComponent
    v-model="model"
    :item-value="itemValue"
    :item-list="itemList"
    @input="selectedValue"
  />
</template>

<script>
import SelectComponent from "./SelectComponent.vue";

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
