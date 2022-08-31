import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js";
import Vuetify from "vuetify"
import DataProcessAndCondition from "@/components/Records/Record/DataProcessesAndConditions/DataProcessAndCondition"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
    metadata: {
        associated_tools: [{}],
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
    userDefinedTags: [{label: 'a'}]
};

const $store = new Vuex.Store({
    modules: {
        record: Record
    }
});

describe("DataProcessAndCondition.vue", function () {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(DataProcessAndCondition, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be initiated", () => {
        expect(wrapper.name()).toMatch("DataProcessAndCondition");
    });

    it("can be check the reaction of page if appropriate data not provided", () => {
        let mockData;
        expect(wrapper.vm.generateProcessesData()).toStrictEqual({
            'data access': {
                data: [{name: 'name1', type: 'data access', url: 'www.somewhere.com', access_method: 'access method'}],
                icon: 'data_access'
            },
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
        expect(wrapper.vm.generateProcessesData()).toStrictEqual({})

        mockData = {
            fairsharingRecord: {
                metadata: {
                    data_processes_and_conditions: [
                        {name: 'name1', type: 'data access', url: 'www.somewhere.com', access_method: 'access method'},
                        {name: 'name2', type: 'data access', url: 'www.somewhere.com', access_method: 'access method'},
                        {name: 'name3', type: 'data curation', url: 'www.somewhere3.com', access_method: 'access method'}]
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
        expect(wrapper.vm.generateProcessesData()).toStrictEqual({
            "data access": {
                "data": [
                    {
                        "name": "name1",
                        "type": "data access",
                        "url": "www.somewhere.com",
                        "access_method": 'access method'
                    },
                    {
                        "name": "name2",
                        "type": "data access",
                        "url": "www.somewhere.com",
                        "access_method": 'access method'
                    }
                ],
                "icon": "data_access"
            },
            "data curation": {
                "data": [
                    {
                        "name": "name3",
                        "type": "data curation",
                        "url": "www.somewhere3.com",
                        "access_method": 'access method'
                    }
                ],
                "icon": "data_curation"
            }
        })

    });


});