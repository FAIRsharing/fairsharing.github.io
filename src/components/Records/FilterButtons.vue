<template>
  <div>
    <!-- 3 row buttons     -->
    <div
      v-for="index in filterButtons.length"
      :key="index"
      class="d-flex flex-row justify-start mb-1 mb-lg-2"
    >
      <v-btn
        v-for="(item,filter_index) in filterButtons[index-1]"
        :key="filter_index"
        color="primary"
        class="mr-1 mr-lg-2"
        :class="[filter_index===0?'first-child':'flex-1',{'button-style-md-screens':mdScreens}]"
        :outlined="!item.active"
        @click="selectFilter(filter_index,filterButtons[index-1],item)"
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
            @click="selectFilter(index,buttonsRecordsState,item)"
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
    import {mapGetters, mapState} from "vuex"
    import ExpansionPanel from "./ExpansionPanel";
    import {has} from 'lodash'

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
                formData: {},
            }
        },
        computed: {
            ...mapGetters("searchFilters", ["getFilters"]),
            ...mapState("searchFilters", ["filterButtons"]),
            calc() {
                this.setPanel();
                this.createIndexForFilters();
                return this.getFilters;
            },
            currentPath() {
                return this.$route.query;
            }
        },
        watch: {
            currentPath: async function () {
                let _module = this;
                Object.keys(_module.$route.query).forEach(function (prop) {
                    console.log(prop);
                    for(let i=0;i<_module.filterButtons.length;i++){
                        _module.filterButtons[i].forEach(function (item)
                        {
                            if(item.filterName===prop){
                                item.active = false;
                            }
                        });
                    }
                    // _module.filterButtons[0][2].active = true;
                    // console.log(_module.filterButtons[0][2]);
                });
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
            /**
             * Apply the filters by building the new query parameters using the form data.
             */
            applyFilters: function (filter_index, selectedItem) {
                let _module = this;
                if (has(selectedItem, 'value')) {
                    let previousQuery = _module.formData[selectedItem.filterName]
                    _module.formData[selectedItem.filterName] = encodeURIComponent(selectedItem.value);
                    if (this.formData[selectedItem.filterName] !== previousQuery) {
                        this.$router.push({
                            name: _module.$route.name,
                            query: this.formData
                        });
                    }
                } else {
                    if (has(_module.formData, selectedItem.filterName)) {
                        delete _module.formData[selectedItem.filterName]
                        this.$router.push({
                            name: _module.$route.name,
                            query: this.formData
                        });
                    }
                }
            },
            selectFilter: function (filter_index, selectedButtonsArray, selectedItem) {
                selectedButtonsArray.map(item => item.active = false);
                selectedButtonsArray[filter_index].active = true;
                this.applyFilters(filter_index, selectedItem);
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
