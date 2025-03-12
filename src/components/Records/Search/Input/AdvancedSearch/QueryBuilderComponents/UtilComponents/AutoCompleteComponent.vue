<template>
  <v-autocomplete
    v-model="model"
    v-model:search-input="search"
    :items="itemList"
    cache-items
    hide-no-data
    hide-details
    flat
    chips
    multiple
    closable-chips
    variant="solo"
    min-height="36px"
    class="text-capitalize"
    :loading="loading"
    loader-height="3"
    color="accent3"
  >
    <template #chip="data">
      <v-chip
        v-bind="data.attrs"
        :model-value="data.selected"
        closable
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
    loading: {
      type: Boolean,
      default: false,
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
