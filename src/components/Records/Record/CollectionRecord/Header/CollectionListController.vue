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
          <CollectionSorting />
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
        <CollectionPagination :total-pages="totalPages" />
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
          <div
            v-else
            style="width: 70px;"
          />
        </div>
      </div>
    </div>
    <HitCount />
  </div>
</template>

<script>
    import {mapState} from "vuex";
    import CollectionPagination from "@/components/Records/Record/CollectionRecord/Header/CollectionPagination";
    import CollectionSorting from "@/components/Records/Record/CollectionRecord/Header/CollectionSorting";
    import HitCount from "@/components/Records/Search/Header/HitCount";

    export default {
        name: "CollectionListController",
        components: {HitCount, CollectionSorting, CollectionPagination},
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
            ...mapState('collectionRecords', ["totalPages", "loading"]),
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
