<template>
  <v-select
    v-model="model"
    chips
    :items="recordTypes"
    multiple
    label="Record Type"
    solo
    clearable
    closable-chips
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
        {{ cleanString(data.item) }}
      </v-chip>
    </template>
    <template #item="{ item, on, attrs }">
      <v-list-item
        v-bind="attrs"
        v-on="on"
      >
        <v-list-item-icon>
          <v-icon>
            {{
              model.includes(item)
                ? "mdi-checkbox-marked"
                : "mdi-checkbox-blank-outline"
            }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            class="text-left text-capitalize"
            v-text="cleanString(item)"
          />
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-select>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import { removeItem } from "@/utils/advancedSearchUtils";
import stringUtils from "@/utils/stringUtils";

export default {
  name: "RecordType",
  mixins: [stringUtils],
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters("recordTypes", ["getRecordTypes"]),
    recordTypes() {
      return this.getRecordTypes.map(({ name }) => name);
    },
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  mounted() {
    this.fetchAllRecordTypes();
  },

  methods: {
    ...mapActions("recordTypes", ["fetchAllRecordTypes"]),
    remove(item) {
      return removeItem(item, this.model);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/advancedSearchComponents.scss";
</style>
