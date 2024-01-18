<template>
  <v-select
    v-model="model"
    chips
    :items="items"
    multiple
    label="Registry"
    solo
    clearable
    closable-chips
    min-height="36px"
  />
</template>

<script>
export default {
  name: "Registry",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    items: ["database", "standard", "policy"],
  }),

  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
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
