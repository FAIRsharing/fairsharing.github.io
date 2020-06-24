<template>
  <div>
    <div
      v-for="index in filterButtons.length"
      :key="index"
      class="d-flex flex-row justify-start mb-1 mb-lg-2"
    >
      <FilterItem
        v-for="(item,item_index) in filterButtons[index-1]"
        :key="item_index"
        :item="item"
        :is-first-item="item_index===0"
        :itemParentIndex="index-1"
      />
    </div>
  </div>
</template>

<script>
    import {mapState} from "vuex";
    import FilterItem from "./FilterItem";

    export default {
        name: "FilterButtons",
        components: {FilterItem},
        data() {
            return {
                formData: {}
            }
        },
        computed: {
            ...mapState("searchFilters", ["filterButtons"]),
        }
    }
</script>

<style scoped>

</style>
