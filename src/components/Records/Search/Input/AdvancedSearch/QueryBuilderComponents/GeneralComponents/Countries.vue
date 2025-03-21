<template>
  <div class="d-flex width-90 align-center">
    <TooltipComponent :tool-tip-text="toolTipText" />
    <AutoCompleteComponent
      v-model="model"
      :item-value="itemValue"
      :item-list="getSearchCountries"
      :loading="getLoadingStatus"
      @input="selectedValue"
      @fetch-data="getResults"
    />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import countriesSearch from "@/store";

import AutoCompleteComponent from "../UtilComponents/AutoCompleteComponent.vue";
import TooltipComponent from "../UtilComponents/TooltipComponent.vue";

export default {
  name: "Countries",
  components: { TooltipComponent, AutoCompleteComponent },
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
      toolTipText:
        "Countries applicable to this resource or its data. Multiple selections will be joined with OR. Start typing to see Countries.",
    };
  },

  computed: {
    ...mapGetters("countriesSearch", ["getSearchCountries", "getLoadingStatus"]),
    ...mapGetters("advancedSearch", ["getEditDialogStatus"]),

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
    /**
     * Item list for the autocomplete should not be empty
     * It is assigned with selected values when edit field is opened
     */
    getEditDialogStatus: {
      handler(open) {
        if (open) {
          if (this.value && this.value.length) {
            countriesSearch.commit(
              "countriesSearch/setSearchCountries",
              this.value
            );
          }
        }
      },
      immediate: true,
    },
  },
  mounted() {
    //Pre-fill selected values on edit advanced search is clicked and open
    this.itemValue = this.value;
  },
  methods: {
    ...mapActions("countriesSearch", ["fetchSearchCountries"]),

    selectedValue(item) {
      this.itemSelected = item;
    },
    getResults(queryParams) {
      if (queryParams) this.fetchSearchCountries(queryParams);
    },
  },
};
</script>
