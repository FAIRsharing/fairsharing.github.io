<template>
  <v-card
    elevation="3"
    :class="[
      'mx-2 py-2 full-width d-flex flex-column',
      $vuetify.breakpoint.mdAndUp ? responsiveClassObject : 'fullHeight',
    ]"
  >
    <v-btn
      class="mx-2"
      color="accent"
      elevation="2"
      @click="editAdvancedSearch()"
    >
      <v-icon
        small
        class="mr-1"
      >
        fa-solid fa-pen
      </v-icon>
      <span class="button-text-size">Edit Advanced Search</span>
    </v-btn>
    <div
      v-if="getAdvancedSearchText"
      class="searchText chips-holder ma-2"
    >
      <v-chip
        class="ma-2 mt-2 text-capitalize"
        color="accent3"
        text-color="white"
        label
      >
        Search Text : {{ getAdvancedSearchText }}
      </v-chip>
    </div>

    <div
      v-for="(item, index) in getAdvancedSearchQuery['fields']"
      :key="index"
      class="ma-2 selectionWrapper d-flex flex-column"
    >
      <div class="chips-holder mb-2">
        <div
          v-for="([key, value], idx) in Object.entries(item)"
          :key="idx"
          class="individualChips d-flex flex-column align-center"
        >
          <v-chip
            class="ma-2 mt-2 text-capitalize"
            color="primary"
            text-color="white"
            label
          >
            {{ printSelectionChips(key, value) }}
          </v-chip>
          <v-chip
            class="operatorChip"
            color="accent"
            text-color="accent"
            outlined
            small
          >
            {{ printSelectedOperator(item) }}
          </v-chip>
        </div>
      </div>
      <v-chip
        color="accent2"
        class="parentOperatorChip text-uppercase font-weight-medium"
        text-color="white"
      >
        {{ printOperator(getAdvancedSearchQuery["operator"]) }}
      </v-chip>
    </div>
  </v-card>
</template>
<script>
import { mapGetters, mapState } from "vuex";

import advancedSearch from "@/store";

export default {
  name: "AdvancedSearchSelection",
  data() {
    return {
      operatorArr: [],
    };
  },
  computed: {
    ...mapState("uiController", ["UIGeneralStatus"]),
    ...mapGetters("advancedSearch", [
      "getAdvancedSearchQuery",
      "getAdvancedSearch",
      "getAdvancedSearchText",
    ]),
    responsiveClassObject() {
      return {
        "filters-holder-default": this.UIGeneralStatus.headerVisibilityState,
        "filters-holder-after-scroll":
          !this.UIGeneralStatus.headerVisibilityState,
      };
    },
  },

  methods: {
    /**
     * Print the within selection operator (_and/_or)
     * @param {Object} item - Selection object
     * @returns {String} operator - Operator _and/_or formatted as and/or
     */
    printSelectedOperator(item) {
      let operatorValue;
      for (let i = 0; i < Object.entries(item).length; i++) {
        operatorValue = Object.entries(item)[0][1];
      }
      return this.printOperator(operatorValue);
    },

    /**
     * Print the selections but not operator
     * @param {array} key,value - Selection key value pair
     * @returns {String} key,value - Selection
     */
    printSelectionChips(key, value) {
      if (key !== "operator") {
        return `${key} : ${value}`;
      }
    },

    printOperator(value) {
      if (value === "_and") return "And";
      else if (value === "_or") return "Or";
    },
    editAdvancedSearch() {
      advancedSearch.commit("advancedSearch/setEditDialogStatus", true);
    },
  },
};
</script>

<style scoped lang="scss">
.fullHeight {
  height: 90vh;
  overflow: scroll;
}
.filters-holder-default {
  overflow-x: hidden;
  height: calc(100vh - 355px);
  position: sticky;
  top: 0;
  transition: height ease-in 500ms;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
.filters-holder-after-scroll {
  overflow-x: hidden;
  height: 100vh;
  position: sticky;
  top: 0;
  transition: height ease-in 500ms;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  margin-bottom: 94px;
}
.chips-holder {
  background: #f5f5f5;
  border: 2px dotted #dbdbdb;
  border-radius: 10px !important;
}
.selectionWrapper {
  .parentOperatorChip {
    width: 50%;
    display: block;
    margin: 0 auto;
    text-align: center;
    //font-weight: 500;
  }
  &:last-child {
    .parentOperatorChip {
      display: none;
    }
  }
  .chips-holder {
    .individualChips {
      &:first-child {
        display: none !important;
      }

      &:last-child {
        .operatorChip {
          display: none !important;
        }
      }
    }
  }
}
</style>
