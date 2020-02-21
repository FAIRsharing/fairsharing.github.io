import Client from "../components/GraphClient/GraphClient.js"
import recordsQuery from "../components/GraphClient/queries/getRecords.json"
import recordQuery from "../components/GraphClient/queries/getRecord.json"
import recordHistory from '../components/GraphClient/queries/getRecordHistory.json'
import filterMapping from "../components/Records/FiltersLabelMapping.js"


let client = new Client();

export default {
    namespaced: true,
    state: {
        records: [],
        facets: [],
        currentRecord: {},
        currentRecordHistory: {},
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
        setCurrentRecord(state, data){
            state.currentRecord = data;
        },
        setRecordHistory(state, data){
            state.currentRecordHistory = data;
        },
        resetCurrentRecordHistory(state){
            state.currentRecordHistory = {};
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
        async fetchRecord(state, id){
            this.commit("records/resetCurrentRecordHistory");
            recordQuery.queryParam = {
                id: id
            };
            let data = await client.executeQuery(recordQuery);
            this.commit('records/setCurrentRecord', data);
        },
        async fetchRecordHistory(state, id){
            recordHistory.queryParam = {id: id};
            let data = await client.executeQuery(recordHistory);
            this.commit('records/setRecordHistory', data["fairsharingRecord"]);
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
}

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