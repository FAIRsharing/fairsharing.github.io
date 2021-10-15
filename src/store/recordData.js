import Vue from "vue"
import { isEqual } from "lodash"
import Client from "../lib/GraphClient/GraphClient.js"
import RESTClient from "@/lib/Client/RESTClient.js"
import recordQuery from "../lib/GraphClient/queries/getRecord.json"
import recordHistory from '../lib/GraphClient/queries/getRecordHistory.json'
import recordOrganisationsQuery from "../lib/GraphClient/queries/getRecordOrganisations.json"
import recordDataAccessQuery from "../lib/GraphClient/queries/editor/getRecordDataAccess.json"
import recordRelationsQuery from "../lib/GraphClient/queries/editor/getRecordRelations.json"
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
            generalInformation: initEditorSections(false, ["generalInformation"]).generalInformation
        },
        editOrganisationLink: {
            showOverlay: false,
            data: {},
            id: null
        },
        newRecord: false,
        currentID: null
    },
    mutations: {
        setCurrentRecord(state, data){
            state.currentRecord = data;
            let tags = ['subjects', 'domains', 'taxonomies', 'userDefinedTags'];
            tags.forEach(tag => {
                if (state.currentRecord['fairsharingRecord'][tag].length && state.currentRecord['fairsharingRecord'][tag] ) {
                    state.currentRecord['fairsharingRecord'][tag].forEach(item => {
                        item.type = tag;
                    })
                }
            })
        },
        setRecordHistory(state, data){
            state.currentRecordHistory = data;
        },
        resetCurrentRecordHistory(state){
            state.currentRecordHistory = {};
        },
        setSections(state, data){
            state.currentID = data['fairsharingRecord'].id;
            let sectionsNames = [
                "generalInformation",
                "support",
                "dataAccess",
                "publications",
                "organisations",
                "additionalInformation",
                "relations"
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
        setAdditionalInformation(state, additionalInformation) {
            if (!additionalInformation.subfieldName){
                Vue.set(state.sections.additionalInformation.data,
                    additionalInformation.fieldName,
                    additionalInformation.fieldValue
                );
            }
            else {
                Vue.set(state.sections.additionalInformation.data[additionalInformation.fieldName],
                    additionalInformation.subfieldName,
                    additionalInformation.fieldValue
                );
            }
        },
        setAdditionalInformationSubField(state, additionalInformation) {
            if (additionalInformation.id !== null) {
                state.sections.additionalInformation.data[additionalInformation.fieldName][additionalInformation.id] =
                    additionalInformation.fieldValue;
            }
            else {
                if (!state.sections.additionalInformation.data[additionalInformation.fieldName]){
                    Vue.set(state.sections.additionalInformation.data, additionalInformation.fieldName,[]);
                }
                Vue.set(state.sections.additionalInformation.data[additionalInformation.fieldName],
                    state.sections.additionalInformation.data[additionalInformation.fieldName].length,
                    additionalInformation.fieldValue
                );
            }
        },
        removeAdditionalInformationSubField(state, additionalInformation){
            state.sections.additionalInformation.data[additionalInformation.fieldName].splice(additionalInformation.id, 1)
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
        updateAdditionalInformation(state, additionalInformation) {
            let record = {};
            Object.keys(additionalInformation.record).forEach(field => {
                record[field] = additionalInformation.record[field];
                state.sections.generalInformation.data.metadata[field] = JSON.parse(JSON.stringify(record[field]));
                state.sections.generalInformation.initialData.metadata[field] = JSON.parse(JSON.stringify(record[field]));
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
        setRelations(state, relations){
            state.sections.relations.data.recordAssociations = relations;
            state.sections.relations.initialData.recordAssociations = JSON.parse(JSON.stringify(relations));
            state.sections.relations.changes = 0;
            state.sections.relations.message = "Record successfully updated!";
            state.sections.relations.error = false;
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
            state.sections = null;
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
        async fetchRecord(state, options){
            state.commit("resetCurrentRecordHistory");
            recordQuery.queryParam = {
                id: options.id
            };
            if (options.token) {
                client.setHeader(options.token);
            }
            let data = await client.executeQuery(recordQuery);
            client.initalizeHeader()
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
        async fetchPreviewRecord(state, id){
            state.commit("resetCurrentRecordHistory");
            recordQuery.queryParam = {
                id: id
            };
            let data = await client.executeQuery(recordQuery);
            state.commit('setCurrentRecord', data);
        },
        async fetchRecordHistory(state, options){
            recordHistory.queryParam = {id: options.id};
            client.setHeader(options.token);
            let data = await client.executeQuery(recordHistory);
            state.commit('setRecordHistory', data["fairsharingRecord"]);
        },
        async updateGeneralInformation({ state, commit}, options) {
            commit("resetMessage", "generalInformation");
            let {
                type, countries, userDefinedTags, domains, subjects, taxonomies, status, curator_notes, isHidden,
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
            record.curator_notes = curator_notes;
            record.hidden = isHidden;
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
                    grant_id: (obj.grant) ? obj.grant.id : null,
                    is_lead: obj.isLead
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
            options.fields.forEach(field => {
                if (state.sections.additionalInformation.data[field]) {
                    Object.keys(state.sections.additionalInformation.data[field]).forEach(key => {
                        if (state.sections.additionalInformation.data[field][key] === "") {
                            delete state.sections.additionalInformation.data[field][key]
                        }
                    })
                    newRecord.metadata[field] = state.sections.additionalInformation.data[field]
                }
                else if (state.sections.additionalInformation.data[field] === null) {
                    // if its the case that there is a single string textInput only
                    state.sections.additionalInformation.data[field] = "";
                    newRecord.metadata[field] = state.sections.additionalInformation.data[field]
                }
            });
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
                commit('updateAdditionalInformation', {record: newRecord.metadata, fields: options.fields});
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
        async updateRelations({state, commit}, options){
            commit("resetMessage", "relations");
            let newAssociations = [],
                deleteAssociations = [],
                oldAssociations = [];
            state.sections.relations.data.recordAssociations.forEach(association => {
                if (association.new) {
                    const newAssociation = {
                        fairsharing_record_id: options.source,
                        linked_record_id: association.linkedRecord.id,
                        record_assoc_label_id: association.recordAssocLabel.id
                    };
                    newAssociations.push(newAssociation);
                }
                else {
                    oldAssociations.push(association.linkedRecord.id);
                }
            });
            state.sections.relations.initialData.recordAssociations.forEach(oldAssociation => {
                let id = oldAssociation.linkedRecord.id;
                if (id && !oldAssociations.includes(id)) {
                    deleteAssociations.push({
                        id: oldAssociation.id,
                        _destroy: 1
                    });
                }
            });
            let responses = await Promise.all([
                restClient.saveRelations({
                    token: options.token,
                    relations: newAssociations,
                    target: options.source
                }),
                restClient.deleteRelations({
                    token: options.token,
                    relations: deleteAssociations,
                    target: options.source
                })
            ]);
            let error = false;
            for (let response of responses) {
                if (response.error) {
                    commit("setSectionError", {
                        section: "relations",
                        value: response.error
                    });
                    error = true;
                }
            }
            if (!error){
                recordRelationsQuery.queryParam = {id: options.source};
                let relations = await client.executeQuery(recordRelationsQuery);
                commit('setRelations', relations['fairsharingRecord'].recordAssociations);
            }
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
        }
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
        getAllChanges: (state) => {
            let changes = 0;
            Object.keys(state.sections).forEach(section => {
                changes += state.sections[section].changes;
            });
            return changes;
        },
        getCreatingNewRecord: (state) => {
            return state.newRecord;
        },
        getRecordType: (state) => {
            return state.sections['generalInformation'].initialData.type
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
