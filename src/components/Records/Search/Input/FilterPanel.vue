<template>
  <div>
    <!-- Filter Buttons     -->
    <FilterButtons />

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
        v-for="filter in setup"
        :key="filter.filterLabel"
        :filter="filter"
      />
    </v-expansion-panels>
  </div>
</template>

<script>
    import {mapGetters} from "vuex"
    import ExpansionPanel from "./FilterAutocomplete";
    import FilterButtons from "./FilterButtons";

    export default {
        name: "FilterPanel",
        components: {FilterButtons, ExpansionPanel},
        data() {
            return {
                panel: [],
                filterSelected: {},
            }
        },
        computed: {
            ...mapGetters("searchFilters", ["getFilters"]),
            setup() {
                this.setPanel();
                this.createIndexForFilters();
                return this.getFilters;
            },
            /* currentPath() {

                                 return this.$route.query;

            }, */
        }
        /*watch: {
            currentPath: async function () {
                // let _module = this;
                // _module.$route.query.forEach(prop=>{console.log('b',prop)});
                // Object.keys(_module.$route.query).forEach(function (prop) {console.log(prop);});
            }

        }*/
        ,
        methods: {
            setPanel() {
                this.panel = [...Array(this.getFilters.length).keys()].map((k, i) => i)
            },
            resetPanel() {
                this.panel = []
            },
            createIndexForFilters: function () {
                this.getFilters.forEach(item => {
                    this.filterSelected[item.filterName] = [];
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
