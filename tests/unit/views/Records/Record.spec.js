import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import Record from "@/views/Records/Record.vue";
import VueMeta from "vue-meta";
import Client from "@/components/GraphClient/GraphClient.js";
import record from "@/store/record.js";
import users from "@/store/users.js";
const sinon = require("sinon");

const $route = {
    path: "/",
    params: {
        id: "980190962"
    }
};

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueMeta);
let queryStub;

const $store = new Vuex.Store({
    modules: {
        record: record,
        users: users,
    }
});

describe("Record.vue", function() {
    let wrapper;
    let vuetify;

    beforeAll( () => {
        queryStub = sinon.stub(Client.prototype, "executeQuery");
        queryStub.withArgs(sinon.match.any).returns({
            fairsharingRecord:{
                id: 1,
                name: "test",
                licences: [
                    {
                        name: "test",
                        url: "https://example.com"
                    }
                ],
                metadata: {
                    contacts: []
                }
            }
        });
    });

    afterAll( () => {
        Client.prototype.executeQuery.restore();
    });

    // Set up the wrapper
    beforeEach(() => {
        vuetify = new Vuetify();
        wrapper = shallowMount(Record, {
            mocks: {$route, $store},
            localVue,
            vuetify
        });
    });
    const path = "980190962";
    const title = "FAIRsharing | " + path;

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Record");
    });

    it("has a currentRoute computed property", () => {
        expect(wrapper.vm.currentRoute).toMatch(path);
        expect(wrapper.vm.getTitle()).toBe(title);
    });

    it("has it meta title dynamically set", () => {
        expect(wrapper.vm.$meta().refresh().metaInfo.title).toBe(title);
    });

    it("react to path change", async () => {
        $route.params = {
            id: "123"
        };
        expect(wrapper.vm.currentRoute).toMatch("123");
    });

    it ("can properly fetch a record history", async () => {
        await wrapper.vm.getHistory();
    });

    it("can correctly raise an error", async () =>{
        Client.prototype.executeQuery.restore();
        sinon.stub(Client.prototype, "getData").withArgs(sinon.match.any).returns({
            data: {errors: [{message: "Im an error"}]}
        });
        await wrapper.vm.getData();
    });

    it("can check cleanString returns properly",  () =>{
        const term = 'hosein_mirian'
        let returnedValue = wrapper.vm.cleanString(term)
        expect(returnedValue).toBe('hosein mirian');
    });

    it("can check capitalize function works fine ",()=>{
        const expected = wrapper.vm.capitalize('hosein')
        expect(expected).toBe('Hosein');
    })

    it("can check flattenAssociatedRecordsArray returns a flat joined array ",()=>{
        let fakeAssociatedRecords = [
            {
                "linkedRecord": {
                    "name": "Apollo XSD 4.0.1",
                    "id": 343,
                    "registry": "standard",
                    "type": "model_and_format"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "linkedRecord": {
                    "name": "Observational Medical Outcomes Partnership Standardized Vocabularies",
                    "id": 1247,
                    "registry": "standard",
                    "type": "terminology_artefact"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "linkedRecord": {
                    "name": "Fast Healthcare Interoperability Resources",
                    "id": 294,
                    "registry": "standard",
                    "type": "model_and_format"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "linkedRecord": {
                    "name": "The Unified Code for Units of Measure",
                    "id": 1280,
                    "registry": "standard",
                    "type": "terminology_artefact"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "linkedRecord": {
                    "name": "Digital Imaging and COmmunications in Medicine",
                    "id": 83,
                    "registry": "standard",
                    "type": "model_and_format"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "linkedRecord": {
                    "name": "CDISC Laboratory Data Model",
                    "id": 91,
                    "registry": "standard",
                    "type": "model_and_format"
                },
                "recordAssocLabel": "related_to"
            },
            {
                "linkedRecord": {
                    "name": "Health Level Seven Reference Implementation Model",
                    "id": 1345,
                    "registry": "standard",
                    "type": "terminology_artefact"
                },
                "recordAssocLabel": "related_to"
            }
        ];
        let fakeReverseAssociatedRecords=[
            {
                "fairsharingRecord": {
                    "name": "RDA Covid-19 WG Resources",
                    "id": 3012,
                    "registry": "collection"
                },
                "recordAssocLabel": "collects"
            },
            {
                "fairsharingRecord": {
                    "name": "H2020 Phenome and Metabolome aNalysis (PhenoMenal) Project",
                    "id": 3024,
                    "registry": "collection"
                },
                "recordAssocLabel": "collects"
            },
            {
                "fairsharingRecord": {
                    "name": "eTRIKS Standards Starter Pack",
                    "id": 3031,
                    "registry": "collection"
                },
                "recordAssocLabel": "collects"
            },
            {
                "fairsharingRecord": {
                    "name": "Systems Medicine",
                    "id": 3055,
                    "registry": "collection"
                },
                "recordAssocLabel": "collects"
            }
        ];

        wrapper.vm.flattenAssociatedRecordsArray(fakeAssociatedRecords,fakeReverseAssociatedRecords);
        expect(wrapper.vm.flatAscociatedRecords.length).toBe(11);

         fakeReverseAssociatedRecords=[
            {
                "UNDEFINED": {
                    "name": "RDA Covid-19 WG Resources",
                    "id": 3012,
                    "registry": "collection"
                },
                "recordAssocLabel": "collects"
            },
        ];
        wrapper.vm.flattenAssociatedRecordsArray(fakeAssociatedRecords,fakeReverseAssociatedRecords)
    })


});
