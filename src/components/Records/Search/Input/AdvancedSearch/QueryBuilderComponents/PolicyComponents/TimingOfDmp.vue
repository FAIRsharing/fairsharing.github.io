<template>
  <div class="d-flex width-90">
    <TooltipComponent :tool-tip-text="toolTipText" />
    <SelectComponent
      v-model="model"
      :item-value="itemValue"
      :item-list="itemList"
      @input="selectedValue"
    />
  </div>
</template>

<script>
import SelectComponent from "../UtilComponents/SelectComponent.vue";
import TooltipComponent from "../UtilComponents/TooltipComponent.vue";

export default {
  name: "TimingOfDmp",
  components: { TooltipComponent, SelectComponent },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {
      itemList: [
        "pre-award",
        "post-award",
        "other",
        "n/a"
      ],
      itemSelected: [],
      itemValue: [],
      toolTipText: "Policies should provide clarity over the timing of their preparation and delivery. If multiple versions are required at different stages. Multiple selections will be joined with OR.",
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
