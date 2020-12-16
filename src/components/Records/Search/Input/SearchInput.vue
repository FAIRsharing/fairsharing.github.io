<template>
  <perfect-scrollbar
    :options="{wheelPropagation: false,watchOptions :true}"
    :class="[responsiveClassObject,{'bottom-border':isScreen4k}]"
  >
    <aside>
      <v-card
        style="z-index: 0"
        :class="['pa-2']"
        outlined
        tile
        elevation="3"
      >
        <h2 class="d-none">
          Filter List
        </h2>
        <!-- Search Box -->
        <string-search placeholder="Search through all data." />
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
  </perfect-scrollbar>
</template>

<script>
import {mapGetters, mapState} from "vuex"
import filterMapping from "@/data/FiltersLabelMapping.json";
import FilterAutocomplete from "./FilterAutocomplete";
import FilterButtons from "./FilterButtons";
import StringSearch from "@/components/Records/Search/Input/StringSearch";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";

export default {
  name: "SearchInput",
  components: {StringSearch, FilterButtons, FilterAutocomplete, PerfectScrollbar},
  data() {
    return {
      panel: [],
      filterSelected: {},
      sortOrder: filterMapping['sort_order']
    }
  },
  computed: {
    ...mapState('uiController', ['UIGeneralStatus']),
    ...mapGetters("searchFilters", ["getFilters"]),
    isScreen4k() {
      return window.screen.height < 1870;
    },
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
  }
}
</script>

<style scoped lang="scss">
.filters-holder-default {
  border-radius: 0;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  height: calc(100vh - 240px);
  position: sticky;
  transition: height ease-in 500ms;
}
.filters-holder-after-scroll {
  border-radius: 0;
  -moz-border-radius: 0;
  -webkit-border-radius: 0;
  height: 100vh;
  position: sticky;
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
.bottom-border {
  border-bottom: 2px #e8e8e8 solid;
}
</style>
