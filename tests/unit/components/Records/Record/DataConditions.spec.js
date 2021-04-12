import {shallowMount, createLocalVue} from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import DataConditions from "@/components/Records/Record/DataConditions.vue"
import Vuetify from "vuetify"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
    licences: [{name: 'a licence', id: 1}],
    licenceLinks: [{id: 1, licence: {name: 'a licence', id: 1}, relation: 'undefined'}],
    metadata: {
        associated_tools: [{}],
        data_processes: [{name: 'name1', type: 'data access', url: 'www.somewhere.com'}]
    },
    taxonomies: [
        {label: "Turdus turdus"},
    ],
    subjects: [
        {label: "Javascript Fun"},
    ],
    domains: [
        {label: "Deneb"},
    ],
    userDefinedTags: [{label: 'a'}]
};
const $store = new Vuex.Store({
    modules: {
        record: Record
    }
});

describe("DataConditions.vue", function () {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(DataConditions, {
            localVue,
            vuetify,
            mocks: {$store},
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("DataConditions");
    });

    it("can be check the reaction of page if appropriate data not provided", () => {
        let mockData;
        expect(wrapper.vm.generateDataConditions()).toStrictEqual({
                'data access': {
                    data: [{name: 'name1', type: 'data access', url: 'www.somewhere.com'}],
                    icon: 'data_access'
                },
                licences: {data: [{name: 'a licence',id:1}], icon: 'licences'}
            })

        mockData = {
            fairsharingRecord: {
                licences: [],
                metadata: {},
                taxonomies: [
                    {label: "asasd turdus"},
                ],
                subjects: [
                    {label: "asdasd Fun"},
                ],
                domains: [
                    {label: "asasd"},
                ],
                userDefinedTags: [{label: 'b'}]
            }
        }
        $store.commit("record/setCurrentRecord", mockData)
        expect(wrapper.vm.generateDataConditions()).toStrictEqual({})

        mockData = {
            fairsharingRecord: {
                licences: [],
                metadata: {
                    data_processes: [
                        {name: 'name1', type: 'data access', url: 'www.somewhere.com'},
                        {name: 'name2', type: 'data access', url: 'www.somewhere.com'},
                        {name: 'name3', type: 'data curation', url: 'www.somewhere3.com'}]
                },
                taxonomies: [
                    {label: "asasd turdus"},
                ],
                subjects: [
                    {label: "asdasd Fun"},
                ],
                domains: [
                    {label: "asasd"},
                ],
                userDefinedTags: [{label: 'b'}]
            }
        }
        $store.commit("record/setCurrentRecord", mockData)
        expect(wrapper.vm.generateDataConditions()).toStrictEqual({
            "data access": {
                "data": [
                    {
                        "name": "name1",
                        "type": "data access",
                        "url": "www.somewhere.com"
                    },
                    {
                        "name": "name2",
                        "type": "data access",
                        "url": "www.somewhere.com"
                    }
                ],
                "icon": "data_access"
            },
            "data curation": {
                "data": [
                    {
                        "name": "name3",
                        "type": "data curation",
                        "url": "www.somewhere3.com"
                    }
                ],
                "icon": "data_curation"
            }
        })

    });

});
