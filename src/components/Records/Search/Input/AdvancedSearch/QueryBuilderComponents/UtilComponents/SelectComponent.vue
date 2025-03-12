<template>
  <v-combobox
    v-model="model"
    chips
    :items="itemList"
    multiple
    variant="solo"
    clearable
    closable-chips
    min-height="36px"
    class="text-capitalize"
    density="compact"
    flat
    hide-details="auto"
  >
    <template #chip="{ props, item }">
      <v-chip
        class="advancedSearchChip"
        v-bind="props"
        :model-value="item.selected"
        closable
        :text="cleanString(item.title)"
        size="large"
        border="sm"
        @click="item.select"
        @click:close="remove(item.title)"
      />
    </template>
<!--    <template #item="{ item, on, attrs }">-->
<!--      <v-list-item-->
<!--        v-bind="attrs"-->
<!--        v-on="on"-->
<!--      >-->
<!--        <v-list-item-icon>-->
<!--          <v-icon>-->
<!--            {{-->
<!--              model.includes(item)-->
<!--                ? "mdi-checkbox-marked"-->
<!--                : "mdi-checkbox-blank-outline"-->
<!--            }}-->
<!--          </v-icon>-->
<!--        </v-list-item-icon>-->

<!--          <v-list-item-title-->
<!--            class="text-left text-capitalize"-->
<!--            v-text="cleanString(item)"-->
<!--          />-->

<!--      </v-list-item>-->
<!--    </template>-->
  </v-combobox>
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
