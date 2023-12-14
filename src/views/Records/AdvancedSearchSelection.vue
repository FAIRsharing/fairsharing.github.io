<template>
  <v-card
    elevation="3"
    :class="[
      'mx-2 py-2 full-width',
      $vuetify.breakpoint.mdAndUp ? responsiveClassObject : 'fullHeight',
    ]"
  >
    <div
      v-for="(item, index) in getAdvancedSearchQuery['fields']"
      :key="index"
      class="ma-2 selectionWrapper"
    >
      <div class="chips-holder">
        <div
          v-for="([key, value], idx) in Object.entries(item)"
          :key="idx"
          class="individualChips"
        >
          <v-chip
            class="ma-2 mt-5"
            color="grey"
            text-color="secondary"
          >
            {{ printSelectionChips(key, value) }}
          </v-chip>
          <div class="operatorChip">
            {{ printSelectedOperator(item) }}
          </div>
        </div>
      </div>
      <v-chip
        color="red"
        class="parentOperatorChip"
      >
        {{ printOperator(getAdvancedSearchQuery["operator"]) }}
      </v-chip>
    </div>
  </v-card>
</template>
<script>
import { mapGetters, mapState } from "vuex";

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
      if (value === "_and") return "and";
      else if (value === "_or") return "or";
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
  border-radius: 0;
  overflow-x: hidden;
  height: calc(100vh - 355px);
  position: sticky;
  top: 0;
  transition: height ease-in 500ms;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
.filters-holder-after-scroll {
  border-radius: 0;
  overflow-x: hidden;
  height: 100vh;
  position: sticky;
  top: 0;
  transition: height ease-in 500ms;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
.selectionWrapper {
  &:last-child {
    .parentOperatorChip {
      display: none;
    }
  }
  .chips-holder {
    //position: sticky;
    //top: 0;
    //z-index: 2;
    background: #f5f5f5;
    border: 2px dotted #dbdbdb;
    border-radius: 10px;

    .individualChips {
      &:first-child {
        display: none;
      }

      &:last-child {
        .operatorChip {
          display: none;
        }
      }
    }
  }
}
</style>
