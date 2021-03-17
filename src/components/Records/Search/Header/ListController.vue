<template>
  <div>
    <div class="d-flex justify-space-between justify-center">
      <!--Sorting-->
      <v-skeleton-loader
        v-if="options.hasListType"
        :loading="loading"
        width="60px"
        type="avatar"
      >
        <v-menu
          offset-y
          bottom
          fixed
        >
          <template #activator="{ on }">
            <v-icon
              large
              class="mouse-cursor"
              :class="{'active':!isSortHovered}"
              v-on="on"
              @mouseenter="isSortHovered=true"
              @mouseleave="isSortHovered=false"
            >
              fa-sort-amount-up-alt
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
      <div class="d-flex flex-row align-start">
        <!--Stack or Column list toggle buttons-->
        <div class="d-flex flex-row align-center">
          <v-skeleton-loader
            :loading="loading"
            type="avatar"
          >
            <v-icon
              large
              :class="[{'active':isColumnList},'mr-2']"
              @click="changeListType('stackList')"
            >
              fa-list
            </v-icon>
          </v-skeleton-loader>
          <v-skeleton-loader
            :loading="loading"
            type="avatar"
          >
            <v-icon
              large
              :class="{'active':!isColumnList}"
              @click="changeListType('columnList')"
            >
              fa-th-list
            </v-icon>
          </v-skeleton-loader>
        </div>
      </div>
    </div>
    <HitCount />
  </div>
</template>

<script>
    import HitCount from "./HitCount";
    import Pagination from "./Pagination";
    import Sorting from "./Sorting";

    import {mapState} from "vuex";

    export default {
        name: "ListController",
        components: {HitCount, Pagination, Sorting},
        props:{
          options:{
            type:Object,
            default:null
          }
        },
        data() {
            return {
                isSortHovered: false,
                isColumnList: false // need to go to store to have them synced in everywhere.
            }
        },
        computed: {
            ...mapState('records', ["totalPages", "loading"]),
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
    .active {
        color: lightgrey;
    }

    .theme--light.v-icon:focus::after {
        opacity: 0;
    }
</style>
