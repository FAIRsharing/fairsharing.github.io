<template>
  <v-card
    elevation="3"
    :class="[
      'mx-2 full-width d-flex flex-column',
      $vuetify.display.mdAndUp ? responsiveClassObject : 'fullHeight',
    ]"
  >
    <AdvancedSearchButtons />
    <div
      v-if="getAdvancedSearchText"
      class="searchText chips-holder ma-2"
    >
      <v-chip
        class="ma-2 mt-2 text-capitalize"
        color="accent3"
        variant="flat"
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
          id="individualChips"
          :key="idx"
          class="individualChips d-flex flex-column align-center"
        >
          <div
            class="my-2 mx-1 text-capitalize bg-primary px-3 py-1 text-white rounded d-flex"
            style="font-size: 14px"
          >
            <span>{{ printSelectionKeys(key) }} </span>
            <span><strong>&nbsp;:&nbsp;</strong></span>
            <!-- eslint-disable vue/no-v-html -->
            <span v-html="printSelectionValues(key, value)" />
            <!-- eslint-enable vue/no-v-html -->
          </div>

          <v-chip
            class="operatorChip"
            color="accent"
            variant="outlined"
            size="small"
          >
            {{ printSelectedOperator(item) }}
          </v-chip>
        </div>
      </div>
      <v-chip
        color="accent2"
        variant="flat"
        class="parentOperatorChip text-uppercase font-weight-medium"
      >
        {{ printOperator(getAdvancedSearchQuery["operator"]) }}
      </v-chip>
    </div>
  </v-card>
</template>
<script>
import { mapGetters, mapState } from "vuex";

import extraFilterChips from "@/data/extraFilterChips.json";
import stringUtils from "@/utils/stringUtils";
import AdvancedSearchButtons from "@/views/AdvancedSearch/AdvancedSearchButtons.vue";

export default {
  name: "AdvancedSearchSelection",
  components: { AdvancedSearchButtons },
  mixins: [stringUtils],
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
     * Print the values with OR operator if multiple selection is done
     * @param {Object} key,value - Selection key value pair
     * @returns {String} value - Selection
     */
    printSelectionValues(key, value) {
      let refinedValues = "";
      if (key !== "operator") {
        if ((value === true) || (value[0] === "true"))  {
          return "true"
        }
        if ((value === false) || (value[0] === "false"))  {
          return "false"
        }
        else {
          refinedValues = value
            .map((item) => this.cleanString(item))
            .join(" OR ");

          if (refinedValues !== " ") {
            refinedValues = this.boldString(refinedValues, "OR");
            return refinedValues;
          }
        }
      }
    },
    /**
     * Print the keys and update the text transform if the key within the
     * extraFilterChips
     * @param {string } key - Selected key
     * @returns {string} key - Updated key
     */
    printSelectionKeys(key) {
      let refinedKeys = key;
      extraFilterChips.forEach((item) => {
        let itemKey = Object.keys(item)[0];
        let itemValue = Object.values(item)[0];
        if (itemKey === key) refinedKeys = itemValue;
      });
      return refinedKeys;
    },

    printOperator(value) {
      if (value === "_and") return "And";
      else if (value === "_or") return "Or";
    },

    /**
     * @param {String} str - String
     * @param {String} find - Find text to make it bold
     * @returns {String} - String with bold text
     */
    boldString(str, find) {
      const re = new RegExp(find, "g");
      return str.replace(
        re,
        "<span class='font-weight-medium'>" + find + "</span>"
      );
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
  overflow-y:scroll;
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
    //width: 50%;
    //display: block;
    padding: 0 22%;
    margin: 0 auto;
    text-align: center;
    //font-weight: 500;
  }
  &:last-of-type {
    .parentOperatorChip {
      display: none;
    }
  }
  .chips-holder {
    .individualChips {
      width: 98%;
      margin: 0 auto;
      .chipText {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
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
