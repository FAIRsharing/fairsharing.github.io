import Client from "../components/GraphClient/GraphClient.js"
import recordsQuery from "../components/GraphClient/queries/getRecords.json"
import filterMapping from "../components/Records/FiltersLabelMapping.js"

let client = new Client();

/**
 * The records store handles the requests related to records (searchFairsharingRecords and fairsharingRecord).
 * @type {Object}
 */
let recordsStore = {
    namespaced: true,
    state: {
        records: [],
        facets: [],
        totalPages: null,
        hits: null,
    },
    mutations: {
        setRecords(state, data){
            state.records = data['records'];
            state.facets = buildFacets(data["aggregations"]);
            state.totalPages = data["totalPages"];
            state.hits = data["totalCount"];
        },
        resetRecords(state){
            recordsQuery.queryParam = null;
            state.records = [];
        },
        resetFacets(state){
            state.facets = [];
        },
        resetHits(state){
            state.hits = null;
        }
    },
    actions: {
        async fetchRecords(state, params){
            this.commit("records/resetRecords");
            this.commit("records/resetHits");
            if (Object.keys(params).length > 0){
                recordsQuery.queryParam = params;
            }
            const data = await client.executeQuery(recordsQuery);
            this.commit('records/setRecords', data["searchFairsharingRecords"]);
        },
        resetFacets(){
            this.commit("records/resetFacets")
        },
        resetRecords(){
            this.commit("records/resetRecords");
        }
    },
    modules: {
    },
    getters: {
        getFacet: (state) => (size, facetName) => {
            let currentFacet = JSON.parse(JSON.stringify(state.facets.find(facet => facet.filterName === facetName)));
            currentFacet['values'] = currentFacet['buckets'].sort().slice(0, size);
            return currentFacet;
        }
    }
};


export default recordsStore;

/**
 * Given an object containing the raw facets coming from the client and a mapping object , build the ready to use facets
 * for usage by the Vue components.
 * @param {Object} rawFacets - the aggregation object coming from the API response as data['aggregations']
 * @returns {Array} output - the array of ready to use facets containing a name, a label and values
 */
const buildFacets = function(rawFacets){
    let output = [];
    const mapper = filterMapping["autocomplete"];

    Object.keys(rawFacets).forEach(function(facetName){
        if (Object.prototype.hasOwnProperty.call(mapper, facetName)){
            let localFacet = mapper[facetName];
            rawFacets[facetName]["buckets"].forEach(function(bucket){
                if (Object.prototype.hasOwnProperty.call(bucket, "key_as_string")){
                    bucket["key"] = bucket["key_as_string"];
                }
            });
            localFacet['buckets'] = rawFacets[facetName]['buckets'];
            output.push(localFacet);
        }
    });
    return output;
};
