<template>
    <RadioComponent
      v-model="model"
      :item-value="itemValue"
      @input="selectedValue"
    />
</template>

<script>
import RadioComponent from "../UtilComponents/RadioComponent.vue";

export default {
  name: "DataCitation",
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
      toolTipText: "Related guidance should provide advice on how to cite a broader range of research outputs including data and software, as well as actors and enablers such as data managers, data stewards, funding bodies, research infrastructures and organisations.",

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
