import GraphClient from "@/components/GraphClient/GraphClient.js"
import countriesQuery from "@/components/GraphClient/queries/getCountries.json"
import typesQuery from "@/components/GraphClient/queries/getRecordsTypes.json"
import tagsQuery from "@/components/GraphClient/queries/geTags.json"
import getOrganisationsQuery from "@/components/GraphClient/queries/Organisations/getOrganisations.json"
import getOrganisationsTypesQuery from "@/components/GraphClient/queries/Organisations/getOrganisationTypes.json"
import getGrantsQuery from "@/components/GraphClient/queries/Organisations/getGrants.json"
import descriptionData from "@/data/fieldsDescription.json"
import registryIcons from "@/data/recordsRegistries.json"
import status from "@/data/status.json"
const graphClient = new GraphClient();

let editorStore = {
    namespaced: true,
    state: {
        countries: null,
        recordTypes: null,
        status: status.status,
        tooltips: descriptionData.descriptions,
        tags: [],
        icons(){
            let icons  = {};
            Object.keys(registryIcons).forEach(fieldName => {
                icons[fieldName] = registryIcons[fieldName].icon
            });
            return icons;
        },
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
            "undefined"
        ],
        grants: null,
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
    },
    actions: {
        async getCountries(state){
            let countries = await graphClient.executeQuery(countriesQuery);
            state.commit("setCountries", countries['searchCountries'])
        },
        async getRecordTypes(state){
            let recordTypes = [];
            let data = await graphClient.executeQuery(typesQuery);
            const size = data['fairsharingRegistries'].records.length;
            let currentItem = 0;
            data['fairsharingRegistries'].records.forEach(function(type){
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
        }
    }
};

export default editorStore;
