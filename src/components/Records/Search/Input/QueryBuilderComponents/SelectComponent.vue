<template>
  <v-select
    v-model="model"
    chips
    :items="itemList"
    multiple
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
import { removeItem } from "@/utils/advancedSearchUtils";
import stringUtils from "@/utils/stringUtils";

export default {
  name: "SelectComponent",
  mixins: [stringUtils],
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

  methods: {
    remove(item) {
      return removeItem(item, this.model);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/advancedSearchComponents.scss";
</style>
