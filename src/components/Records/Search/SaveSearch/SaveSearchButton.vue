<template>
  <v-btn class="mb-2 white--text" color="accent2" small>
    Save Search Results
  </v-btn>
</template>

<script>
export default {
  name: "SaveSearchButton",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data: () => {
    return {};
  },

  methods: {},
};
</script>
