<template>
  <v-row v-if="isMounted" class="d-flex align-center">
    <v-col
      class="mx-auto d-flex justify-center"
      cols="12"
      lg="4"
      md="12"
      sm="12"
    >
      <v-img class="contain" eager src="/assets/Errors/500.png" width="500px" />
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
  data: () => ({
    isMounted: false,
  }),
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style scoped></style>
