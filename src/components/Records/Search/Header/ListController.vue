<template>
  <div>
    <div class="d-flex justify-space-between justify-center">
      <!--Sorting-->
      <v-skeleton-loader
        v-if="options.hasSorting"
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
            <div v-on="on">
              <v-tooltip top>
                <!-- eslint-disable-next-line  vue/no-template-shadow -->
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
                <span>{{ listControllerData.sort }}</span>
              </v-tooltip>
              <!-- eslint-enable-next-line  vue/no-template-shadow -->
            </div>
          </template>
          <sorting />
        </v-menu>
      </v-skeleton-loader>
      <div
        v-else
        style="width: 60px;"
      />
      <!--Pagination-->
      <v-skeleton-loader
        v-if="options.hasPagination"
        :loading="loading"
        width="100%"
        type="list-item"
      >
        <Pagination
          :total-pages="totalPages"
          :current-page="currentPage"
        />
      </v-skeleton-loader>
      <div
        v-else
        style="width: 100%"
      />
      <!--Stack or Column list toggle buttons-->
      <div class="d-flex flex-row align-start">
        <!--Stack or Column list toggle buttons-->
        <div
          class="d-flex flex-row align-center"
        >
          <div
            v-if="options.hasListType"
            class="d-flex"
          >
            <v-skeleton-loader
              :loading="loading"
              type="avatar"
            >
              <v-tooltip top>
                <template #activator="{ on }">
                  <v-icon
                    large
                    :class="[{'active':isColumnList},'mr-2']"
                    v-on="on"
                    @click="changeListType('stackList')"
                  >
                    fa-list
                  </v-icon>
                </template>
                <span>{{ listControllerData.stackList }}</span>
              </v-tooltip>
            </v-skeleton-loader>
            <v-skeleton-loader
              :loading="loading"
              type="avatar"
            >
              <v-tooltip top>
                <template #activator="{ on }">
                  <v-icon
                    large
                    :class="{'active':!isColumnList}"
                    v-on="on"
                    @click="changeListType('columnList')"
                  >
                    fa-th
                  </v-icon>
                </template>
                <span>{{ listControllerData.gridList }}</span>
              </v-tooltip>
            </v-skeleton-loader>
          </div>
          <div
            v-else
            style="width: 70px;"
          />
        </div>
      </div>
    </div>
    <HitCount />
    <SummaryDownload />
  </div>
</template>

<script>
    import HitCount from "./HitCount";
    import SummaryDownload from "./SummaryDownload";
    import Pagination from "./Pagination";
    import Sorting from "./Sorting";
    import {mapState} from "vuex";
    import listControllerData from "@/data/ListControllerData.json";

    export default {
        name: "ListController",
        components: {HitCount, SummaryDownload, Pagination, Sorting},
        props:{
          options:{
            type:Object,
            default:null
          }
        },
        data() {
            return {
              showMenu:false,
              listControllerData: listControllerData,
              isSortHovered: false,
                isColumnList: false // need to go to store to have them synced in everywhere.
            }
        },
        computed: {
            ...mapState('records', ["totalPages", "loading", "currentPage"]),
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
