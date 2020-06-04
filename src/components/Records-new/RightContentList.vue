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
        <section
          v-for="n in 30"
          :key="n"
          class="pt-3 pt-lg-4"
        >
          <RecordsCardStack
            :key="n"
            :record-status="n%2===0?'ready':'deprecated'"
            :recommended="n%3===0"
          />
        </section>
      </article>
    </div>

    <div :class="['opacity-0-transition',{'opacity-1-transition':isColumnList}]">
      <v-row v-show="isColumnList">
        <RecordsCardColumn
          v-for="n in 30"
          :key="n"
          :record-status="n%2===0?'ready':'deprecated'"
          :recommended="n%3===0"
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

    export default {
        name: "RightContentList",
        components: {RecordsCardColumn, ListController, RecordsCardStack},
        data() {
            return {
                isColumnList: false
            }
        },
        methods: {
            changeListType: function (listType) {
                this.isColumnList = listType;
            },
        }
    }
</script>
