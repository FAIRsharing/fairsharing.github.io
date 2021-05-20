import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
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
        },
        {
            linkedRecord: {
                id: 4,
                name: "a name 4",
                registry: "Collection",
                type: "collection"
            },
            recordAssocLabel: "collects"
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
    registry:'Standard'
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

    it("can check if the current record is a collection type to behave accordingly", () => {
        Record.state.currentRecord["fairsharingRecord"].registry = 'Collection'
        wrapper.vm.prepareTabsData();
        expect(wrapper.vm.tabsData.tabs['other_related_records'].data).toStrictEqual([
            {
                "id": 4,
                "name": "a name 4",
                "recordAssocLabel": "collects",
                "registry": "Collection",
                "subject": "standard",
                "type": "collection"
            },
            {
                "id": 2,
                "name": "b name",
                "recordAssocLabel": "related to",
                "registry": "Policy",
                "subject": "standard",
                "type": "repository"
            }
        ])
    });

    it("can check if there are no record recordAssociations or reverseRecordAssociations", () => {
        delete Record.state.currentRecord.fairsharingRecord.recordAssociations
        delete Record.state.currentRecord.fairsharingRecord.reverseRecordAssociations
        expect(wrapper.vm.prepareTabsData()).toBe(false)
    });



});
