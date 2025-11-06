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
  name: "AssociatedTools",
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
      toolTipText:
        "Resource has a standalone tool that is designed around your resource, you can showcase it here. This will help your users understand the various libraries and software that support your resource.",
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
