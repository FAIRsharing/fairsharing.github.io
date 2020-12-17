<template>
  <section class="chips-container">
    <v-chip-group
      column
    >
      <v-chip
        v-for="(chip,index) in chips"
        :key="chip.label+'_'+index"
        small
        text-color="secondary"
        color="secondary"
        outlined
        @click="updateSearchQuery(chip)"
      >
        <KeywordTooltip
          v-if="type === 'subjects' || type === 'domains' "
          :keyword="chip"
        />
        <div v-else>
          {{ chip.label }}
        </div>
      </v-chip>
    </v-chip-group>
  </section>
</template>

<script>
  import {isEqual} from "lodash";
  import KeywordTooltip from "../../Shared/KeywordTooltip";

  export default {
    name: "SearchLinkChips",
    components: {KeywordTooltip},
    props: {
      type: {
        default: null,
        type: String
      },
      chips: {
        default: null,
        type: Array
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
        if (!currentQuery[_module.type]) {
          currentQuery[_module.type] = encodeURIComponent(chip.label);
        } else {
          let terms = currentQuery[_module.type].split(',');
          terms.push(encodeURIComponent(chip.label));
          currentQuery[_module.type] = terms.filter((v, i, a) => a.indexOf(v) === i).join();
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
    },
  }

</script>

<style scoped>

</style>
