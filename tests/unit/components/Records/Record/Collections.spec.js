import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import Collections from "@/components/Records/Record/Collections.vue"
import Vuetify from "vuetify"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
    name:"standard",
    recordAssociations: [
        {
            linkedRecord: {
                id: 1,
                name: "a name",
                registry: "Standard",
                type: "terminology_artifact"
            },
            recordAssocLabel: "collects"
        },
        {
            linkedRecord: {
                id: 3,
                name: "a name 3",
                registry: "Database",
                type: "journal"
            },
            recordAssocLabel: "collects"
        }
    ],
    reverseRecordAssociations: [
        {
            linkedRecord: {
                id: 2,
                name: "b name",
                registry: "Database",
                type: "repository"
            },
            recordAssocLabel: "recommends"
        }
    ],
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
        expect(wrapper.name()).toMatch("Collections");
    });

    it("search data is reactive when user changes text box value", () => {
        wrapper.vm.selectedValues = "a name 3"
        wrapper.vm.selectedValues = "not going to find me!"
        wrapper.vm.tabsData.tabs.collected_by.data = []
    });

    it("can check if there are no record recordAssociations or reverseRecordAssociations", () => {
        delete Record.state.currentRecord.fairsharingRecord.recordAssociations
        delete Record.state.currentRecord.fairsharingRecord.reverseRecordAssociations
        expect(wrapper.vm.prepareTabsData()).toBe(false)
    });

});
