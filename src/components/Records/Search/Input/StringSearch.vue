<template>
  <form class="stringSearchBar d-flex flex-row align-center mt-1  mr-2 ml-2">
    <v-text-field
      v-model="searchTerm"
      solo
      single-line
      clearable
      placeholder="Can't find what you'r looking for?! search through all data"
    />
    <v-btn
      color="primary"
      outlined
      height="52px"
      class="mt-1 ml-2"
      @click="searchString"
    >
      <v-icon>search</v-icon>
      <span>Search</span>
    </v-btn>
  </form>
</template>

<script>
    export default {
        name: "StringSearch",
        data() {
          return {
            searchTerm: null
          }
        },
        methods: {
          searchString(){
            const _module = this;
            if (_module.searchTerm){
              _module.$router.push({
                path: "search",
                query: {
                  q: _module.searchTerm
                }
              })
            }
          }
        }
    }
</script>

<style scoped lang="scss">
  .v-input {
    height: 42px;
  }
</style>

