<template>
  <v-autocomplete
    v-model="model"
    :items="itemList"
    :search-input.sync="search"
    cache-items
    hide-no-data
    hide-details
    flat
    chips
    multiple
    closable-chips
    solo
    min-height="36px"
    class="text-capitalize"
  >
    <template #selection="data">
      <v-chip
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        @click="data.select"
        @click:close="remove(data.item)"
      >
        {{ data.item }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>
<script>
import { removeItem } from "@/utils/advancedSearchUtils";

export default {
  name: "AutoCompleteComponent",
  props: {
    itemList: {
      type: Array,
      default: () => [],
    },
    itemValue: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {
      search: null,
    };
  },

  computed: {
    model: {
      get() {
        return this.itemValue;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  watch: {
    search(val) {
      if (!val || val.length < 3) return;
      val = val.trim();
      this.$emit("fetchData", val);
    },
  },

  methods: {
    remove(item) {
      return removeItem(item, this.model);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/advancedSearchComponents";
</style>
