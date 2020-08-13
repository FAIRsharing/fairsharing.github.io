<template>
  <form
    class="stringSearchBar d-flex flex-row align-center mt-1  mr-2 ml-2"
    @submit.prevent="searchString()"
  >
    <v-text-field
      v-model="searchTerm"
      solo
      single-line
      clearable
      placeholder="Can't find what you're looking for? Search through all data."
    />
    <v-btn
      color="primary"
      outlined
      height="52px"
      class="mt-1 ml-2"
      @click="searchString()"
    >
      <v-icon>search</v-icon>
      <span>Search</span>
    </v-btn>
  </form>
</template>

<script>
import routerUtils from "@/utils/routerUtils";

export default {
  name: "StringSearch",
  mixins: [routerUtils],
  data() {
    return {
      searchTerm: null
    }
  },
  methods: {
    searchString() {
      const _module = this;
      if (_module.searchTerm) {
        _module.goto({Path: "search",Query: {q: _module.searchTerm}});
        _module.searchTerm = null;
      }
    }
  }
}
</script>

<style scoped >
.v-input {
  height: 42px;
}
</style>

