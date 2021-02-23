import { isEqual } from "lodash"
import Client from "../components/GraphClient/GraphClient.js"
import RESTClient from "@/components/Client/RESTClient.js"
import recordQuery from "../components/GraphClient/queries/getRecord.json"
import recordHistory from '../components/GraphClient/queries/getRecordHistory.json'
import recordOrganisationsQuery from "../components/GraphClient/queries/getRecordOrganisations.json"
import recordDataAccessQuery from "../components/GraphClient/queries/editor/getRecordDataAccess.json"
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
            publications: {},
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
                "dataAccess",
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
        setDataAccess(state, dataAccess){
            let record = {
                licences: dataAccess['licenceLinks'],
                support_links: dataAccess.metadata.support_links
            };
            state.sections.generalInformation.data.metadata.support_links = JSON.parse(JSON.stringify(record.support_links));
            state.sections.generalInformation.initialData.metadata.support_links = JSON.parse(JSON.stringify(record.support_links));
            record.support_links.forEach(supportLink => {
               if (supportLink.name) supportLink.url = {title: supportLink.name, url: supportLink.url}
            });
            state.sections.dataAccess.data = record;
            state.sections.dataAccess.initialData = JSON.parse(JSON.stringify(record));
            state.sections.dataAccess.changes = 0;
            state.sections.dataAccess.message = "Record successfully updated!";
        },
        setAdditionalInformation(state, additionalInformation) {
            let record = {
                access_points: additionalInformation['access_points'],
                associated_tools: additionalInformation['associated_tools']
            };
            // TODO: Separate setting necessary for each available field...
           Object.keys(record).forEach((type) => {
                state.sections.generalInformation.data.metadata[type] = JSON.parse(JSON.stringify(record[type]));
                state.sections.generalInformation.initialData.metadata[type] = JSON.parse(JSON.stringify(record[type]));
            });
            state.sections.additionalInformation.data = record;
            state.sections.additionalInformation.initialData = JSON.parse(JSON.stringify(record));
            state.sections.additionalInformation.changes = 0;
            state.sections.additionalInformation.message = "Record successfully updated!";
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
        },
        cleanRecordStore(state){
            state.sections = initEditorSections(false, [
                "generalInformation",
                "support",
                "dataAccess",
                "publications",
                "organisations",
                "additionalInformation"
            ]);
        }
    },
    actions: {
        async fetchRecord(state, id){
            state.commit("resetCurrentRecordHistory");
            recordQuery.queryParam = {
                id: id
            };
            let data = await client.executeQuery(recordQuery);
            if (!data["fairsharingRecord"]['metadata']['contacts']) {
                data["fairsharingRecord"]['metadata']['contacts'] = [];
            }
            // Citations should be created if empty.
            if (!data["fairsharingRecord"]['metadata']['citations']) {
                data["fairsharingRecord"]['metadata']['citations'] = [];
            }
            state.commit('setCurrentRecord', JSON.parse(JSON.stringify(data)));
            state.commit('setSections', JSON.parse(JSON.stringify(data)));
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
            newTags = await Promise.all(newTags.map(tag =>
                restClient.createNewUserDefinedTag(tag, options.token))
            );
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
        async updateAdditionalInformation({ state, commit}, options){
            commit("resetMessage", "additionalInformation");
            let newRecord = {
                metadata: state.sections.generalInformation.initialData.metadata,
            };
            // TODO: Add remaining fields here
            newRecord.metadata.access_points = state.sections.additionalInformation.data.access_points;
            newRecord.metadata.associated_tools = state.sections.additionalInformation.data.associated_tools;

            /// below = dodgy
            // define record
            let response = await restClient.updateRecord({
                record: newRecord,
                token: options.token,
                id: options.id
            });
            if (response.error) {
                commit("setSectionError", {
                    section: "additionalInformation",
                    value: response.error
                });
                return response.error;
            }
            else {
                commit("setMessage", {target: "additionalInformation", value: "Record successfully updated!"});
                commit('setAdditionalInformation', newRecord.metadata);
            }
        },
        async updateDataAccess({state, commit}, options){
            commit("resetMessage", "dataAccess");
            let newRecord = {
                metadata: state.sections.generalInformation.initialData.metadata,
            };
            newRecord.metadata.support_links = state.sections.dataAccess.data.support_links;
            newRecord.metadata.support_links.forEach(supportLink => {
                if (typeof supportLink.url !== 'string') {
                   supportLink.url = supportLink.url.url;
                }
            });

            let initialLicences = state.sections.dataAccess.initialData.licences,
                currentLicences = state.sections.dataAccess.data.licences,
                toDelete = [],
                toUpdate = [],
                toCreate = [];
            initialLicences.forEach(licence => {
                let found = currentLicences.filter(obj => obj.id === licence.id)[0];
                if (!found) toDelete.push(licence.id);
            });
            currentLicences.forEach(licence => {
                let found = initialLicences.filter(obj => obj.id === licence.id)[0],
                    newLicence = prepareLicence(licence);
                if (!found){
                    toCreate.push(newLicence);
                }
                else if (found && !isEqual(licence, found)) {
                    toUpdate.push(newLicence);
                }
            });
            let responses = await Promise.all([
                restClient.updateRecord({
                    record: newRecord,
                    token: options.token,
                    id: options.id
                }),
                ...toCreate.map(licence => restClient.createLicenceLink(licence, options.token)),
                ...toUpdate.map(licence => restClient.updateLicenceLink(licence, options.token)),
                ...toDelete.map(licence => restClient.deleteLicenceLink(licence, options.token))
            ]);
            responses.forEach((response) => {
                if (response.error) {
                    commit("setSectionError", {
                        section: "dataAccess",
                        value: response.error
                    });
                    return response.error;
                }
            });

            recordDataAccessQuery.queryParam = {id: state.currentRecord.fairsharingRecord.id};
            let dataAccess = await client.executeQuery(recordDataAccessQuery);
            commit('setDataAccess', dataAccess.fairsharingRecord);
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
            let tags = ['subjects','domains','taxonomies','userDefinedTags']
            if (tags.includes(fieldName)) {
                tags.forEach(tag => {
                    state.currentRecord['fairsharingRecord'][tag].forEach(item => {
                        item.type = tag;
                    })
                })
            }
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
        getAllChanges: (state) => {
            let changes = 0;
            Object.keys(state.sections).forEach(section => {
                changes += state.sections[section].changes;
            });
            return changes;
        },
        getCreatingNewRecord: (state) => {
            return state.newRecord;
        }
    }
};

function prepareLicence(rawLicence){
    let preparedLicence = { relation: rawLicence.relation };
    preparedLicence.fairsharing_record_id = (rawLicence.fairsharingRecord)
        ? rawLicence.fairsharingRecord.id
        : rawLicence.fairsharing_record_id;
    if (rawLicence.id) preparedLicence.id = rawLicence.id;

    if (rawLicence.licence.id){
        preparedLicence.licence_id = rawLicence.licence.id
    }
    else {
        preparedLicence.licence_attributes = rawLicence.licence;
    }
    return preparedLicence;
}

export default recordStore;
