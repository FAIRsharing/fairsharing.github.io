import { createLocalVue,shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";

import Collections from "@/components/Records/Record/Collections.vue"
import Record from "@/store/recordData.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const this_record =  {
    id: 999,
    name: "this record",
    abbreviation: "TR",
    registry: "Policy",
    type: "journal"
};
Record.state.currentRecord["fairsharingRecord"] = {
    name:"policy",
    registry: "Policy",
    recordAssociations: [
        {
            fairsharingRecord: this_record,
            linkedRecord: {
                id: 1,
                name: "a name",
                abbreviation: "an",
                registry: "Standard",
                type: "terminology_artifact"
            },
            recordAssocLabel: "recommends"
        },
        {
            fairsharingRecord: this_record,
            linkedRecord: {
                id: 2,
                name: "a name 2",
                abbreviation: "an2",
                registry: "Database",
                type: "knowledgebase"
            },
            recordAssocLabel: "recommends"
        },
        {
            fairsharingRecord: this_record,
            linkedRecord: {
                id: 3,
                name: "a name 3",
                abbreviation: "an3",
                registry: "Policy",
                type: "journal"
            },
            recordAssocLabel: "related_to"
        },
        {
            fairsharingRecord: this_record,
            linkedRecord: {
                id: 4,
                name: "a name 4",
                abbreviation: "an4",
                registry: "Policy",
                type: "journal"
            },
            recordAssocLabel: "extends"
        },
        {
            fairsharingRecord: this_record,
            linkedRecord: {
                id: 5,
                name: "a name 5",
                abbreviation: "an5",
                registry: "Policy",
                type: "journal"
            },
            recordAssocLabel: "deprecates"
        }
    ],
    reverseRecordAssociations: [
        {
            linkedRecord: this_record,
            fairsharingRecord: {
                id: 20,
                name: "d name",
                registry: "Collection",
                type: "collection"
            },
            recordAssocLabel: "collects"
        },
        {
            linkedRecord: this_record,
            fairsharingRecord: {
                id: 21,
                name: "e name",
                registry: "Policy",
                type: "journal"
            },
            recordAssocLabel: "recommends"
        }
    ],
    savedSearches:[
        {
            id: 203,
            name: "June17_4",
            comments: "",
            url: "http://www.test.com",
            fairsharingRecords: [
                {
                    name: "Test name",
                    id: 5239,
                    status: "ready",
                    registry: "Policy",
                    type: "journal"
                }
            ]
        }
    ]
};



const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("Collections.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Collections, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("Collections");
    });

    it("runs prepareAssociations correctly", () => {
        let result = wrapper.vm.prepareAssociations(
            Record.state.currentRecord["fairsharingRecord"].recordAssociations,
            Record.state.currentRecord["fairsharingRecord"].reverseRecordAssociations
        );
        expect(result[0]).toStrictEqual({"recordAssocLabel":["recommends"],"recordAssociationLabel":"recommends","id":1,"registry":"Standard","abbreviation":"an","type":"terminology_artifact","linkType":"linkedRecord","name":"a name","object":"policy","subject":"a name"});
        expect(result.length).toEqual(7);
    });



    it("search data is reactive when user changes text box value", () => {
        wrapper.vm.selectedValues = "a name 3"
        wrapper.vm.selectedValues = "not going to find me!"
        wrapper.vm.tabsData.tabs.in_collections.data = []
    });

    /*
     * Test to see if the current implementation complies with:
     * https://fairsharing.gitbook.io/fairsharing/associated-records/from-data-policy-records
     */
    it("shows the latest configuration correctly for policies", () => {
        wrapper.vm.prepareTabsData();
        expect(wrapper.vm.tabsData.tabs.in_collections.count).toEqual(1);
        expect(wrapper.vm.tabsData.tabs.related_policies.count).toEqual(4);
        expect(wrapper.vm.tabsData.tabs.in_policies).toBe(undefined);
        expect(wrapper.vm.tabsData.tabs.conforming_resources.count).toEqual(1);
        wrapper.vm.currentRecord.fairsharingRecord.registry = "Standard"
        wrapper.vm.prepareTabsData();
        expect(wrapper.vm.tabsData.tabs.in_collections.count).toEqual(1);
        expect(wrapper.vm.tabsData.tabs.in_policies.count).toEqual(1);
        expect(wrapper.vm.tabsData.tabs.related_policies.count).toBe(0); // still hanging around from last run
    });

    // This deletion has been saved for last so the previous test functions when all are run.
    it("can check if there are no record recordAssociations or reverseRecordAssociations", () => {
        delete Record.state.currentRecord.fairsharingRecord.recordAssociations;
        delete Record.state.currentRecord.fairsharingRecord.reverseRecordAssociations;
        expect(wrapper.vm.prepareTabsData()).toBe(false)
    });


});
