<template>
  <v-checkbox
    v-model="model"
    background-color="white"
    color="success"
    class="mt-0"
  />
</template>

<script>

export default {
  name: "CheckboxComponent",
  props: {
    itemName: {
      type: String,
      default: null,
    }
  },

  computed: {
    model: {
      get() {
        return this.itemName;
      },
      set(itemName) {
        this.$emit("input", itemName);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/advancedSearchComponents";
</style>
