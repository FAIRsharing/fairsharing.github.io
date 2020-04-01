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
      v-model="toggleButtonText"
      mandatory
      shaped
    >
      <v-btn
        value="asc"
        :disabled="!sortingMethodStatus"
        @click="applySortQuery(activeSortFilterName,'asc')"
      >
        ASC
      </v-btn>
      <v-btn
        value="desc"
        :disabled="!sortingMethodStatus"
        @click="applySortQuery(activeSortFilterName,'desc')"
      >
        DESC
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
    import {isEqual} from 'lodash';

    export default {
        name: "Sorting",
        data() {
            return {
                sortFilters: [
                    {name: 'name', active: false},
                    {name: 'abbreviation', active: false},
                    // as much as possible accepts filter as object containing name and active. active default is false.
                ],
                activeSortFilterName: 'name',
                toggleButtonText: ['asc', 'desc'],
                sortingMethodStatus: false,
            }
        },
        watch: {
            '$route.query': function (newVal) {
                this.checkOrderByQueryExists(newVal);
            }
        },
        created() {
            this.checkOnceOrderByExists(this.$route.query);
        },
        methods:
            {
              /**
               * Get the query first time in OnCreate and update sorting filter status either active or deActive based on received query
               * @param {Object} query - the orderBy query is checked whether it is existed or not
               */
                checkOnceOrderByExists: function (query) {
                    if (Object.prototype.hasOwnProperty.call(query, "orderBy")) {
                        let arrayedQuery = this.$route.query.orderBy.toString().split(",");
                        let activeFilter = {name: arrayedQuery[0], active: false}; // sortName name/best-match-etc
                        this.toggleButtonText = arrayedQuery[1]; // sortMethod asc or desc
                        this.changeActiveFilter(activeFilter);
                    }
                },
              /**
               * Set the sorting filter specific item active and also call applySortQuery in order to sort
               * @param {Object} activeFilter - the filter that needs to be activated
               */
                changeActiveFilter: function (activeFilter) {
                    this.activateSortFilters(activeFilter);
                    this.activeSortFilterName = activeFilter.name;
                    if (this.toggleButtonText.length === 2) // if its the first time page is initialized.
                    {
                        this.applySortQuery(this.activeSortFilterName, 'asc');
                    } else {
                        this.applySortQuery(this.activeSortFilterName, this.toggleButtonText);
                    }
                },
              /**
               * Set the sorting filter specific item active
               * @param {Object} activeFilter - the filter that needs to be activated
               */
              activateSortFilters: function (activeFilter) {
                    this.sortFilters.map((item) => {
                        isEqual(item, activeFilter) ? item.active = true : item.active = false
                    });
                    this.sortingMethodStatus = true;
                },
              /**
               * Set the sorting filter to be reset so no filter will be active
               */
                deActiveSortFilters: function () {
                    this.sortFilters.map((item) => {
                        item.active = false
                    });
                    this.sortingMethodStatus = false;
                },
              /**
               * Set the sorting filter list active or de-active based on the received query object
               * @param {Object} queryExistsInput - the query object to activate sorting filters
               */
              checkOrderByQueryExists: function (queryExistsInput) {
                    let _module = this;
                    if (Object.prototype.hasOwnProperty.call(queryExistsInput, "orderBy")) {
                        let arrayedQuery = queryExistsInput.orderBy.toString().split(",");
                        _module.toggleButtonText = arrayedQuery[1];
                        this.deActiveSortFilters();
                        let activeFilter = {name: arrayedQuery[0], active: false}; // sortName name/best-match-etc
                        _module.activateSortFilters(activeFilter);
                    } else {
                        this.deActiveSortFilters();
                    }
                },
                /**
                 * Set the orderBy parameter value to the given input for vueJs router
                 * @param {string} activeSortFilterName - sorting under this name
                 * @param {string} sortMethod - can be either ASC or DESC
                 */
                applySortQuery: async function (activeSortFilterName, sortMethod) {
                    let _module = this;
                    let currentQueryValues;
                    let currentQuery = {};
                    currentQueryValues = [activeSortFilterName, sortMethod];
                    Object.keys(_module.$route.query).forEach(function (param) {
                        currentQuery[param] = _module.$route.query[param]
                    });
                    currentQuery.orderBy = currentQueryValues.join(',');
                    if (!isEqual(_module.$route.query, currentQuery)) {
                        await _module.$router.push({
                            name: _module.$route.name,
                            query: currentQuery
                        });
                    }
                },
            }
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