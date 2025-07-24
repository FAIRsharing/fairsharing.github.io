<template>
  <v-alert
    dense
    :type="type"
    class="mb-2 flex-grow-1"
  >
    <!-- eslint-enable vue/no-v-html -->
    <span
      id="message-text"
      v-html="message"
    />
    <!-- eslint-disable vue/no-v-html -->
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

<style scoped lang="scss">
#message-text {
  color: white;
  a {
    text-decoration: underline;
    color: white;
  }
}


</style>