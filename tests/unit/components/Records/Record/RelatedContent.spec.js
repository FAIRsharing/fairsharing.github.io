import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import RelatedContent from "@/components/Records/Record/RelatedContent.vue"
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
            recordAssocLabel: "implements"
        },
        {
            linkedRecord: {
                id: 3,
                name: "a name 3",
                registry: "Database",
                type: "journal"
            },
            recordAssocLabel: "related to"
        }
    ],
    reverseRecordAssociations: [
        {
            linkedRecord: {
                id: 2,
                name: "b name",
                registry: "Policy",
                type: "repository"
            },
            recordAssocLabel: "related to"
        }
    ],
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("RelatedContent.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(RelatedContent, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("RelatedContent");
    });

    it("search data is reactive when user changes text box value", () => {
        wrapper.vm.selectedValues = "a name 3"
        wrapper.vm.tabsData.tabs.related_standards.data = []
        wrapper.vm.tabsData.selectedTab = 1
        wrapper.vm.selectedValues = "a name 3"
        wrapper.vm.tabsData.selectedTab = 0
        wrapper.vm.getFirstActiveTab()
        expect(wrapper.vm.tabsData.selectedTab).toBe(1)
    });

    it("can check if there are no record recordAssociations or reverseRecordAssociations", () => {
        delete Record.state.currentRecord.fairsharingRecord.recordAssociations
        delete Record.state.currentRecord.fairsharingRecord.reverseRecordAssociations
        expect(wrapper.vm.prepareTabsData()).toBe(false)
    });

});
