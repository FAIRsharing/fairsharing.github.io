<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editAdditionalInfo"
    ref="editAdditionalInfo"
    v-model="formValid"
  />
</template>

<script>

export default {
  name: "EditAdditionalInfo",
  data() {
    return {
      formValid: false
    }
  }
}
</script>

<style>
</style>
