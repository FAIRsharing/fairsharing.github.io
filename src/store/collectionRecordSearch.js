import Client from "@/lib/GraphClient/GraphClient.js"
import recordsQuery from "@/lib/GraphClient/queries/getRecords.json"
import {buildFacets} from "@/store/recordSearch";

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
        this.commit("collectionRecords/setLoadingStatus", true);
        this.commit("collectionRecords/resetRecords");
        this.commit("collectionRecords/resetPages");
        if (Object.keys(params).length > 0) {
            recordsQuery.queryParam = params;
        }
        const data = await client.executeQuery(recordsQuery);
        this.commit('collectionRecords/setRecords', data["searchFairsharingRecords"]);
        this.commit("collectionRecords/setLoadingStatus", false);
    },
    resetRecords() {
        this.commit("collectionRecords/resetRecords");
    },
};
export const getters = {
/*
    getFilter: (state) => (facetName) => {
        if (state.facets.length > 0) {
            let currentFacet = JSON.parse(JSON.stringify(state.facets.find(facet => facet.filterName === facetName)));
            currentFacet['values'] = currentFacet['buckets'];
            return currentFacet;
        }
        return [];
    },
*/
    getRecordsLength: (state) => {
        return state.records.length;
    }
};

/**
 * The records store handles the requests related to records (searchFairsharingRecords and fairsharingRecord).
 * @type {Object}
 */
let collectionRecordsStore = {
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
export default collectionRecordsStore;
