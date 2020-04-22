<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="searchToolbar">
    <v-toolbar>
      <!-- Advanced search -->
      <v-skeleton-loader
        :loading="loading"
        width="60px"
        type="avatar"
      >
        <v-menu
          bottom
          offset-y
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
      </v-skeleton-loader>

      <!-- facet -->
      <v-skeleton-loader
        :loading="loading"
        width="60px"
        type="avatar"
      >
        <v-menu
          bottom
          offset-y
          fixed
          transition="slide-y-transition"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              v-on="on"
            >
              <v-icon>F</v-icon>
            </v-btn>
          </template>
          <facets />
        </v-menu>
      </v-skeleton-loader>

      <!-- sorting -->
      <v-skeleton-loader
        :loading="loading"
        width="60px"
        type="avatar"
      >
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
      </v-skeleton-loader>
      <v-spacer />

      <!-- pagination -->
      <v-skeleton-loader
        :loading="loading"
        width="600px"
        type="list-item"
      >
        <Pagination :total-pages="totalPages" />
      </v-skeleton-loader>
      <v-spacer />

      <!-- fake buttons ATM -->
      <v-skeleton-loader
        :loading="loading"
        width="60px"
        type="avatar"
      >
        <v-btn icon>
          <v-icon>fa-align-justify</v-icon>
        </v-btn>
      </v-skeleton-loader>
      <v-skeleton-loader
        :loading="loading"
        width="60px"
        type="avatar"
      >
        <v-btn icon>
          <v-icon>fa-th</v-icon>
        </v-btn>
      </v-skeleton-loader>
      <v-skeleton-loader
        :loading="loading"
        width="60px"
        type="avatar"
      >
        <v-btn icon>
          <v-icon>fa-table</v-icon>
        </v-btn>
      </v-skeleton-loader>
    </v-toolbar>
  </div>
</template>

<script>
    import { mapState } from 'vuex'

    import Pagination from "./Pagination";
    import SearchFilters from "./SearchFilters";
    import Sorting from "./Sorting";
    import Facets from "./Facets";

    export default {
        name: "SearchToolbar",
        components: {
          Facets,
          Sorting,
          SearchFilters,
          Pagination
        },
        data(){
          return {
            showPanel: null
          }
        },
        computed: {
            ...mapState('records', ["totalPages", "loading"])
        }
    }
</script>

<style scoped>

</style>
