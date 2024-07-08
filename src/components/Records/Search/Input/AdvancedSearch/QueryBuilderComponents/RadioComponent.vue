<template>
  <!--  <v-checkbox-->
  <!--    v-model="model"-->
  <!--    background-color="white"-->
  <!--    color="success"-->
  <!--    class="mt-0"-->
  <!--  />-->
  <v-radio-group
    v-model="model"
    row
    background-color="white"
  >
    <v-radio
      label="Yes"
      color="success"
      value="true"
    />
    <v-radio
      label="No"
      color="error"
      value="false"
    />
  </v-radio-group>
</template>

<script>

export default {
  name: "RadioComponent",
  props: {
    itemValue: {
      type: String,
      default: null,
    }
  },

  computed: {
    model: {
      get() {
        return this.itemValue;
      },
      set(itemValue) {
        this.$emit("input", itemValue);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/advancedSearchComponents";
</style>
