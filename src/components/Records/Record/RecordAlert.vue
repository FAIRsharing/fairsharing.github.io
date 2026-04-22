<template>
  <v-alert
    :icon="type === 'info' ? 'fas fa-circle-exclamation' : null"
    :type="type"
    class="mb-2 flex-grow-1 text-center"
    density="compact"
  >
    <span id="message-text" v-safe-html="message" />
  </v-alert>
</template>

<script>
export default {
  name: "RecordAlert",
  props: {
    message: { default: null, type: String },
    type: { default: "info", type: String },
  },
};
</script>

<style scoped>
#message-text {
  color: white;
}
</style>
