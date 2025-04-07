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
  name: "GuidanceToHelpEnableCompliance",
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
      toolTipText: "'Yes' is applicable when associated guidance is provided to help researchers adhere to the policy. When the policy lacks clarity, or does not address this topic, 'no' is used.",

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
