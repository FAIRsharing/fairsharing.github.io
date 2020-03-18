import Client from "../components/GraphClient/GraphClient.js"
import recordQuery from "../components/GraphClient/queries/getRecord.json"
import recordHistory from '../components/GraphClient/queries/getRecordHistory.json'

let client = new Client();

/**
 * The record store handles the requests related to record (fairsharingRecord).
 * @type {Object}
 */
let recordStore = {
    namespaced: true,
    state: {
        currentRecord: {},
        currentRecordHistory: {},
    },
    mutations: {
        setCurrentRecord(state, data){
            state.currentRecord = data;
        },
        setRecordHistory(state, data){
            state.currentRecordHistory = data;
        },
        resetCurrentRecordHistory(state){
            state.currentRecordHistory = {};
        },
    },
    actions: {
        async fetchRecord(state, id){
            this.commit("record/resetCurrentRecordHistory");
            recordQuery.queryParam = {
                id: id
            };
            let data = await client.executeQuery(recordQuery);
            this.commit('record/setCurrentRecord', data);
        },
        async fetchRecordHistory(state, id){
            recordHistory.queryParam = {id: id};
            let data = await client.executeQuery(recordHistory);
            this.commit('record/setRecordHistory', data["fairsharingRecord"]);
        }
    },
    modules: {
    }
};


export default recordStore;

