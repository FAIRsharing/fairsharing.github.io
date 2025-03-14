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
    class="text-capitalize advancedSearchSelect"
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
<!--        <template #item="{ item }">-->
<!--          <v-list-item-->
<!--            v-bind="item"-->
<!--          >-->
<!--            <v-list-item-icon>-->
<!--              <v-icon>-->
<!--                {{-->
<!--                  model.includes(item.title)-->
<!--                    ? "mdi-checkbox-marked"-->
<!--                    : "mdi-checkbox-blank-outline"-->
<!--                }}-->
<!--              </v-icon>-->
<!--            </v-list-item-icon>-->

<!--              <v-list-item-title-->
<!--                class="text-left text-capitalize"-->
<!--              >{{ cleanString(item.title)}}</v-list-item-title>-->

<!--          </v-list-item>-->
<!--        </template>-->
  </v-combobox>
</template>

<script>
import { removeItem } from "@/utils/advancedSearchUtils";
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
    cleanTextList() {
      return this.itemList.map((item) => capitalize(this.cleanString(item)))
    }
  },

  methods: {
    remove(item) {
      return removeItem(item, this.model);
    },
    capitalize
  },
};
</script>
