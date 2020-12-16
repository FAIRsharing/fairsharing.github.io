import Client from "../components/GraphClient/GraphClient.js"
import RESTClient from "@/components/Client/RESTClient.js"
import recordQuery from "../components/GraphClient/queries/getRecord.json"
import recordHistory from '../components/GraphClient/queries/getRecordHistory.json'
import { initEditorSections } from "./utils.js"

let client = new Client();
let restClient = new RESTClient();

/**
 * The record store handles the requests related to record (fairsharingRecord).
 * @type {Object}
 */
let recordStore = {
    namespaced: true,
    state: {
        currentRecord: {
            fairsharingRecord: {
                metadata: {
                    citations: []
                }
            }
        },
        currentRecordHistory: {},
        recordUpdate: {
            error: false,
            message: null,
            id: null
        },
        sections: {}
    },
    mutations: {
        setCurrentRecord(state, data){
            state.currentRecord = data;
            if (!data["fairsharingRecord"]['metadata']['contacts']) state.currentRecord["fairsharingRecord"]['metadata']['contacts'] = [];
            if (!data["fairsharingRecord"]['metadata']['citations']) state.currentRecord["fairsharingRecord"]['metadata']['citations'] = [];
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
        },
        setSections(state, data){
            let sectionsNames = [
                "generalInformation",
                "support",
                "licences",
                "publications",
                "organisations"
            ];
            state.sections = initEditorSections(data['fairsharingRecord'], sectionsNames);
        },
        setGeneralInformation(state, data){
            state.sections.generalInformation = initEditorSections(
                data['fairsharingRecord'],
                ["generalInformation"]
            ).generalInformation;
            state.sections.generalInformation.message = "Record successfully updated!";
        },
        resetMessage(state, sectionName){
            state.sections[sectionName].message = null;
            state.sections[sectionName].message = false;
        },
        setSectionError(state, error){
            state.sections[error.section].message = error.value;
            state.sections[error.section].error = true;
        },
        setChanges(state, diff){
            state.sections[diff.section].changes = diff.value;
        },
        setContacts(state, contacts){
            state.sections.generalInformation.data.metadata.contacts = contacts;
        },
        setTags(state, field){
            state.sections.generalInformation.data[field.target] = field.value;
        },
        resetRegistry(state){
            state.sections.generalInformation.data.type = "";
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
            state.commit('setSections', data);
        },
        async fetchRecordHistory(state, id){
            recordHistory.queryParam = {id: id};
            let data = await client.executeQuery(recordHistory);
            state.commit('setRecordHistory', data["fairsharingRecord"]);
        },
        async updateRecord(state, newRecord){
            let response = await restClient.updateRecord(newRecord);
            if (response.error){
                state.commit("setError", response.error.response)
            }
            else {
                state.commit("setNewRecord", response)
            }
        },
        async updateGeneralInformation({ state, commit }, options) {
            commit("resetMessage", "generalInformation");
            let {
                type, countries, userDefinedTags, domains, subjects, taxonomies,
                ...record
            } = JSON.parse(JSON.stringify(state.sections.generalInformation.data)),
                newTags = [],
                oldTags = [],
                tags = [];
            userDefinedTags.forEach(tag => {
                if (Object.keys(tag).indexOf("id") === -1){
                    newTags.push(tag.label)
                }
                else {
                    oldTags.push(tag.id)
                }
            });
            newTags = await Promise.all(newTags.map(tag => restClient.createNewUserDefinedTag(tag, options.token)));
            newTags.forEach((tag) => {
              if (!tag.error) {
                  tags.push(tag.id);
              }
              else {
                  commit("setSectionError", {
                      section: "generalInformation",
                      value: tag.error
                  });
                  return tag.error;
              }
            });
            record.country_ids  = countries.map(obj => obj.id);
            if (type.id) record.record_type_id = type.id;
            record.metadata.deprecation_reason = record.deprecation_reason;
            record.domain_ids = domains.map(obj => obj.id);
            record.subject_ids = subjects.map(obj => obj.id);
            record.taxonomy_ids = taxonomies.map(obj => obj.id);
            record.user_defined_tag_ids = tags.concat(oldTags.filter(function (el) {return el != null;}));
            let response = await restClient.updateRecord({
                  record: record,
                  token: options.token,
                  id: options.id
            });
            if (response.error){
                commit("setSectionError", {
                    section: "generalInformation",
                    value: response.error
                });
                return response.error;
            }
            else {
                  let newRecord = JSON.parse(JSON.stringify(state.sections.generalInformation.data));
                  let userDefinedTags = [];
                  newRecord.userDefinedTags.forEach(obj => {
                      if (Object.keys(obj).indexOf("id") === -1) {
                          obj.id = newTags.filter(tag => {tag.label = obj.label})[0];
                          userDefinedTags.push(obj);
                      }
                      else userDefinedTags.push(obj);
                  });
                  newRecord.userDefinedTags = userDefinedTags;
                  commit('setGeneralInformation', {fairsharingRecord: newRecord});
              }
        }
    },
    modules: {},
    getters: {
        getField: (state) => (fieldName) => {
            return state.currentRecord['fairsharingRecord'][fieldName];
        },
        citations: (state) => {
            let citations = [];
            state.currentRecord['fairsharingRecord'].metadata.citations.forEach(function (citation) {
                citations.push(citation['publication_id']);
            });
            return citations;
        },
        getSection: (state) => (sectionName) => {
            return state.sections[sectionName];
        },
        getChanges: (state) => {
            let changes = {};
            Object.keys(state.sections).forEach(section => {
                changes[section] = state.sections[section].changes
            });
            return changes;
        }
    }
};

export default recordStore;
