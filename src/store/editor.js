import GraphClient from "@/components/GraphClient/GraphClient.js"
import countriesQuery from "@/components/GraphClient/queries/getCountries.json"
import typesQuery from "@/components/GraphClient/queries/getRecordsTypes.json"
import tagsQuery from "@/components/GraphClient/queries/geTags.json"
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
            domain: "blue",
            taxonomy: "green",
            subject: "orange",
            user_defined_tag: "grey"
        },
        allTags: false
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
        }
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
