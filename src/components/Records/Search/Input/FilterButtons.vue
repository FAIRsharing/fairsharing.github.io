<template>
  <div>
    <div
      v-for="(buttonVal, buttonIndex) in allowedFilterButtons"
      :key="'button_' + buttonIndex"
      class="d-flex flex-row justify-start mb-1 mb-lg-2"
    >
      <FilterButton
        v-for="(item, item_index) in buttonVal.data"
        :key="item_index"
        :item="item"
        :is-first-item="item_index === 0"
        :item-parent-index="buttonIndex"
        :md-screens="$vuetify.breakpoint.mdAndDown"
        :multiple-items="buttonVal.data.length > 2"
        :double-items="buttonVal.data.length === 2"
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
            ...mapState('users', ["user"]),
            allowedFilterButtons() {
              let _module = this;
              let user = _module.user();
              if (user.is_curator) {
                return this.filterButtons;
              }
              return this.filterButtons.filter(function(el) { return el.curator_only === false; });
            }
        }
    }
</script>
