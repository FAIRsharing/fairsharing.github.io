<template>
  <section class="chips-container ">
    <h5 class="d-none">
      Choose Subject , Domain , Taxonomy
    </h5>
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
        link
        :to="chipUrl(chip.label)"
        @click="toggleChipActiveness(chip)"
      >
        {{ chip.label }}
      </v-chip>
    </v-chip-group>
  </section>
</template>

<script>
  import {isEqual} from "lodash";

  export default {
    name: "SearchLinkChips",
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
      chipUrl(label) {
        let _module = this;
        return ("/search?" + _module.type + "=" + encodeURI(label));
      },
      toggleChipActiveness(chip) {
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