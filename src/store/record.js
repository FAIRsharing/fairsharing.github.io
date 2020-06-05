import Client from "../components/GraphClient/GraphClient.js"
import RESTClient from "@/components/Client/RESTClient.js"
import recordQuery from "../components/GraphClient/queries/getRecord.json"
import recordHistory from '../components/GraphClient/queries/getRecordHistory.json'

let client = new Client();
let restClient = new RESTClient();

/**
 * The record store handles the requests related to record (fairsharingRecord).
 * @type {Object}
 */
let recordStore = {
    namespaced: true,
    state: {
        currentRecord: {},
        currentRecordHistory: {},
        metaTemplate: {},
        recordUpdate: {
            error: false,
            message: null,
            id: null
        },
        keywordsTemplate: {}
    },
    mutations: {
        setCurrentRecord(state, data){
            state.currentRecord = data;
            state.metaTemplate = {
                type: data["fairsharingRecord"].type,
                status: data["fairsharingRecord"].status,
                countries: data["fairsharingRecord"].countries,
                metadata: {
                    name: data["fairsharingRecord"].metadata.name,
                    abbreviation: data["fairsharingRecord"].metadata.abbreviation,
                    year_creation: data["fairsharingRecord"].metadata.year_creation,
                    homepage: data["fairsharingRecord"].metadata.homepage,
                    description: data["fairsharingRecord"].metadata.description
                }
            };
            state.recordUpdate = {
                error: false,
                message: null,
                id: null
            }
        },
        setRecordHistory(state, data){
            state.currentRecordHistory = data;
        },
        resetCurrentRecordHistory(state){
            state.currentRecordHistory = {};
        },
        setNewRecord(state, id){
            state.recordUpdate = {
                error: false,
                message: "success",
                id: id
            }
        },
        setError(state, error){
            state.recordUpdate = {
                error: true,
                message: error,
                id: null
            }
        }
    },
    actions: {
        async fetchRecord(state, id){
            state.commit("resetCurrentRecordHistory");
            recordQuery.queryParam = {
                id: id
            };
            let data = await client.executeQuery(recordQuery);
            state.commit('setCurrentRecord', data);
        },
        async fetchRecordHistory(state, id){
            recordHistory.queryParam = {id: id};
            let data = await client.executeQuery(recordHistory);
            state.commit('setRecordHistory', data["fairsharingRecord"]);
        },
        async updateRecord(state, newRecord){
            let response = await restClient.updateRecord(newRecord);
            if (response.error){
                state.commit("setError", response.error.response.statusText)
            }
            else {
                state.commit("setNewRecord", response)
            }
        },
    },
    modules: {
    },
    getters: {
        getField: (state) => (fieldName) => {
            if (state.currentRecord['fairsharingRecord']) return state.currentRecord['fairsharingRecord'][fieldName]
        }
    }
};


export default recordStore;

