<template>
  <div>
    <div class="d-flex align-items-center mb-4">
      <span class="mr-4">Sort By</span>
      <ul class="d-flex align-items-center">
        <li
          v-for="(sortButton,index) in sortFilters"
          :key="index"
          class="mr-1"
        >
          <v-btn
            :class="sortButton.active?'primary':'depressed'"
            class="mr-2"
            @click="changeActiveFilter(sortButton)"
          >
            <b>{{ sortButton.name }}</b>
          </v-btn>
        </li>
      </ul>
    </div>
    <v-btn-toggle
      v-model="ToggleButtonText"
      mandatory
      shaped
    >
      <v-btn
        value="asc"
        @click="applySortQuery(activeSortFilterName,'asc')"
        :class="'v-btn--active'?ToggleButtonText==='asc':''"
      >
        ASC
      </v-btn>
      <v-btn
        value="desc"
        @click="applySortQuery(activeSortFilterName,'desc')"
        :class="'v-btn--active'?ToggleButtonText==='desc':''"
      >
        DESC
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
    export default {
        name: "Sorting",
        data() {
            return {
                sortFilters: [
                    {name: 'name', active: true},
                    {name: 'abbreviation', active: false},
                    {name: 'best-match', active: false},
                ],
                activeSortFilterName: 'name',
                ToggleButtonText: ['asc', 'desc'],
            }
        },
        watch: {
/*           '$route.name': function () {
             // let _module = this;
             //  this.applySortQuery(_module.activeSortFilterName,'asc');
             console.log('$routeName',this.$route.name);
           },
            '$route.query': function (newVal) {
                 let _module = this;
                if (Object.prototype.hasOwnProperty.call(newVal, "orderBy")) {
                    console.log('if clouse');
                } else {
                    console.log('apply order again',_module.activeSortFilterName);
                  // this.applySortQuery(_module.activeSortFilterName,'asc');
                }
            }*/
        },
        methods:
            {
                changeActiveFilter(activeFilter) {
                    // console.log('sortFilters', this.sortFilters);
                    this.sortFilters.map((item) => {
                        item === activeFilter ? item.active = true : item.active = false
                    });
                    this.activeSortFilterName = activeFilter.name;
                    const _module = this;
                     console.log("activeSortFilterName", this.activeSortFilterName);
                    this.applySortQuery(_module.activeSortFilterName,'asc');
                },
              /**
               * Set the orderBy parameter value to the given input for vueJs router
               * @param {string} activeSortFilterName - sorting under this name
               * @param {string} sortMethod - can be either ASC or DESC
               */
              applySortQuery: async function (activeSortFilterName,sortMethod) {
                let _module = this;
                let currentQueryValues = [];
                let currentQuery = {};
                currentQueryValues = [activeSortFilterName,sortMethod];
                Object.keys(_module.$route.query).forEach(function (param) {
                  currentQuery[param] = _module.$route.query[param]
                });
                currentQueryValues = currentQueryValues.join(',');
                currentQuery.orderBy = currentQueryValues;
                await _module.$router.push({
                  name: _module.$route.name,
                  query: currentQuery
                });
              },
            },
    }
</script>

<style scoped lang="scss">

    ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            .v-btn {
                width: 150px;
            }
        }
    }
</style>