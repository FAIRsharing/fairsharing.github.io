<template>
  <!--  <input v-model="searchSubject" type="text" />-->
  <v-autocomplete
    v-model="model"
    :items="getSearchSubjects"
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
import { mapActions, mapGetters } from "vuex";

import subjectSearch from "@/store";
import { removeItem } from "@/utils/advancedSearchUtils";

export default {
  name: "Subject",
  props: {
    value: {
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
    ...mapGetters("subjectSearch", ["getSearchSubjects"]),
    ...mapGetters("advancedSearch", ["getEditDialogStatus"]),
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
    search(val) {
      if (!val || val.length < 3) return;
      val = val.trim();
      this.getResults(val);
    },
    /**
     * Item list for the autocomplete should not be empty
     * It is assigned with selected values when edit field is opened
     */
    getEditDialogStatus: {
      handler(open) {
        if (open) {
          if (this.model && this.model.length) {
            subjectSearch.commit("subjectSearch/setSearchSubjects", this.model);
          }
        }
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions("subjectSearch", ["fetchSearchSubjects"]),

    getResults(queryParams) {
      this.fetchSearchSubjects(queryParams);
    },
    remove(item) {
      return removeItem(item, this.model);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/advancedSearchComponents.scss";
</style>
