import Client from "../components/GraphClient/GraphClient.js"
import recordsQuery from "../components/GraphClient/queries/getRecords.json"
import recordQuery from "../components/GraphClient/queries/getRecord.json"
import recordHistory from '../components/GraphClient/queries/getRecordHistory.json'

let client = new Client();

export default {
    namespaced: true,
    state: {
        records: [],
        facets: [],
        currentRecord: {},
        currentRecordHistory: {}
    },
    mutations: {
        setRecords(state, data){
            state.records = data['records'];
            state.facets = data["aggregations"];
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
        }
    },
    actions: {
        async fetchRecords(state, params){
            this.commit("records/resetRecords");
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
            this.commit('records/setRecordHistory', data);
        }
    },
    modules: {
    }
}
