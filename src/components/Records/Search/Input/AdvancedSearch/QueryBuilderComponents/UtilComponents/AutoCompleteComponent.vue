<template>
  <v-autocomplete
    v-model="model"
    v-model:search="search"
    :items="itemList"
    hide-no-data
    hide-details="auto"
    flat
    chips
    multiple
    closable-chips
    variant="solo"
    min-height="36px"
    class="text-capitalize advancedSearchAutocomplete advancedSearchDialogBoxContent"
    density="compact"
    :loading="loading"
    color="primary"
  >
    <template #chip="{ props, item }">
      <v-chip
        v-bind="props"
        :text="item.raw.title"
        color="blue"
        variant="flat"
      ></v-chip>
    </template>
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
  </v-autocomplete>
</template>
<script>
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
    toolTipText: {
      type: String,
      default: null,
    },
  },
  emits: ["input", "fetchData"],
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

};
</script>
