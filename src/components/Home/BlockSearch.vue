<template>
  <v-container
    id="container-back"
    fluid
  >
    <v-container>
      <section class="d-flex flex-column justify-center">
        <string-search
          show-home-search
          placeholder="search through all content"
        />
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
#container-back {
  background: rgb(37, 52, 66);
  background: linear-gradient(180deg, rgb(37, 52, 66) 0%, rgb(15, 103, 139) 100%);
}

section {
  height: 250px;
}
</style>
