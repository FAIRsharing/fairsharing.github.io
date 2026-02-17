<template>
  <RadioComponent
    v-model="model"
    :item-value="itemValue"
    @input="selectedValue"
  />
</template>

<script>
import RadioComponent from "../UtilComponents/RadioComponent.vue";

export default {
  name: "NegativeExamples",
  components: { RadioComponent },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data: () => {
    return {
      itemValue: "",
      toolTipText: "Metric with negative test examples.",
    };
  },
  computed: {
    model: {
      get() {
        return this.value;
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
