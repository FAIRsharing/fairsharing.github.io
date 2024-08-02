<template>
  <div class="d-flex width-90">
    <TooltipComponent :tool-tip-text="toolTipText" />
    <RadioComponent
      v-model="model"
      :item-value="itemValue"
      @input="selectedValue"
    />
  </div>
</template>

<script>
import RadioComponent from "../UtilComponents/RadioComponent.vue";
import TooltipComponent from "../UtilComponents/TooltipComponent.vue";

export default {
  name: "DataProcessesAndConditions",
  components: { TooltipComponent, RadioComponent },
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
