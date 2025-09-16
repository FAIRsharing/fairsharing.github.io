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
  name: "AccessMethods",
  components: { TooltipComponent, SelectComponent },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {
      itemList: ["User interface", "REST", "OAI-PMH", "Bioschemas", "SOAP", "FTP", "SPARQL", "Other machine-accessible method"],
      itemSelected: [],
      itemValue: [],
      toolTipText: "A user interface is any data access point intended for human consumption (e.g. a search page or data submission form). All other options describe the type of machine-accessible processes (such as REST APIs) that programmatic tools can use to access the resource. Multiple selections will be joined with OR.",
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
