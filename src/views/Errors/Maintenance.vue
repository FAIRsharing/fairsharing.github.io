<template>
  <v-row
    style="height:50vh"
    class="d-flex align-center"
  >
    <v-col
      cols="12"
      lg="4"
      md="12"
      sm="12"
      class="mx-auto d-flex justify-center"
    >
      <v-img
        src="assets/Errors/500.png"
        contain
        width="500px"
      />
    </v-col>
  </v-row>
</template>

<script>
    export default {
        name: "Maintenance",
        metaInfo() {
            return {
                title: "FAIRsharing | Maintenance Mode"
            }
        }
    }
</script>

<style scoped>

</style>
