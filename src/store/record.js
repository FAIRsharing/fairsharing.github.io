import Client from "../components/GraphClient/GraphClient.js"
import RESTClient from "@/components/Client/RESTClient.js"
import recordQuery from "../components/GraphClient/queries/getRecord.json"
import recordHistory from '../components/GraphClient/queries/getRecordHistory.json'
import recordOrganisationsQuery from "../components/GraphClient/queries/getRecordOrganisations.json"
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
        sections: {
            generalInformation: initEditorSections(false, ["generalInformation"]).generalInformation,
            organisations: {},
            additionalInformation: {},
            publications: initEditorSections(false, ["publications"]).publications,
        },
        editOrganisationLink: {
            showOverlay: false,
            data: {},
            id: null
        },
        newRecord: false
    },
    mutations: {
        setCurrentRecord(state, data){
            state.currentRecord = data;
            if (!data["fairsharingRecord"]['metadata']['contacts']) state.currentRecord["fairsharingRecord"]['metadata']['contacts'] = [];
            // Citations should be created if empty.
            if (!data["fairsharingRecord"]['metadata']['citations']) {
                state.currentRecord["fairsharingRecord"]['metadata']['citations'] = [];
            }
        },
        setRecordHistory(state, data){
            state.currentRecordHistory = data;
        },
        resetCurrentRecordHistory(state){
            state.currentRecordHistory = {};
        },
        setSections(state, data){
            let sectionsNames = [
                "generalInformation",
                "support",
                "licences",
                "publications",
                "organisations",
                "additionalInformation"
            ];
            state.sections = initEditorSections(data['fairsharingRecord'], sectionsNames);
        },
        setGeneralInformation(state, data){
            state.sections.generalInformation = initEditorSections(
                data['fairsharingRecord'],
                ["generalInformation"]
            ).generalInformation;
            if(data['fairsharingRecord']) state.sections.generalInformation.message = "Record successfully updated!";
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
        },
        setPublications(state, publications) {
            state.sections.publications.data = publications;
        },
        updateOrganisationsLinks(state, links){
            state.sections.organisations.data = links;
            state.sections.organisations.initialData = JSON.parse(JSON.stringify(links));
            state.sections.organisations.changes = 0;
            state.sections.organisations.message = "Record successfully updated!";
        },
        setEditOrganisationLink(state, newLink){
            state.editOrganisationLink = newLink;
        },
        setEditOrganisationLinkOrganisation(state, organisation){
            state.editOrganisationLink.data.organisation = organisation;
        },
        setEditOrganisationLinkGrant(state, grant) {
            state.editOrganisationLink.data.grant = grant;
        },
        setCreatingNewRecord(state){
            state.newRecord = true;
        },
        setEditingRecord(state){
            state.newRecord = false;
        },
        setMessage(state, message){
            state.sections[message.target].message = message.value;
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
            state.commit('setSections', data);
        },
        async fetchRecordHistory(state, id){
            recordHistory.queryParam = {id: id};
            let data = await client.executeQuery(recordHistory);
            state.commit('setRecordHistory', data["fairsharingRecord"]);
        },
        async updateGeneralInformation({ state, commit}, options) {
            commit("resetMessage", "generalInformation");
            let {
                type, countries, userDefinedTags, domains, subjects, taxonomies, status,
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
            record.metadata.status = status;
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
        },
        async updatePublications({ state, commit }, options) {
            commit("resetMessage", "publications");
            let publications = JSON.parse(JSON.stringify(state.sections.publications.data));
            let record_data = {
                publication_ids: [],
                citation_ids: []
            };
            publications.forEach(function (publication) {
                record_data.publication_ids.push(publication.id);
                if (publication.isCitation) {
                    record_data.citation_ids.push(publication.id);
                }
                delete publication.isCitation;
            });
            const record = {
                record: record_data,
                token: options.token,
                id: options.id
            };
            let response = await restClient.updateRecord(record);
            if (response.error) {
                commit("setSectionError", {
                    section: "publications",
                    value: response.error
                });
                return response.error;
            }
            else {
                commit("setMessage", {target: "publications", value: "Record successfully updated!"});
            }
        },
        async updateOrganisations({state, commit}, userToken){
            commit("resetMessage", "organisations");
            let deleteItems = [],
                updateItems = [],
                createItems = [];
            state.sections.organisations.initialData.forEach((obj) => {
                let found = state.sections.organisations.data.filter(org => org.id === obj.id)[0];
                if (!found) { deleteItems.push(obj); }
            });
            state.sections.organisations.data.forEach(function(obj) {
                let query = {
                    fairsharing_record_id: state.currentRecord['fairsharingRecord'].id,
                    organisation_id: obj.organisation.id,
                    relation: obj.relation,
                    grant_id: (obj.grant) ? obj.grant.id : null
                };
                if (Object.prototype.hasOwnProperty.call(obj, 'id')) updateItems.push({query: query, id: obj.id});
                else createItems.push(query);
            });
            let queries = await Promise.all([
                ...deleteItems.map(organisation => restClient.deleteOrganisationLink(organisation.id, userToken)),
                ...createItems.map(organisation => restClient.createOrganisationLink(organisation, userToken)),
                ...updateItems.map(organisation => restClient.updateOrganisationLink(organisation.query, organisation.id, userToken))
            ]);
            queries.forEach((org) => {
                if (org.error) {
                    commit("setSectionError", {
                        section: "organisations",
                        value: org.error
                    });
                }
            });
            recordOrganisationsQuery.queryParam = {id: state.currentRecord.fairsharingRecord.id};
            let organisations = await client.executeQuery(recordOrganisationsQuery);
            commit('updateOrganisationsLinks', organisations.fairsharingRecord.organisationLinks);
        },
        resetRecord(state){
            state.commit('setGeneralInformation', {fairsharingRecord: false});
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
    },
    getters: {
        getField: (state) => (fieldName) => {
            return state.currentRecord['fairsharingRecord'][fieldName];
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
        },
        getCreatingNewRecord: (state) => {
            return state.newRecord;
        }
    }
};

export default recordStore;
