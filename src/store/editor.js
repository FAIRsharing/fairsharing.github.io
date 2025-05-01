import descriptionData from "@/data/fieldsDescription.json"
import recordTooltipData from "@/data/recordTooltips.json"
import status from "@/data/status.json"
import supportLinksTypes from "@/data/SupportLinksTypes.json"
import RESTClient from "@/lib/Client/RESTClient.js"
import GraphClient from "@/lib/GraphClient/GraphClient.js"
import getRecordsQuery from "@/lib/GraphClient/queries/editor/getRecordsSummary.json"
import tagsQuery from "@/lib/GraphClient/queries/geTags.json"
import countriesQuery from "@/lib/GraphClient/queries/getCountries.json"
import getDuplicates from "@/lib/GraphClient/queries/getDuplicates.json"
import getLicencesQuery from "@/lib/GraphClient/queries/getLicences.json"
import getPublicationsQuery from "@/lib/GraphClient/queries/getPublications.json"
import typesQuery from "@/lib/GraphClient/queries/getRecordsTypes.json"
import getGrantsQuery from "@/lib/GraphClient/queries/Organisations/getGrants.json"
import getOrganisationsQuery from "@/lib/GraphClient/queries/Organisations/getOrganisations.json"
import getOrganisationsTypesQuery from "@/lib/GraphClient/queries/Organisations/getOrganisationTypes.json"
const graphClient = new GraphClient();
const restClient = new RESTClient();

const recordTypes = [
    'standard',
    'database',
    'policy',
    'collection',
    'fairassist',
    "journal_publisher",
    "repository",
    "knowledgebase",
    "model_and_format",
    "terminology_artefact",
    "reporting_guideline",
    "identifier_schema",
    "journal",
    "collection",
    "metric",
    "knowledgebase_and_repository",
    "project",
    "funder",
    "institution",
    "society",
    "benchmark",
    "principle"
];

