import filterMapping from "@/data/FiltersLabelMapping.json"
import GraphQLClient from "@/components/GraphClient/GraphClient.js"
import query from "@/components/GraphClient/queries/getFilters.json";
import {isEqual} from 'lodash'
import buttonOptions from '@/data/ButtonOptions.json'

const graphClient = new GraphQLClient();

export const mutations = {
    setFilters(state, data) {
        let rawFilters = data['searchFairsharingRecords']['aggregations'];
        state.rawFilters = buildFilters(rawFilters);
        state.filters = state.rawFilters.filter(item => (item.type !== 'Boolean' && item.filterName !== 'status'));
    },
    setFilterButtons(state) {
        state.filterButtons.push({
            "data": [
                {
                    "title": "Match all terms",
                    "active": true,
                    "filterName": "searchAnd",
                    "value": true
                },
                {
                    "title": "Match any term",
                    "active": false,
                    "filterName": "searchAnd",
                    "value": false
                }
            ],
            "curator_only": false
        });
        state.rawFilters.forEach(item => {
            // TODO: Return here if the button is marked as curator-only and the user isn't logged in as a curator.
            if (item.type === 'Boolean') {
                let ObjectModel = buttonOptions[item.filterName];
                state.filterButtons.push(ObjectModel);
            }
            else if (item.filterName === 'status') {
                let ObjectModel = buttonOptions.status.data;
                ObjectModel.forEach(function (button) {
                    if (Object.prototype.hasOwnProperty.call(button, 'apiIndex')) {
                        button.value = item.values[button["apiIndex"]];
                    }
                });
                state.filterButtons.push({data: ObjectModel, curator_only: false});
            }
        });
    },
    setLoadingStatus(state, status){
        state.isLoadingFilters = status;
    },
    resetFilterButtons(state, itemParentIndex) {
        state.filterButtons[itemParentIndex].data.map((item) => {
            item.active = false;
        });
    },
    activateButton(state, item) {
        state.filterButtons[item.itemParentIndex].data.map((filterItem) => {
            if (isEqual(filterItem, item.activeItem)) {
                filterItem.active = true;
            }
        });
    }
};
export const actions = {
    resetFilterButtons(state, itemParentIndex) {
        this.commit('searchFilters/resetFilterButtons', itemParentIndex)
    },
    activateButton(state, item) {
        this.commit('searchFilters/activateButton', item)
    },
    async assembleFilters(){
        this.commit("searchFilters/setLoadingStatus", true);
        let data = await graphClient.executeQuery(query);
        this.commit('searchFilters/setFilters', data);
        this.commit('searchFilters/setFilterButtons');
        this.commit("searchFilters/setLoadingStatus", false);
    }
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
        isLoadingFilters: false
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
