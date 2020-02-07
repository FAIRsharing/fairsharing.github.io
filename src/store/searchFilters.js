import query from "../components/GraphClient/queries/getFilters.json"
import filterMapping from "../components/Records/FiltersLabelMapping.js"

export default {
    namespaced: true,
    state: {
        filters: [],
    },
    mutations: {
        setFilters(state, val){
            if (state.filters.length === 0){
                let rawFilters = val['searchFairsharingRecords']['aggregations'];
                state.filters = buildFilters(rawFilters);
            }
        }
    },
    actions: {
        async fetchFilters(_, client){
            this.commit('searchFilters/setFilters', await client.executeQuery(query));
        }
    },
    modules: {
    }
}

let buildFilters = function(val){
    // Need to return filter values, filter label and filter name
    let filters = [];

    // start with simple input
    filterMapping.input.forEach(function(filter){
        filter.values = null;
        filters.push(filter)
    });

    let filtersLabels = filterMapping['autocomplete'];
    // now deal with incoming data
    Object.keys(val).forEach(function(key){
        let filterHasLabel = Object.prototype.hasOwnProperty.call(
            filtersLabels,
            key);
        if (!filterHasLabel){
            console.log("MISSING LABEL FOR: " + key)
        }
        else {
            let filter = filtersLabels[key];
            filter.values = null;
            let filterValues = [];

            let buckets = val[key]['buckets'];
            buckets.forEach(function(bucket){
                if (Object.prototype.hasOwnProperty.call(
                    bucket,
                    "key_as_string")){
                    filterValues.push(bucket["key_as_string"]);
                }
                else {
                    filterValues.push(bucket['key']);
                }
            });
            if (filterValues.length > 0){
                filter.values = filterValues
            }
            filters.push(filter);
        }
    });
    return filters;
};
