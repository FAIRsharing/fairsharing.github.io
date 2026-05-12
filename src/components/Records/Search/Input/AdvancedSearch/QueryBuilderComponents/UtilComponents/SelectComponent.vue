<template>
  <v-combobox
    v-model="model"
    :items="formattedItems"
    chips
    class="text-capitalize advancedSearchSelect advancedSearchDialogBoxContent"
    clearable
    closable-chips
    color="primary"
    density="compact"
    flat
    hide-details="auto"
    item-title="title"
    item-value="value"
    min-height="36px"
    multiple
    variant="solo"
  >
    <!--Chip slot is not required anymore-->
    <!--    <template #chip="data">-->
    <!--      <v-chip-->
    <!--        class="advancedSearchChip"-->
    <!--        v-bind="data.attrs"-->
    <!--        :model-value="data.selected"-->
    <!--        closable-->
    <!--        :text="cleanString(data.item.title)"-->
    <!--        size="large"-->
    <!--        border="sm"-->
    <!--        @click="data.select"-->
    <!--        @click:close="remove(data.item.title)"-->
    <!--      />-->
    <!--    </template>-->
    <template #chip="{ props, item }">
      <v-chip
        :text="item.raw.title"
        color="blue"
        v-bind="props"
        variant="flat"
      ></v-chip>
    </template>
    <!-- Tooltip for the field -->
    <template #prepend>
      <v-tooltip class="mr-2" location="bottom">
        <template #activator="{ props }">
          <v-icon
            class="mr-1 iconStyle text-white opacity-100"
            size="x-small"
            v-bind="props"
          >
            fas fa-question-circle
          </v-icon>
        </template>
        <span> {{ toolTipText }} </span>
      </v-tooltip>
    </template>
  </v-combobox>
</template>

<script>
import stringUtils from "@/utils/stringUtils";
import { capitalize } from "lodash";

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
    toolTipText: {
      type: String,
      default: null,
    },
  },
  emits: ["input"],
  computed: {
    model: {
      get() {
        return this.itemValue;
      },
      set(value) {
        this.$emit("input", value);
      },
    },

    formattedItems() {
      return this.itemList.map((item) => ({
        title: capitalize(this.cleanString(item)),
        value: item,
      }));
    },
  },
  methods: {
    capitalize,
  },
};
</script>
