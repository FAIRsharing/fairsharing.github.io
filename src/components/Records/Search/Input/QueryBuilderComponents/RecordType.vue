<template>
  <div class="d-flex width-90">
    <TooltipComponent :tool-tip-text="toolTipText" />
    <SelectComponent
      v-model="model"
      :item-value="itemValue"
      :item-list="recordTypes"
      @input="selectedValue"
    />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import SelectComponent from "./SelectComponent.vue";
import TooltipComponent from "./TooltipComponent.vue";

export default {
  name: "RecordType",
  components: { TooltipComponent, SelectComponent },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {
      itemSelected: [],
      itemValue: [],
      toolTipText: "RecordType",
    };
  },
  computed: {
    ...mapGetters("recordTypes", ["getRecordTypes"]),
    recordTypes() {
      return this.getRecordTypes.map(({ name }) => name);
    },
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
    this.fetchAllRecordTypes();
    //Pre-fill selected values on edit advanced search fields
    this.itemValue = this.value;
  },

  methods: {
    ...mapActions("recordTypes", ["fetchAllRecordTypes"]),
    selectedValue(item) {
      this.itemSelected = item;
    },
  },
};
</script>
