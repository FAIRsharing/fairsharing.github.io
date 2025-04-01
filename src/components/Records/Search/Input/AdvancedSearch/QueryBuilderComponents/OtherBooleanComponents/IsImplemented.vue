<template>
  <div class="d-flex width-90 align-center">
    <RadioComponent
      v-model="model"
      :item-value="itemValue"
      :tool-tip-text="toolTipText"
      @input="selectedValue"
    />
  </div>
</template>

<script>
import RadioComponent from "../UtilComponents/RadioComponent.vue";

export default {
  name: "IsImplemented",
  components: { RadioComponent },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  emits: ["input"],
  data: () => {
    return {
      itemValue:"",
      toolTipText: "Implemented by at least one database.",

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
