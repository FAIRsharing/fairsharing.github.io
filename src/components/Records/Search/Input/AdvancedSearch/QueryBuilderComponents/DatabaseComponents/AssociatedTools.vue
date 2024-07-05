<template>
  <div class="d-flex width-90">
    <TooltipComponent :tool-tip-text="toolTipText" />
    <CheckboxComponent
      v-model="model"
      :item-name="itemName"
      @input="selectedValue"
    />
  </div>
</template>

<script>
import CheckboxComponent from "../CheckboxComponent.vue";
import TooltipComponent from "../TooltipComponent.vue";

export default {
  name: "AssociatedTools",
  components: { TooltipComponent, CheckboxComponent },
  props: {
    value: {
      type: Boolean,
      default: true,
    },
  },
  data: () => {
    return {
      itemName: "AssociatedTools",
      toolTipText: "AssociatedTools",
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
