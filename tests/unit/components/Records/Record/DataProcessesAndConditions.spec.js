import {createLocalVue,shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";

import DataProcessesAndConditions from "@/components/Records/Record/DataProcessesAndConditions.vue"
import Record from "@/store/recordData.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
    licences: [{name: 'a licence', id: 1}],
    licenceLinks: [{id: 1, licence: {name: 'a licence', id: 1}, relation: 'undefined'}],
    metadata: {
        associated_tools: [{}],
        certifications_and_community_badges: [{name: 'a community', url: 'www.somecommunity.com'}],
        data_processes_and_conditions: [{name: 'name1', type: 'data access', url: 'www.somewhere.com', access_method: 'access method'}]
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
    userDefinedTags: [{label: 'a'}],
    objectTypes: [{label: 'b'}]
};
const $store = new Vuex.Store({
    modules: {
        record: Record
    }
});

describe("DataProcessesAndConditions.vue", function () {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(DataProcessesAndConditions, {
            localVue,
            vuetify,
            mocks: {$store},
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("DataProcessesAndConditions");
    });

    it("can be check the reaction of page if appropriate data not provided", () => {
        let mockData;
        expect(wrapper.vm.generateDataConditions()).toStrictEqual({
            certifications_and_community_badges: {data:[{name: 'a community', url: 'www.somecommunity.com'}], icon: 'certificate'},
            licences: {data: [{name: 'a licence',id:1}], icon: 'licences'},
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
                userDefinedTags: [{label: 'b'}],
                objectTypes: [{label: 'b'}]
            }
        }
        $store.commit("record/setCurrentRecord", mockData)
        expect(wrapper.vm.generateDataConditions()).toStrictEqual({})

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
                userDefinedTags: [{label: 'b'}],
                objectTypes: [{label: 'c'}]
            }
        }
        $store.commit("record/setCurrentRecord", mockData)
        expect(wrapper.vm.generateDataConditions()).toStrictEqual({})

    });

});
