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
      <!-- Filter Buttons     -->
      <FilterButtons />

      <!-- expansion Panels    -->
      <v-expansion-panels
        v-if="getFilters.length>0"
        v-model="panel"
        multiple
        flat
        hover
        accordion
      >
        <filter-autocomplete
          v-for="filter in setup"
          :key="filter.filterLabel"
          :filter="filter"
        />
      </v-expansion-panels>
    </v-card>
  </aside>
</template>

<script>
    import {mapGetters} from "vuex"
    import FilterAutocomplete from "./FilterAutocomplete";
    import FilterButtons from "./FilterButtons";

    export default {
        name: "SearchInput",
        components: {FilterButtons, FilterAutocomplete},
        data() {
            return {
                panel: [],
                filterSelected: {},
            }
        },
        computed: {
            ...mapGetters("searchFilters", ["getFilters"]),
            setup() {
                this.setPanel();
                this.createIndexForFilters();
                return this.getFilters;
            },
        },
        methods: {
            setPanel() {
                this.panel = [...Array(this.getFilters.length).keys()].map((k, i) => i)
            },
            resetPanel() {
                this.panel = []
            },
            createIndexForFilters: function () {
                this.getFilters.forEach(item => {
                    this.filterSelected[item.filterName] = [];
                });
            },
        },
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

    .buttons-md-style {
        min-width: 32px !important;
    }

    .first-child {
        font-size: 11px;
        width: 16.5%;
    }

    .flex-1 {
        font-size: 11px;
        flex: 1;
    }


</style>
