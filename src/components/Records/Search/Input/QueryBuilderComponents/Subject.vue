<template>
  <input v-model="model" type="text" />
</template>
<script>
export default {
  name: "Subject",
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
