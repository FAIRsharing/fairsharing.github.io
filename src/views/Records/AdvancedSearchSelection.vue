<template>
  <div class="mx-2">
    <v-card
      elevation="3"
      class="py-2"
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
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "AdvancedSearchSelection",
  data() {
    return {
      operatorArr: [],
    };
  },
  computed: {
    ...mapGetters("advancedSearch", [
      "getAdvancedSearchQuery",
      "getAdvancedSearch",
    ]),
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
