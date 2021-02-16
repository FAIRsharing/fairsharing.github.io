<template>
  <div v-if="doi">
    <v-avatar size="40">
      <v-img
        height="30"
        contain
        src="@/assets/DOI_logo.svg"
        class="mr-2"
      />
    </v-avatar> {{ doi }}
  </div>
  <div
    v-else
    class="mb-6"
  >
    This record does not have a DOI.
  </div>
</template>

<script>
    export default {
        name: "DOIField",
        props: {
            doi: {type: String, default: null}
        }
    }
</script>

<style scoped>

</style>
