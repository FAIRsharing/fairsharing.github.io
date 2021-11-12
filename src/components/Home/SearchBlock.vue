<template>
  <v-container
    id="container-back"
    fluid
  >
    <v-container>
      <section class="d-flex flex-column justify-center">
        <v-row>
          <v-col
            cols="6"
            class="d-flex align-center"
          >
            <string-search
              style="width: 100%"
              show-home-search
              placeholder="search through all content"
            />
          </v-col>
          <v-col cols="6">
            <v-img
              src="/assets/Home/BlockSearch/browser.svg"
              height="400"
              contain
              alt="browse by subject"
            />
          </v-col>
        </v-row>
      </section>
    </v-container>
  </v-container>
</template>

<script>
import StringSearch from "@/components/Records/Search/Input/StringSearch";
export default {
  name: "SearchBlock",
  components: {StringSearch}
}
</script>

<style scoped>
#container-back {
  background: rgb(37, 52, 66);
}

section {
  height: 400px;
}
</style>
