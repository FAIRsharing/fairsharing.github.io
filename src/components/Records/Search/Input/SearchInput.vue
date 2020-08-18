<template>
  <aside>
    <v-card
      :class="['pa-2',responsiveClassObject]"
      outlined
      tile
      elevation="3"
    >
      <!--
      this code is related to v-card. will be used later..
            v-scroll.self="onScroll"
      -->
      <h2 class="d-none">
        Filter List
      </h2>

      <!-- Search Box -->
      <string-search class="mb-2" />

      <hr
        class="mb-3 mr-2 ml-2"
        style="opacity: .5!important;"
      >

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
import {mapGetters, mapState} from "vuex"
import FilterAutocomplete from "./FilterAutocomplete";
import FilterButtons from "./FilterButtons";
import StringSearch from "@/components/Records/Search/Input/StringSearch";

export default {
  name: "SearchInput",
  components: {StringSearch, FilterButtons, FilterAutocomplete},
  data() {
    return {
      panel: [],
      filterSelected: {},
    }
  },
  computed: {
    ...mapState('uiController', ['UIGeneralStatus']),
    ...mapGetters("searchFilters", ["getFilters"]),
    setup() {
      this.setPanel();
      this.createIndexForFilters();
      return this.getFilters;
    },
    responsiveClassObject: function () {
      return {
        'filters-holder-default': this.UIGeneralStatus.headerVisibilityState,
        'filters-holder-after-scroll': !this.UIGeneralStatus.headerVisibilityState,
      }
    }
  },
  methods: {
    /*    onScroll({target: {scrollTop, clientHeight, scrollHeight}}) {
          if (scrollTop + clientHeight >= scrollHeight) {
            // console.log('end');
          }
        },*/
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
.filters-holder-default {
  border-radius: 0;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  overflow-x: hidden;
  height: calc(100vh - 230px);
  transition: height ease-in 500ms;
}

.filters-holder-after-scroll {
  border-radius: 0;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  overflow-x: hidden;
  height: 100vh;
  transition: height ease-in 500ms;
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
