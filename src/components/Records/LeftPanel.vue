<template>
  <aside>
    <v-card
      id="filters-holder"
      class="pa-2"
      outlined
      tile
      elevation="3"
    >
      <h2 class="d-none">
        Filter List
      </h2>
      <FilterPanel/>
    </v-card>
  </aside>
</template>

<script>
    import FilterPanel from "./FilterPanel";

    export default {
        name: "LeftPanel",
        components: {FilterPanel},
    }
</script>

<style scoped lang="scss">

    aside {
        #filters-holder {
            border-radius: 0;
            -moz-border-radius: 0;
            -webkit-border-radius: 0;
            overflow-x: hidden;
            height: 100vh;
        }
    }

</style>
