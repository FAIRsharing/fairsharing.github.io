<template>
  <v-combobox
    v-model="model"
    chips
    :items="cleanTextList"
    multiple
    variant="solo"
    clearable
    closable-chips
    min-height="36px"
    class="text-capitalize advancedSearchSelect advancedSearchDialogBoxContent"
    density="compact"
    flat
    hide-details="auto"
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
    <!-- Tooltip for the field -->
    <template #prepend>
      <v-tooltip
          location="bottom"
          class="mr-2"
      >
        <template #activator="{ props }">
          <v-icon
              size="x-small"
              class="mr-1 iconStyle text-white opacity-100"
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
// import { removeItem } from "@/utils/advancedSearchUtils";
import stringUtils from "@/utils/stringUtils";
import { capitalize } from "lodash"

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
        this.$emit("input",  value);
      },
    },
    cleanTextList() {
      return this.itemList.map((item) => capitalize(this.cleanString(item)))
    }
  },
  methods: {
    // remove(item) {
    //   return removeItem(item, this.model);
    // },
    capitalize
  },
};
</script>
