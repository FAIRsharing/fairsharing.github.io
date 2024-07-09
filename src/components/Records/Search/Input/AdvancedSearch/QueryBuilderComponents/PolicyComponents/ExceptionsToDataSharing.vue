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
import RadioComponent from "../RadioComponent.vue";
import TooltipComponent from "../TooltipComponent.vue";

export default {
  name: "ExceptionsToDataSharing",
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
      toolTipText: "The policy should also make clear which exceptions to data sharing are allowed (e.g., personal sensitivity, commercial sensitivity). Any embargo periods that are allowed should be clearly stated in the policy.",

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
