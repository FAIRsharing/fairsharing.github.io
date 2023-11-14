<template>
  <input v-model="model" type="text" placeholder="RegistryType" />
  <input v-model="model" type="text" placeholder="RegistryType" />
</template>
<script>
export default {
  name: "RegistryType",
  props: {
    value: {
      type: String,
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
