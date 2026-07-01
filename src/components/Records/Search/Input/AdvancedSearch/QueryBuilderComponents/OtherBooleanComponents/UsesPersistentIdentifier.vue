<template>
  <RadioComponent
    v-model="model"
    :item-value="itemValue"
    :tool-tip-text="toolTipText"
    @update:model-value="selectedValue"
  />
</template>

<script>
import RadioComponent from "../UtilComponents/RadioComponent.vue";

export default {
  name: "UsesPersistentIdentifier",
  components: { RadioComponent },
  props: {
    value: {
      type: [String, Boolean],
      default: "",
    },
  },
  emits: ["input"],
  data: () => {
    return {
      itemValue: null,
      itemSelected: null,
      toolTipText: "Does it have persistent identifiers?",
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
    console.log("this.value::", this.value);
    this.itemValue = this.value;
  },

  methods: {
    selectedValue(item) {
      this.itemSelected = item;
    },
  },
};
</script>
