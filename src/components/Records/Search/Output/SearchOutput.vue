<template>
  <section>
    <h1 class="d-none">
      Records
    </h1>
    <!--Filtered Chips-->
    <div class="d-flex align-content-center justify-content-center chips-holder">
      <filter-chips />
    </div>

    <!--List Controller-->
    <ListController
      class="mt-2"
      @ChangeListType="changeListType"
    />

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
          <RecordsCardStack
            v-for="record in records"
            :key="'record_'+record.id"
            :record="record"
          />
        </v-skeleton-loader>
      </article>
    </div>

    <!-- Card view -->
    <div :class="['opacity-0-transition',{'opacity-1-transition':isColumnList}]">
      <v-skeleton-loader
        class="mt-5"
        :loading="loading"
        type="image"
      >
        <v-row v-show="isColumnList">
          <RecordsCardColumn
            v-for="record in records"
            :key="'record_'+record.id"
            :record="record"
          />
        </v-row>
      </v-skeleton-loader>
    </div>
  </section>
</template>

<script>
    import RecordsCardStack from "./RecordsCardStack";
    import ListController from "../Header/ListController";
    import RecordsCardColumn from "./RecordsCardColumn";
    import {mapState} from 'vuex'
    import FilterChips from "../Header/FilterChips";

    export default {
        name: "SearchOutput",
        components: {FilterChips, RecordsCardColumn, ListController, RecordsCardStack},
        data() {
            return {
                isColumnList: false
            }
        },
        computed: {
            ...mapState('records', ["records", "hits", "loading"])
        },
        methods: {
            changeListType: function (listType) {
                this.isColumnList = listType;
            },
        },
    }
</script>
<style lang="scss">
    .chips-holder {
        background: #f5f5f5;
        min-height: 50px;
        border: #dbdbdb dotted 2px;
        border-radius: 10px;
        -moz-border-radius: 10px;
        -webkit-border-radius: 10px;
    }
</style>
