<template>
  <div class="d-flex width-90 align-center">
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
  name: "MonitoringOfCompliance",
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
      toolTipText: "'Yes' is applicable when the policy makes clear whether compliance will be monitored and provides clarity on related rewards or penalties. When the policy lacks clarity, or does not address this topic, 'no' is used.",

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
