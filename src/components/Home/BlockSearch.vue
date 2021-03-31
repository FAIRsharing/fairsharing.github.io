<template>
  <v-container
    fluid
    class="secondary"
  >
    <v-container>
      <section class="d-flex flex-column justify-center">
        <string-search show-button />
      </section>
    </v-container>
  </v-container>
</template>

<script>
import StringSearch from "@/components/Records/Search/Input/StringSearch";
export default {
  name: "BlockSearch",
  components: {StringSearch}
}
</script>

<style scoped>
section {
  height: 250px;
}
</style>
