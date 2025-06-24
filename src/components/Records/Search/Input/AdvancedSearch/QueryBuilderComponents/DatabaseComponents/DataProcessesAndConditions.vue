<template>
    <RadioComponent
      v-model="model"
      :item-value="itemValue"
      :tool-tip-text="toolTipText"
      @input="selectedValue"
    />
</template>

<script>
import RadioComponent from "../UtilComponents/RadioComponent.vue";

export default {
  name: "DataProcessesAndConditions",
  components: { RadioComponent },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data: () => {
    return {
      itemValue:"",
      toolTipText: "Stores metadata regarding human (i.e. user interfaces) and machine-readable access points for your resource.",

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
