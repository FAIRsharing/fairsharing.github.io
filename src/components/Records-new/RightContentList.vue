<template>
  <section>
    <h1 class="d-none">
      Records
    </h1>
    <!--Filtered Chips-->
    <div style="background: lightblue;width: 100%;height: 50px;display: flex;justify-content: center;align-items: center">
      place of filter Chip
    </div>

    <!--List Controller-->
    <ListController
      class="mt-2"
      @ChangeListType="changeListType"
    />

    <!--List Row-->
    <div :class="['opacity-0-transition',{'opacity-1-transition':!isColumnList}]">
      <article v-if="!isColumnList">
        <h2 class="d-none">
          Result
        </h2>
        <RecordsCardStack
          v-for="record in records"
          :key="'record'+record.id"
          :record="record"
        />
      </article>
    </div>

    <div :class="['opacity-0-transition',{'opacity-1-transition':isColumnList}]">
      <v-row v-show="isColumnList">
        <RecordsCardColumn
          v-for="record in records"
          :key="'record'+record.id"
          :recommended="record.recommended"
        />
      </v-row>
    </div>

    <!--List Controller-->
    <!--        <ListController class="mt-2 " @ChangeListType="changeListType"></ListController>-->
  </section>
</template>

<script>
    import RecordsCardStack from "./RecordsCardStack";
    import ListController from "./ListController";
    import RecordsCardColumn from "./RecordsCardColumn";
    import {mapState} from 'vuex'

    export default {
        name: "RightContentList",
        components: {RecordsCardColumn, ListController, RecordsCardStack},
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
