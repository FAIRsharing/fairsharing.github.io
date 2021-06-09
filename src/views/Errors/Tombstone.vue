<template>
  <v-container fluid>
    <v-alert type="warning">
      This record does not exist anymore: {{ record.name }}.
      The record with DOI <b>{{ record.doi }}</b> was invalid.
    </v-alert>
    <b class="pl-3">Description: </b> {{ record.description }}
  </v-container>
</template>

<script>
    export default {
        name: "Tombstone",
        props: {
            record: {default: null, type: Object}
        }
    }
</script>

<style scoped>

</style>
