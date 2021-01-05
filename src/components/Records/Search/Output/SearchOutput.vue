<template>
  <div>
    <section style="min-height:65vh">
      <h1 class="d-none">
        Records
      </h1>

      <!--Filtered Chips-->
      <div
        v-if="getChips.length"
        class="d-flex align-content-center justify-content-center chips-holder"
      >
        <filter-chips />
      </div>

      <!--List Controller-->
      <ListController
        class="mt-2"
        :options="{hasPagination:true,hasSorting:true,hasListType:true}"
        @ChangeListType="changeListType"
      />
      <!-- Alert -->
      <div
        v-if="getRecordsLength<1 && !loading"
        class="no-data-found"
      >
        <v-alert
          colored-border
          type="info"
        >
          No records match your search!
        </v-alert>
      </div>
      <!--List Row-->
      <div :class="['opacity-0-transition',{'opacity-1-transition':!isColumnList}]">
        <article v-if="!isColumnList">
          <v-skeleton-loader
            class="mt-5"
            :loading="loading"
            type="image"
          >
            <h2 class="d-none">
              Result
            </h2>
            <!-- StackCard view -->
            <RecordsCardStack
              v-for="record in records"
              :key="'record_'+record.id"
              :record="record"
            />
            <!--List Controller-->
            <Pagination
              :total-pages="totalPages"
              class="my-5"
            />
          </v-skeleton-loader>
        </article>
      </div>
      <!-- ColumnCard view -->
      <div :class="['opacity-0-transition',{'opacity-1-transition':isColumnList}]">
        <article v-if="isColumnList">
          <v-skeleton-loader
            class="mt-5"
            :loading="loading"
            type="image"
          >
            <v-row>
              <RecordsCardColumn
                v-for="record in records"
                :key="'record_'+record.id"
                :record="record"
              />
            </v-row>
            <!--List Controller-->
            <Pagination
              :total-pages="totalPages"
              class="my-5"
            />
          </v-skeleton-loader>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
import RecordsCardStack from "./RecordsCardStack";
import ListController from "../Header/ListController";
import RecordsCardColumn from "./RecordsCardColumn";
import {mapState, mapGetters} from 'vuex'
import FilterChips from "../Header/FilterChips";
import filterChipsUtils from "@/utils/filterChipsUtils";
import Pagination from "../Header/Pagination";

export default {
  name: "SearchOutput",
  components: {FilterChips, RecordsCardColumn, ListController, RecordsCardStack, Pagination},
  mixins: [filterChipsUtils],
  data() {
    return {
      isColumnList: false
    }
  },
  computed: {
    ...mapState('records', ["records", "hits", "loading", "totalPages"]),
    ...mapGetters('records', ["getRecordsLength"]),
  },
  methods: {
    changeListType: function (listType) {
      this.isColumnList = listType;
    },
  },
}
</script>
<style scoped>
.chips-holder {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f5f5f5;
  min-height: 50px;
  border: #dbdbdb dotted 2px;
  border-radius: 10px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
}
.no-data-found {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
}
</style>

