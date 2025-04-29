<template>
  <section :class="['mb-1 overflow-hidden',{'chips-container-fixed-height':!isColumn}]">
    <div
    >
      <v-chip
        v-for="(chip,index) in chips"
        :key="chip.label+'_'+index"
        :color="getChipColor(chip)"
        variant="flat"
        class="mr-2 my-1"
        @click.prevent="updateSearchQuery(chip)"
      >
        <KeywordTooltip
          v-if="chip.type === 'subjects' || chip.type === 'domains' "
          :keyword="chip"
        />
        <div
          v-else
          class="ellipse-width-80 text-center"
        >
          {{ chip.label }}
        </div>
      </v-chip>
      <v-chip
        v-if="remainTagCount!==0 && remainTagCount!==1"
        disabled
        variant="outlined"
        label
      >
        {{ `+${remainTagCount} more tags` }}
      </v-chip>
      <v-chip
        v-else-if="remainTagCount===1"
        disabled
        variant="outlined"
        label
      >
        {{ `one more tag` }}
      </v-chip>
    </div>
  </section>
</template>

<script>
import {isEqual} from "lodash";

import recordsCardUtils from "@/utils/recordsCardUtils";

import KeywordTooltip from "../../Shared/KeywordTooltip";
export default {
  name: "SearchLinkChips",
  components: {KeywordTooltip},
  mixins: [recordsCardUtils],
  props: {
    chips: {
      default: null,
      type: Array
    },
    remainTagCount: {
      default: null,
      type: Number
    },
    isColumn: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    /*
     * TODO: Contains some code similar to that in FilterButton.vue
     * Could this be refactored somehow?
     */
    updateSearchQuery(chip) {
      const _module = this;
      let currentQuery = {};
      let oldQuery = {};
      Object.keys(_module.$route.query).forEach(function (param) {
        currentQuery[param] = _module.$route.query[param];
        oldQuery[param] = _module.$route.query[param];
      });
      if (!currentQuery[chip.type]) {
        currentQuery[chip.type] = encodeURIComponent(chip.label);
      }
      else {
        let terms = currentQuery[chip.type].split(',');
        terms.push(encodeURIComponent(chip.label));
        currentQuery[chip.type] = terms.filter((v, i, a) => a.indexOf(v) === i).join();
      }
      if (!isEqual(currentQuery, oldQuery)) {
        _module.$router.push({
          name: _module.$route.name,
          query: currentQuery
        });
      }
      let selectedItem = this.chips.find(item => isEqual(item, chip));
      this.chips.map(item => {
        if (isEqual(item, selectedItem)) {
          item.active = !item.active;
        }
      });
    }
  }
}
</script>

<style scoped>
.chips-container-fixed-height {
  height: 40px;
}
</style>
