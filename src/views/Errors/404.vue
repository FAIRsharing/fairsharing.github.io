<template>
  <v-row class="d-flex align-center">
    <v-col
      class="mx-auto d-flex justify-center"
      cols="12"
      lg="4"
      md="12"
      sm="12"
    >
      <v-img class="contain" src="/assets/Errors/404.png" width="500px" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Error404",
  metaInfo() {
    return {
      title: "FAIRsharing | Not Found",
    };
  },
};
</script>
