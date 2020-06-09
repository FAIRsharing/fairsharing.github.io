<template>
  <div class="d-flex justify-space-between justify-center">
    <!--Sorting-->
    <v-skeleton-loader
      :loading="loading"
      width="60px"
      type="avatar"
    >
      <v-menu
        offset-y
        bottom
        fixed
      >
        <template v-slot:activator="{ on }">
          <v-icon
            x-large
            class="mouse-cursor"
            :class="{'active':!isSortHovered}"
            v-on="on"
            @mouseenter="isSortHovered=true"
            @mouseleave="isSortHovered=false"
          >
            sort
          </v-icon>
        </template>
        <sorting />
      </v-menu>
    </v-skeleton-loader>
    <!--Pagination-->
    <v-skeleton-loader
      :loading="loading"
      width="100%"
      type="list-item"
    >
      <Pagination :total-pages="totalPages" />
    </v-skeleton-loader>
      
    <!--Stack or Column list toggle buttons-->
    <div class="d-flex flex-row align-center">
      <v-skeleton-loader
        :loading="loading"
        type="avatar"
      >
        <v-icon
          x-large
          :class="{'active':isColumnList}"
          @click="changeListType('stackList')"
        >
          view_headline
        </v-icon>
      </v-skeleton-loader>
      <v-skeleton-loader
        :loading="loading"
        type="avatar"
      >
        <v-icon
          x-large
          style="font-size: 2.8rem"
          :class="{'active':!isColumnList}"
          @click="changeListType('columnList')"
        >
          view_column
        </v-icon>
      </v-skeleton-loader>
    </div>
  </div>
</template>

<script>
    import Pagination from "@/components/IndividualComponents/Pagination";
    import Sorting from "@/components/IndividualComponents/Sorting";

    import {mapState} from "vuex";

    export default {
        name: "ListController",
        components: {Pagination, Sorting},
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