let editorStore = {
    namespaced: true,
    state: {
        countries: null,
        recordTypes: null,
        status: status.status,
        tooltips: descriptionData.descriptions,
        recordTooltips: recordTooltipData.descriptions,
        tags: [],
        years(){
            let years = [];
            let d = new Date();
            let thisYear = d.getFullYear();
            [...Array(100).keys()].forEach(function(year){
                years.push(thisYear - year);
            });
            return years;
        },
        colors: {
            domain: "domain_color",
            taxonomy: "taxonomic_color",
            subject: "subject_color",
            user_defined_tag: "tags_color"
        },
        allTags: false,
        organisations: null,
        organisationsTypes: null,
        organisationsRelations: [
            "maintains",
            "funds",
            "collaborates_on",
            "associated_with",
            "undefined"
        ],
        grants: null,
        availablePublications: [],
        supportLinksTypes: supportLinksTypes,
        availableLicences: [],
        licenceRelations: [
            "undefined",
            "applies_to_content",
            "least_permissive"
        ],
        accessPointTypes: ["REST", "SOAP", "SPARQL", "Other"],
        availableRecords: [],
        possibleDuplicates: [],
        relationsTypes: [],
        allowedFields: {}
    },
    mutations: {
        setCountries(state, countries){
            state.countries = countries;
        },
        setRecordTypes(state, recordTypes){
            state.recordTypes = recordTypes;
        },
        setTags(state, tags){
            state.tags = tags.data;
            if (tags.firstTime){
                state.allTags = tags.data;
            }
        },
        setOrganisations(state, organisations){
            state.organisations = organisations;
        },
        setOrganisationsTypes(state, organisationsTypes){
            state.organisationsTypes = organisationsTypes;
        },
        setGrants(state, grants){
            state.grants = grants;
        },
        setAvailablePublications(state, publications){
            state.availablePublications = publications;
        },
        setAvailableLicences(state, licences){
            state.availableLicences = licences;
        },
        cleanEditorStore(state) {
            state.countries = null;
            state.recordTypes = null;
            state.allTags = [];
            state.tags = [];
            state.organisations = null;
            state.organisationsTypes = null;
            state.grants = null;
            state.availablePublications = [];
            state.possibleDuplicates = [];
        },
        setAvailableRecords(state, records){
            state.availableRecords = records;
        },
        setAvailableRelationsTypes(state, types){
            state.relationsTypes = types;
        },
        setAllowedFields(state, fields){
            state.allowedFields = fields;
        },
        setPossibleDuplicates(state, records) {
            state.possibleDuplicates = records;
        },
        clearPossibleDuplicates(state) {
            state.possibleDuplicates = [];
        }
    },
    actions: {
        async getCountries(state){
            let countries = await graphClient.executeQuery(countriesQuery);
            state.commit("setCountries", countries['searchCountries'])
        },
        async getRecordTypes(state, fairassistOnly=false){
            let recordTypes = [];
            let data = await graphClient.executeQuery(typesQuery);
            const size = data['fairsharingRegistries'].records.length;
            let currentItem = 0;
            data['fairsharingRegistries'].records.forEach(function(type){
              if (fairassistOnly){
                if (type.name.toLowerCase() !== 'fairassist') return;
              }
              currentItem += 1;
              recordTypes.push({
                  header: type.name
              });
              type.recordTypes.forEach(function(subType){
                  recordTypes.push({
                      name: subType.name,
                      group: type.name,
                      id: subType.id,
                      description: subType.description
                  })
              });
              if (currentItem < size) recordTypes.push({ divider: true });
            });
            state.commit("setRecordTypes", recordTypes);
        },
        async getTags(state, queryString){
            let tagQueryCopy = JSON.parse(JSON.stringify(tagsQuery));
            if (queryString) tagQueryCopy.queryParam = {q: queryString};
            let data = await graphClient.executeQuery(tagQueryCopy);
            let first = (!state.state.allTags);
            state.commit("setTags", {data: data['searchTags'], firstTime: first});
        },
        async getOrganisations(state){
            let organisations = await graphClient.executeQuery(getOrganisationsQuery);
            state.commit("setOrganisations", organisations['searchOrganisations'])
        },
        async getOrganisationsTypes(state){
            let organisationsTypes = await graphClient.executeQuery(getOrganisationsTypesQuery);
            state.commit("setOrganisationsTypes", organisationsTypes['searchOrganisationTypes'])
        },
        async getGrants(state){
            let grants = await graphClient.executeQuery(getGrantsQuery);
            state.commit("setGrants", grants['searchGrants'])
        },
        async getAvailablePublications({commit}, publications){
            let pubs = [],
                position = 0;
            let response = await graphClient.executeQuery(getPublicationsQuery);
            response.searchPublications.forEach((pub) => {
                pub.isCitation = false;
                publications.forEach((publication) => {
                    if (pub.id === publication.id){
                        publication.tablePosition = position;
                        pub.tablePosition = position;
                    }
                });
                pubs.push(pub);
                position += 1;
            });
            commit("setAvailablePublications", pubs);
        },
        async getLicences({commit}) {
            let licences = await graphClient.executeQuery(getLicencesQuery);
            commit('setAvailableLicences', licences['searchLicences'])
        },
        async getAvailableRecords({commit}, options){
            getRecordsQuery.queryParam = {perPage: 100};
            if (options.q) getRecordsQuery.queryParam.q = options.q;
            getRecordsQuery.queryParam.fairsharingRegistry = options.fairsharingRegistry;
            getRecordsQuery.queryParam.recordType = options.recordType;
            getRecordsQuery.queryParam.searchAnd = false;
            getRecordsQuery.queryParam.excludeId = options.excludeId;
            let data = await graphClient.executeQuery(getRecordsQuery);
            commit("setAvailableRecords", data.searchFairsharingRecords.records);
        },
        async getPossibleDuplicates({commit}, options) {
            getDuplicates.queryParam = {fields: options.fields}
            let data = await graphClient.executeQuery(getDuplicates);
            commit("setPossibleDuplicates", data.duplicateCheck);
        },
        async getAvailableRelationsTypes({commit}){
            let types = await restClient.getRelationsTypes();
            let allowed = {};
            for (let typeObject of types) {
                let relationName = typeObject.name,
                    id = typeObject.id;
                /* istanbul ignore else */
                if (typeObject['allowed_associations'].length > 0) {
                    typeObject['allowed_associations'].forEach(allowed_association => {
                        let relationParent = allowed_association.from;
                        let relationChild = allowed_association.to;
                        /* istanbul ignore if */ if (!Object.keys(allowed).includes(relationParent)) {
                            allowed[relationParent] = [];
                        }
                        allowed[relationParent].push({
                            relation: relationName,
                            target: relationChild,
                            id: id,
                            relationId: typeObject.id
                        });
                    })
                }
                else {
                    recordTypes.forEach(relationParent => {
                        if (!Object.keys(allowed).includes(relationParent)) {
                            allowed[relationParent] = [];
                        }
                        recordTypes.forEach(relationChild => {
                           allowed[relationParent].push({
                               relation: relationName,
                               target: relationChild,
                               id: id,
                               relationId: typeObject.id
                           });
                        });
                    });
                }
            }
            commit("setAvailableRelationsTypes", allowed);
        },
        async getAllowedFields({commit}, options){
            let response = await restClient.extraMetadataFields(
                options.type,
                options.token
            );
            commit('setAllowedFields', response);
        }
    },
    modules: {},
    getters: {
        getPartialTags: (state) => (sections) => {
            let tags = [];
            for (let tag of state.tags){
                if (sections.indexOf(tag.model)> -1){
                    tags.push(tag);
                }
            }
            return tags;
        },
        allowedRelations: (state) => (options) => {
            let output = [];
            let seen = [];
            [options.sourceType, options.sourceRegistry].forEach(type => {
                // This undefined check prevents allowed relations from being pushed to the array twice,
                // as we're checking for both registry and record type here.
                /* istanbul ignore else */
                if (state.relationsTypes[type] !== undefined) {
                    state.relationsTypes[type].forEach(relation => {
                        // Somehow, duplicate relations were being pushed into this array.
                        // I've created a text label as the ID of a relation may be duplicated, i.e.
                        // db->related_to->std would be the same ID as db->related_to->db.
                        let label = relation.relation + '.' + relation.target;
                        if (!seen.includes(label)) {
                            // This appears to be called when loading the page, to determine which currently-linked
                            // records to show.
                            if (options.target === null) {
                                output.push(relation);
                                seen.push(label);
                            }
                            // Whereas this is what determines what available links can be shown when adding a new one.
                            else {
                                if (options.target.registry === relation.target ||
                                    options.target.type === relation.target) {
                                    output.push(relation);
                                    seen.push(label);
                                }
                            }
                        }
                    });
                }
            })
            return output;
        },
        allowedTargets: (state) => (source) => {
            let output = [];
            state.relationsTypes[source.toLowerCase()].forEach(relation => {
                /* istanbul ignore else */
                if (recordTypes.includes(relation.target)) output.push(relation.target);
            });
            return [...new Set(output)];
        }
    }
};

export default editorStore;
