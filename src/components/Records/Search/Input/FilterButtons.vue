<template>
  <div v-if="!isLoadingData">
    <div
      v-for="(buttonVal, buttonIndex) in filterButtons"
      :key="'button_' + buttonIndex"
      class="d-flex flex-row justify-start mb-1 mb-lg-2"
    >
      <FilterButton
        v-for="(item, item_index) in buttonVal"
        :key="item_index"
        :item="item"
        :is-first-item="item_index === 0"
        :item-parent-index="buttonIndex"
        :md-screens="$vuetify.breakpoint.mdAndDown"
        :multiple-items="buttonVal.length > 3"
        :double-items="buttonVal.length === 2"
      />
    </div>
  </div>
</template>

<script>
    import {mapState} from "vuex";
    import FilterButton from "./FilterButton";

    export default {
        name: "FilterButtons",
        components: {
          FilterButton
        },
        computed: {
            ...mapState("searchFilters", ["filterButtons"]),
            ...mapState("searchFilters", ["isLoadingData"]),
        }
    }
</script>

<style scoped>

</style>
