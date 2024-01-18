<template>
  <!--  <input v-model="searchSubject" type="text" />-->
  <v-autocomplete
    v-model="searchSubject"
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

export default {
  name: "Subject",
  props: {
    value: {
      // type: Array,
      // default: () => [],
      type: null, //To support type any
      default: "",
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
    searchSubject: {
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
          if (this.searchSubject && this.searchSubject.length) {
            subjectSearch.commit(
              "subjectSearch/setSearchSubjects",
              this.searchSubject
            );
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
      const index = this.searchSubject.indexOf(item);
      if (index >= 0) this.searchSubject.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
.v-text-field::v-deep {
  width: 90%;
  .v-input__control {
    min-height: 36px;
    .v-text-field__details {
      display: none;
    }
    .v-input__slot {
      margin-bottom: 0;
      box-shadow: none !important;
    }
    .v-select__selections {
      min-height: 36px;
    }
  }
}
</style>
