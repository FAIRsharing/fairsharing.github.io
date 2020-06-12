import query from "../components/GraphClient/queries/getFilters.json"
import filterMapping from "../components/Records/FiltersLabelMapping.js"

/**
 * The searchFilters store trigger a single field query to searchFairsharingRecords, gets the aggregation array and
 * builds the filtering system to be used by advanced search functions.
 * @type {Object}
 */
let filtersStore = {
    namespaced: true,
    state: {
        filters: [],
    },
    mutations: {
        setFilters(state, val) {
            if (state.filters.length === 0) {
                let rawFilters = val['searchFairsharingRecords']['aggregations'];
                state.filters = buildFilters(rawFilters);
                this.commit('searchFilters/reformatState');
            }
        },
        reformatState(state) {
            let output = []
            state.filters.forEach(item => {
                output.push({
                    filter: item.filterLabel,
                    filterSelected: {},
                    searchTerm: null,
                    subFilters: []
                })
            });


            let ObjectModel = {
                subFilter: null,
                active: false,
                inventory: 9
            }

            for (let i = 0; i < output.length; i++) {
                    if (state.filters[i].values) {
                        for (let k = 0; k < state.filters[i].values.length; k++) {
                            ObjectModel = {
                                subFilter: state.filters[i].values[k],
                                active: false,
                                inventory: 9
                            }
                            output[i].subFilters.push(ObjectModel);
                        }
                    }
            }

            state.filters = output
        },
        refain(state) {
            console.log('called');
            // let output = []
            // output = state.filters
            state.filters.forEach(item => {
                if (item.filter === 'isRecommended') {
                    console.log(item.subFilters)
                    let temp = item.subFilters
                    temp[0].active = !temp[0].active
                    console.log(temp)
                    item.subFilters = function () {
                        return temp;
                    }
                }
                // state.filters[1]=item;
            })
            console.log('whole', state.filters[1])
            // state.filters = output
        }
    },
    actions: {
        async fetchFilters(_, client) {
            this.commit('searchFilters/setFilters', await client.executeQuery(query));
        },
        callAction: function () {
            this.commit('searchFilters/refain');
        }
    },
    modules: {},
    getters: {}
};
export default filtersStore;

/**
 * Given a searchFairsharingRecords aggregations array, build the values used by the advanced search widgets
 * @param {Array} val - an array of raw filters coming from the api as data['searchFairsharingRecords']['aggregations']
 * @returns {Array} filters - ready to use filters for the advanced search components
 */
let buildFilters = function (val) {
    // Need to return filter values, filter label and filter name
    let filters = [];

    // start with simple input
    filterMapping.input.forEach(function (filter) {
        filter.values = null;
        filters.push(filter)
    });

    let filtersLabels = filterMapping['autocomplete'];
    // now deal with incoming data
    Object.keys(val).forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(filtersLabels, key)) {
            let filter = filtersLabels[key];
            filter.values = null;
            let filterValues = [];

            let buckets = val[key]['buckets'];
            buckets.forEach(function (bucket) {
                if (Object.prototype.hasOwnProperty.call(
                    bucket,
                    "key_as_string")) {
                    filterValues.push(bucket["key_as_string"]);
                } else {
                    filterValues.push(bucket['key']);
                }
            });
            filter.values = filterValues;
            filters.push(filter);
        }
    });
    return filters;
};
