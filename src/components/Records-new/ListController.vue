<template>
  <div class="d-flex  justify-center">
    <v-icon
      x-large
      class="mouse-cursor"
      :class="{'active':!isSortHovered}"
      @mouseenter="isSortHovered=true"
      @mouseleave="isSortHovered=false"
    >
      sort
    </v-icon>
      
    <!--Pagination-->
    <Pagination :total-pages="totalPages" />

    <!--Stack or Column list toggle buttons-->
    <v-icon
      x-large
      :class="{'active':isColumnList}"
      @click="changeListType('stackList')"
    >
      view_headline
    </v-icon>
    <v-icon
      x-large
      style="font-size: 2.8rem"
      :class="{'active':!isColumnList}"
      @click="changeListType('columnList')"
    >
      view_column
    </v-icon>
  </div>
</template>

<script>
    import Pagination from "@/components/IndividualComponents/Pagination";
    import {mapState} from "vuex";

    export default {
        name: "ListController",
        components:{Pagination},
        data() {
            return {
                page: 1,
                isSortHovered: false,
                isColumnList: false // need to go to store to have them synced in everywhere.
            }
        },
        computed: {
            ...mapState('records', ["totalPages", "loading"])
        },
        methods: {
            changeListType: function (listType) {
                listType === 'stackList' ? this.isColumnList = false : this.isColumnList = true;
                this.$emit('ChangeListType', this.isColumnList)
            }
        }
    }
</script>

<style scoped>
    .mouse-cursor {
        cursor: pointer;
    }

    .active {
        color: lightgrey;
    }

    .theme--light.v-icon:focus::after {
        opacity: 0;
    }
</style>