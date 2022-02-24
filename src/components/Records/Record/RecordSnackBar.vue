<template>
  <v-snackbar
    v-model="model"
    :color="type"
    class="text-body"
  >
    <span class="text-center">
      {{ message }}
    </span>
  </v-snackbar>
</template>

<script>
export default {
  name: "RecordSnackbar",
  props: {
    model: {default: null, type: Boolean},
    message: {default: null, type: String},
    type: {default: 'info', type: String},
  }
}
</script>

<style scoped>

</style>