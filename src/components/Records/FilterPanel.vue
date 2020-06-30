<template>
  <div>
    <!-- Filter Buttons     -->
    <FilterButtons/>

    <!-- expansion Panels    -->
    <v-expansion-panels
      v-if="getFilters.length>0"
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
    import {mapGetters} from "vuex"
    import ExpansionPanel from "./ExpansionPanel";
    import FilterButtons from "./FilterButtons";

    export default {
        name: "FilterPanel",
        components: {FilterButtons, ExpansionPanel},
        data() {
            return {
                searchTerm: '',
                selectedSubFilter: null,
                panel: [],
                filterSelected: {},
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
                    }],
            }
        },
        computed: {
            ...mapGetters("searchFilters", ["getFilters"]),
            calc() {
                this.setPanel();
                this.createIndexForFilters();
                return this.getFilters;
            },
            currentPath() {
                return this.$route.query;
            },
            selectedFilterButtonIndexes() {
                let output = [];
                for (let i = 0; i < this.filterButtons.length; i++) {
                    let obj = {ButtonGroupIndex: i, ItemIndex: 0}
                    output.push(obj);
                }
                return output
            }
        },
        watch: {
            currentPath: async function () {
                // let _module = this;
                // _module.$route.query.forEach(prop=>{console.log('b',prop)});
                // Object.keys(_module.$route.query).forEach(function (prop) {console.log(prop);});
            }
        },
        methods: {
            updateFilterButtons: function (filter_index, selectedButtonsArray, selectedItem) {
                // console.log(filter_index)
                // console.log(selectedButtonsArray)
                console.log('a', selectedItem)
                selectedButtonsArray.map(item => item.active = false);
                selectedButtonsArray[filter_index].active = true;
                console.log(selectedButtonsArray)
            },
            setPanel() {
                this.panel = [...Array(this.getFilters.length).keys()].map((k, i) => i)
            },
            resetPanel() {
                this.panel = []
            },
            createIndexForFilters: function () {
                this.getFilters.forEach(item => {
                    this.filterSelected[item.filter] = [];
                });
            },
        },
    }
</script>

<style scoped lang="scss">
    .buttons-md-style {
        min-width: 32px !important;
    }
    .first-child {
      font-size: 11px;
      width: 16.5%;
    }

    .flex-1 {
      font-size: 11px;
      flex: 1;
    }


</style>
