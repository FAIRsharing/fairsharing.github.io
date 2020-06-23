<template>
  <div>
    <!-- 3 row buttons     -->
    <div
      v-for="filterHolderIndex in 3"
      :key="filterHolderIndex"
      class="d-flex flex-row justify-start mb-1 mb-lg-2"
    >
      <v-btn
        v-for="(item,index) in buttonsGroup[filterHolderIndex-1]"
        :key="index"
        color="primary"
        class="mr-1 mr-lg-2"
        :class="[index===0?'first-child':'flex-1',{'button-style-md-screens':mdScreens}]"
        :outlined="!item.active"
        @click="selectFilter(index,buttonsGroup[filterHolderIndex-1])"
      >
        {{ item.title }}
      </v-btn>
    </div>
    <!-- 1 row buttons for records status    -->
    <div class="d-flex flex-row justify-start mb-1 mb-lg-2">
      <v-tooltip
        v-for="(item,index) in buttonsRecordsState"
        :key="index"
        bottom
      >
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            class="mr-1 mr-lg-2 "
            :class="[index===0?'first-child':'flex-1',{'buttons-md-style':mdScreens && index!==0}]"
            :outlined="!item.active"
            @click="selectFilter(index,buttonsRecordsState)"
            v-on="on"
          >
            {{ item.title }}
          </v-btn>
        </template>
        <span>{{ item.toolTip }}</span>
      </v-tooltip>
    </div>
    <!-- expansion Panels    -->
    <v-expansion-panels
      v-if="filters.length>0"
      v-model="panel"
      multiple
      flat
      hover
      accordion
    >
      <ExpansionPanel
        v-for="filter in calc"
        :key="filter.filterLabel"
        :filter="filter"
      />
    </v-expansion-panels>
  </div>
</template>

<script>
    import {mapState} from "vuex"
    import ExpansionPanel from "./ExpansionPanel";
    export default {
        name: "FilterButtons",
        components: {ExpansionPanel},
        props: {mdScreens: {default: null, type: Boolean}},
        data() {
            return {
                searchTerm: '',
                selectedSubFilter: null,
                panel: [],
                filterSelected: {},
                buttonsGroup: [
                    [{title: 'ALL', active: true}, {title: 'RECOMMENDED', active: false}, {
                        title: 'NOT RECOMMENDED',
                        active: false
                    }],
                    [{title: 'ALL', active: true}, {title: 'PUBLISHED', active: false}, {
                        title: 'NOT PUBLISHED',
                        active: false
                    }],
                    [{title: 'ALL', active: true}, {title: 'MAINTAINED', active: false}, {
                        title: 'NOT MAINTAINED',
                        active: false
                    }],
                ],
                buttonsRecordsState: [
                  {
                      title: 'ALL',
                      active: true,
                      toolTip: 'Show All Records',
                  },
                  {
                      title: 'U',
                      active: false,
                      toolTip: 'Show Uncertain Records'
                  },
                  {
                      title: 'D',
                      active: false,
                      toolTip: 'Show Deprecated Records'
                  },
                  {
                      title: 'I',
                      active: false,
                      toolTip: 'Show In Development Records'
                  },
                  {
                      title: 'R',
                      active: false,
                      toolTip: 'Show Ready Records'
                  }]
            }
        },
        computed: {
            ...mapState("searchFilters", ["filters"]),
            calc() {
                this.setPanel();
                this.createIndexForFilters();
                return this.filters;
            }
        },
        methods: {
            selectFilter: function (index, selectedButtonsArray) {
                selectedButtonsArray.map(item => item.active = false);
                selectedButtonsArray[index].active = true;
            },
            setPanel() {
                this.panel = [...Array(this.filters.length).keys()].map((k, i) => i)
            },
            resetPanel() {
                this.panel = []
            },
            createIndexForFilters: function () {
                this.filters.forEach(item => {
                    this.filterSelected[item.filter] = [];
                });
            },
        },
    }
</script>

<style scoped lang="scss">
    .button-style-md-screens {
        font-size: 9px !important;
    }
    .first-child {
        font-size: 11px;
        width: 16.5%;
    }
    .flex-1 {
        font-size: 11px;
        flex: 1;
    }
    .buttons-md-style {
        min-width: 32px !important;
    }
    #status-style {
        color: white;
        position: absolute;
        top: 20%;
        left: 35%;
        font-size: 20px;
        cursor: help;
    }
</style>
