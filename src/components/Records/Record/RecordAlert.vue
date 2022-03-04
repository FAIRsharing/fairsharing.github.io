<template>
  <v-alert
    dense
    :type="type"
    class="mb-2 flex-grow-1"
  >
    <span>{{ message }}</span>
  </v-alert>
</template>

<script>
export default {
  name: "RecordAlert",
  props: {
    message: {default: null, type: String},
    type: {default: 'info', type: String},
  }
}
</script>

<style scoped>

</style>