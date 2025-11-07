<template>
  <v-row class="mr-2 ml-2 pb-3">
    <v-chip
      v-if="getChips.length"
      class="ma-2 mt-5 bg-red text-white"
      @click="removeAllParams"
    >
      Clear All
    </v-chip>
    <v-chip-group v-for="chip in getChips" :key="'Chips_' + chip.paramVal">
      <v-chip
        class="ma-2 mt-5 bg-white text-secondary"
        closable
        @click:close="removeParam(chip.paramName, chip.paramVal)"
      >
        {{ getFilteredLabel[chip.paramName] }}:<b class="ml-1">
          {{ decodeURIComponent(chip.paramVal).replace(/_/g, " ") }}</b
        >
      </v-chip>
    </v-chip-group>
  </v-row>
</template>

<script>
import { throttle } from "lodash";

import extraFilterChips from "@/data/extraFilterChips.json";
import filterMapping from "@/data/FiltersLabelMapping.json";
import filterChipsUtils from "@/utils/filterChipsUtils";

export default {
  name: "FilterChips",
  mixins: [filterChipsUtils],
  computed: {
    /**
     * get the Filtered label that corresponds to the name using the map FilterLabel
     * @returns {Object} - object with the mapping names and labels
     */
    getFilteredLabel: function () {
      let filterLabels = {
        q: "Query string",
        userDefinedTags: "User defined tags",
      };
      Object.keys(filterMapping["autocomplete"]).forEach((filterName) => {
        let field = filterMapping["autocomplete"][filterName];
        filterLabels[field.filterName] = field.filterLabel;
      });
      /*
       * These labels are specific to the FAIRsharing Wizard and aren't normally required in the search sidebar,
       * so they are defined here rather than in filterMapping.
       */
      extraFilterChips.forEach(function (extra) {
        let key = Object.keys(extra)[0];
        filterLabels[key] = extra[key];
      });
      return filterLabels;
    },
  },
  methods: {
    /**
     * Removes the parameter value from the router query with a 2000ms throttle
     * @param {String} paramName - name of the parameter to remove
     * @param {String} paramVal - value of the parameter to remove
     */
    removeParam: throttle(async function (paramName, paramVal) {
      let _module = this;
      let query = this.buildNewQuery(paramName, paramVal);
      await _module.$router.push({
        name: _module.$route.name,
        query: query,
      });
    }, 2000),
    /**
     * Removes all the  parameters value from the router query with a 2000ms throttle
     */
    removeAllParams: throttle(async function () {
      let _module = this;
      let query = {};
      await _module.$router.push({
        name: _module.$route.name,
        query: query,
      });
    }, 2000),
    /**
     * Build the new query given a parameter name a value by getting the current query and removing the key/value given
     * @param {String} paramName - name of the parameter to remove
     * @param {String} paramVal - value of the parameter to remove
     * @returns {Object} - the new query to replace in the router
     */
    buildNewQuery: function (paramName, paramVal) {
      let _module = this;
      let query = {};
      Object.keys(_module.$route.query).forEach(function (queryParam) {
        if (queryParam !== paramName) {
          query[queryParam] = _module.$route.query[queryParam];
        } else {
          if (_module.$route.query[queryParam].includes(",")) {
            let currentValues = _module.$route.query[queryParam].split(",");
            if (currentValues.includes(paramVal)) {
              currentValues.splice(currentValues.indexOf(paramVal), 1);
            }
            query[paramName] = currentValues.join(",");
          }
        }
      });
      query["page"] = 1;
      return query;
    },
  },
};
</script>
