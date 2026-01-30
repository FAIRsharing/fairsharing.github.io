<template>
  <v-row class="d-flex align-center" style="height: 50vh">
    <v-col
      class="mx-auto d-flex justify-center"
      cols="12"
      lg="4"
      md="12"
      sm="12"
    >
      <v-img class="contain" src="/assets/Errors/500.png" width="500px" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Error500",
  metaInfo() {
    return {
      title: "FAIRsharing | Server Error",
    };
  },
};
</script>

<style scoped></style>
