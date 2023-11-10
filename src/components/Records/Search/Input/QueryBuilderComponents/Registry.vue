<template>
  <v-select
    v-model="model"
    chips
    :items="items"
    multiple
    label="Registry"
    solo
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
