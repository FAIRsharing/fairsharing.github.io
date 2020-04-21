<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-toolbar>
    <v-menu
      bottom
      fixed
      transition="slide-y-transition"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-icon>fa-search</v-icon>
        </v-btn>
      </template>
      <search-filters />
    </v-menu>

    <v-menu
      offset-y
      bottom
      fixed
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-icon>fa-sort</v-icon>
        </v-btn>
      </template>
      <sorting />
    </v-menu>

    <v-spacer />
    <!-- pagination -->
    <Pagination :total-pages="totalPages" />
    <v-spacer />
    <v-btn icon>
      <v-icon>fa-align-justify</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>fa-th</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>fa-table</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<script>
    import { mapState} from 'vuex'

    import Pagination from "./Pagination";
    import SearchFilters from "./SearchFilters";
    import Sorting from "./Sorting";

    export default {
        name: "SearchToolbar",
        components: {Sorting, SearchFilters, Pagination},
        data(){
          return {
            showPanel: null
          }
        },
        computed: {
            ...mapState('records', ["totalPages"])
        }
    }
</script>

<style scoped>

</style>
