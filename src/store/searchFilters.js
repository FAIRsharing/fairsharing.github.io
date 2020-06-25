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
            rawFilters: [],
            filters: [],
            filterButtons: [],
        },
        mutations: {
            setFilters(state, val) {
                if (state.rawFilters.length === 0) {
                    let rawFilters = val['searchFairsharingRecords']['aggregations'];
                    state.rawFilters = buildFilters(rawFilters);
                    state.filters = state.rawFilters.filter(item => (item.type !== 'Boolean' && item.filterName !== 'status'));
                }
            },
            setFilterButtons(state) {
                state.rawFilters.forEach(item => {
                    if (item.type === 'Boolean') {
                        //if it is a boolean object then it will go to the Buttons
                        let ObjectModel = null;
                        switch (item.filterName) {
                            case 'isRecommended':
                                ObjectModel = [{title: 'ALL', active: true, filterName: item.filterName},
                                    {title: 'RECOMMENDED', active: false, filterName: item.filterName, value: true}
                                    , {title: 'NOT RECOMMENDED', active: false, filterName: item.filterName, value: false}];
                                state.filterButtons.push(ObjectModel);
                                break;
                            case 'isMaintained':
                                ObjectModel = [{title: 'ALL', active: true, filterName: item.filterName},
                                    {title: 'MAINTAINED', active: false, filterName: item.filterName, value: true}
                                    , {title: 'NOT MAINTAINED', active: false, filterName: item.filterName, value: false}];
                                state.filterButtons.push(ObjectModel);
                                break;
                            case 'isApproved':
                                ObjectModel = [{title: 'ALL', active: true, filterName: item.filterName},
                                    {title: 'APPROVED', active: false, filterName: item.filterName, value: true}
                                    , {title: 'NOT APPROVED', active: false, filterName: item.filterName, value: false}];
                                state.filterButtons.push(ObjectModel);
                                break;
                        }
                    }
                });
            },
            reformatState(state) {
                let output = [];
                state.filters.forEach(item => {
                    output.push({
                        filter: item.filterLabel,
                        filterName: item.filterName,
                        filterSelected: {},
                        searchTerm: null,
                        subFilters: []
                    })
                });


                for (let i = 0; i < output.length; i++) {
                    if (state.filters[i].values) {
                        // if (state.filters[i].values.length > 10) {
                        for (let k = 0; k < state.filters[i].values.length; k++) {
                            let ObjectModel = {
                                subFilter: state.filters[i].values[k],
                                active: false,
                                inventory: 12
                            };
                            output[i].subFilters.push(ObjectModel);
                        }
                    }
                }
                state.filters = output
            },
            refain(state) {
                state.filters.forEach(item => {
                    if (item.filter === 'isRecommended') {
                        // console.log(item.subFilters)
                        let temp = item.subFilters;
                        temp[0].active = !temp[0].active;
                        // console.log(temp)
                        item.subFilters = function () {
                            return temp;
                        }
                    }
                })
            },
            resetFilterButtons(state, itemParentIndex) {
                state.filterButtons[itemParentIndex].map((item) => {
                    item.active = false;
                });
            }
        },
        actions: {
            async fetchFilters(_, client) {
                await this.commit('searchFilters/setFilters', await client.executeQuery(query));
                this.commit('searchFilters/setFilterButtons');
            },
            callAction:
                function () {
                    this.commit('searchFilters/refain');
                },
            resetFilterButtons: function (_, itemParentIndex) {
                this.commit('searchFilters/resetFilterButtons', itemParentIndex)
            }
        },
        modules: {},
        getters: {
            getFilters: (state) => {
                let output = [];
                state.filters.forEach(function (filter) {
                    output.push({
                        filterName: filter.filterName,
                        filterLabel: filter.filterLabel
                    })
                });
                return output
            }
        }
    }
;
export default filtersStore;

/**
 * Given a searchFairsharingRecords aggregations array, build the values used by the advanced search widgets
 * @param {Array} val - an array of raw filters coming from the api as data['searchFairsharingRecords']['aggregations']
 * @returns {Array} filters - ready to use filters for the advanced search components
 */

let buildFilters = function (val) {
    let filters = [];
    let filtersLabels = filterMapping['autocomplete'];
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
