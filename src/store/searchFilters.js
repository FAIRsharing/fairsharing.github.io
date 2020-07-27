import filterMapping from "../components/Records/FiltersLabelMapping.json"
import {isEqual} from 'lodash'
import ButtonOptions from './ButtonOptions.json'

export const mutations = {
    setFilters(state, data) {
        let rawFilters = data['searchFairsharingRecords']['aggregations'];
        state.rawFilters = buildFilters(rawFilters);
        state.filters = state.rawFilters.filter(item => (item.type !== 'Boolean' && item.filterName !== 'status'));
    },
    setFilterButtons(state) {
        state.rawFilters.forEach(item => {
            if (item.type === 'Boolean') {
                let ObjectModel = ButtonOptions[item.filterName];
                state.filterButtons.push(ObjectModel);
            } else if (item.filterName === 'status') {
                let ObjectModel = ButtonOptions.status;
                ObjectModel.forEach(function (button) {
                    if (Object.prototype.hasOwnProperty.call(button, 'apiIndex')) {
                        button.value = item.values[button["apiIndex"]];
                    }
                });
                state.filterButtons.push(ObjectModel);
            }
        });
    },
    resetFilterButtons(state, itemParentIndex) {
        state.filterButtons[itemParentIndex].map((item) => {
            item.active = false;
        });
    },
    activateFilterButtonsItem(state, {activeItem, itemParentIndex}) {
        state.filterButtons[itemParentIndex].map((item) => {
            if (isEqual(item, activeItem)) {
                item.active = true;
            }
        });
    }
};
export const actions = {
    fetchFilters(_, data) {
        this.commit('searchFilters/setFilters', data);
        this.commit('searchFilters/setFilterButtons');
    },
    resetFilterButtons: function (_, itemParentIndex) {
        this.commit('searchFilters/resetFilterButtons', itemParentIndex)
    },
    activateFilterButtonsItem: ({commit}, activeItem, itemParentIndexValue) => commit('activateFilterButtonsItem', activeItem, itemParentIndexValue)
};
export const getters = {
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
};

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
    mutations: mutations,
    actions: actions,
    getters: getters
};
export default filtersStore;

/**
 * Given a searchFairsharingRecords aggregations array, build the values used by the advanced search widgets
 * @param {Array} val - an array of raw filters coming from the api as data['searchFairsharingRecords']['aggregations']
 * @returns {Array} filters - ready to use filters for the advanced search components
 */

export const buildFilters = function (val) {
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
