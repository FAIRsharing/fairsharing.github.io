<template>
  <aside>
    <v-card
      id="scrollable-holder"
      v-scroll-stop
      :class="['pa-2',responsiveClassObject]"
      outlined
      tile
      elevation="3"
    >
      <h2 class="d-none">
        Filter List
      </h2>

      <!-- Search Box -->
      <string-search placeholder="Search through all data." />

      <hr class="mb-3 mr-2 ml-2 custom-hr">

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
          v-for="(filter,index) in setup"
          :key="filter.filterLabel"
          :filter="filter"
          :last-item="index===setup.length-1"
          @lastItemClick="scrollToBottom"
        />
      </v-expansion-panels>
    </v-card>
  </aside>
</template>

<script>
import {mapGetters, mapState} from "vuex"
import filterMapping from "@/data/FiltersLabelMapping.json";
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
      sortOrder: filterMapping['sort_order'],
    }
  },
  computed: {
    ...mapState('uiController', ['UIGeneralStatus']),
    ...mapGetters("searchFilters", ["getFilters"]),
    setup() {
      let _module = this;
      _module.setPanel();
      _module.createIndexForFilters();
      return _module.getFilters.sort(_module.compareLabels);
    },
    responsiveClassObject: function () {
      return {
        'filters-holder-default': this.UIGeneralStatus.headerVisibilityState,
        'filters-holder-after-scroll': !this.UIGeneralStatus.headerVisibilityState,
      }
    }
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
    /**
     * This gets the index of the name of the filter from the list above, so that the fields can be sorted on the
     * users' preferences. But, some terms may not be in the list, so they are given the index of 100 to force
     * them to appear later.
     */
    compareLabels: function(a, b) {
      let _module = this;
      const aIndex = _module.sortOrder.indexOf(a['filterName']);
      const bIndex = _module.sortOrder.indexOf(b['filterName']);
      const aOrder = aIndex === -1 ? 100 : aIndex;
      const bOrder = bIndex === -1 ? 100 : bIndex;
      let comparison = -1;
      if (aOrder > bOrder) {
        comparison = 1;
      }
      return comparison;
    },
    scrollToBottom() {
      let element = document.getElementById("scrollable-holder");
      element.scrollTop = element.scrollHeight;
    }
  }
}
</script>

<style scoped>
.filters-holder-default {
  border-radius: 0;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  overflow-x: hidden;
  height: calc(100vh - 230px);
  position: sticky;
  top: 0;
  transition: height ease-in 500ms;
}
.filters-holder-after-scroll {
  border-radius: 0;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  overflow-x: hidden;
  height: 100vh;
  position: sticky;
  top: 0;
  transition: height ease-in 500ms;
}
.custom-hr {
  opacity: .5;
}
</style>
