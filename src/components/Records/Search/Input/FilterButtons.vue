<template>
  <div>
    <AnyAllButton />

    <div
      v-for="index in filterButtons.length"
      :key="index"
      class="d-flex flex-row justify-start mb-1 mb-lg-2"
    >
      <FilterButton
        v-for="(item,item_index) in filterButtons[index-1]"
        :key="item_index"
        :item="item"
        :is-first-item="item_index===0"
        :item-parent-index="index-1"
        :md-screens="$vuetify.breakpoint.mdAndDown"
        :multiple-items="filterButtons[index-1].length>3"
      />
    </div>
  </div>
</template>

<script>
    import {mapState} from "vuex";
    import AnyAllButton from "./AnyAllButton";
    import FilterButton from "./FilterButton";

    export default {
        name: "FilterButtons",
        components: {
          AnyAllButton,
          FilterButton
        },
        computed: {
            ...mapState("searchFilters", ["filterButtons"]),
        }
    }
</script>

<style scoped>

</style>
