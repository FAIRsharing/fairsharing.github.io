<template>
  <input
    v-model="model"
    type="text"
  >
</template>
<script>
export default {
  name: "RegistryType",
  props: {
    value: {
      type: null, //To support type any
      default: "",
    },
  },

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
