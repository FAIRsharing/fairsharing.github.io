<template>
  <v-container fluid>
    <v-alert 
      v-if="!isLoggedIn"
      type="warning"
    >
      This record is hidden: {{ recordName }}.
      You may be able view it by logging in.
    </v-alert>
    <v-alert
      v-else
      type="warning"
    >
      This record is hidden: {{ recordName }}. It will become visible once approved by our curators.
    </v-alert>
  </v-container>
</template>

<script>
export default {
    name: "Hidden",
    props: {
        recordName: {default: null, type: String},
        isLoggedIn: {default: false, type: Boolean}
    }
}
</script>

<style scoped>

</style>
