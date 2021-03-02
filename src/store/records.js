import Client from "@/components/GraphClient/GraphClient.js"
import recordsQuery from "@/components/GraphClient/queries/getRecords.json"
import filterMapping from "@/data/FiltersLabelMapping.json"

let client = new Client();

export const mutations = {
    setRecords(state, data) {
        state.records = data['records'];
        state.facets = buildFacets(data["aggregations"]);
        state.totalPages = data["totalPages"];
        state.perPage = data["perPage"];
        state.currentPage = data["currentPage"];
        state.hits = data["totalCount"];
    },
    resetRecords(state) {
        recordsQuery.queryParam = null;
        state.records = [];
    },
    resetPages(state) {
        state.hits = null;
        state.perPage = null;
        state.currentPage = null;
        state.totalPages = null;
    },
    setLoadingStatus(state, status) {
        state.loading = status;
    },
    cleanRecordsStore(state) {
        state.records = [];
        state.facets = [];
        state.hits = null;
        state.loading = false;
        state.totalPages = null;
        state.perPage = null;
        state.currentPage = null;
    }
};
export const actions = {
    async fetchRecords(state, params) {
        this.commit("records/setLoadingStatus", true);
        this.commit("records/resetRecords");
        this.commit("records/resetPages");
        if (Object.keys(params).length > 0) {
            recordsQuery.queryParam = params;
        }
        const data = await client.executeQuery(recordsQuery);
        this.commit('records/setRecords', data["searchFairsharingRecords"]);
        this.commit("records/setLoadingStatus", false);
    },
    resetRecords() {
        this.commit("records/resetRecords");
    },
};
export const getters = {
    getFilter: (state) => (facetName) => {
        if (state.facets.length > 0) {
            let currentFacet = JSON.parse(JSON.stringify(state.facets.find(facet => facet.filterName === facetName)));
            currentFacet['values'] = currentFacet['buckets'];
            return currentFacet;
        }
        return [];
    },
    getRecordsLength: (state) => {
        return state.records.length;
    }
};

/**
 * The records store handles the requests related to records (searchFairsharingRecords and fairsharingRecord).
 * @type {Object}
 */
let recordsStore = {
    namespaced: true,
    state: {
        records: [],
        facets: [],
        hits: null,
        loading: false,
        totalPages: null,
        perPage: null,
        currentPage: null
    },
    mutations: mutations,
    actions: actions,
    getters: getters
};
export default recordsStore;

/**
 * Given an object containing the raw facets coming from the client and a mapping object , build the ready to use facets
 * for usage by the Vue components.
 * @param {Object} rawFacets - the aggregation object coming from the API response as data['aggregations']
 * @returns {Array} output - the array of ready to use facets containing a name, a label and values
 */
export const buildFacets = function (rawFacets) {
    let output = [];
    const mapper = filterMapping["autocomplete"];

    Object.keys(rawFacets).forEach(function (facetName) {
        if (Object.prototype.hasOwnProperty.call(mapper, facetName)) {
            let localFacet = mapper[facetName];
            rawFacets[facetName]["buckets"].forEach(function (bucket) {
                if (Object.prototype.hasOwnProperty.call(bucket, "key_as_string")) {
                    bucket["key"] = bucket["key_as_string"];
                }
            });
            localFacet['buckets'] = rawFacets[facetName]['buckets'];
            output.push(localFacet);
        }
    });
    return output;
};
