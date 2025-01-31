import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router"
import Vuetify from "vuetify"
import Vuex from "vuex";

import relationTypes from "@/../tests/fixtures/relationTypes.json"
import editRelations from "@/components/Editor/EditRelationships.vue"
import RestClient from "@/lib/Client/RESTClient.js"
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
import userStore from "@/store/users.js";
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();
const VueScrollTo = require('vue-scrollto');
localVue.use(VueScrollTo);

let relations = [{
    id: 123,
    linkedRecord: {id: 111, name: "yes", registry: "collection", abbreviation: "yes", type: "collection"},
    recordAssocLabel: "?",
    recordAssocLabelId: 1,

}];
recordStore.state.sections = {
    relations: {
        data: {
            registry: "collection",
            type: "collection",
            recordAssociations: JSON.parse(JSON.stringify(relations))
        },
        error: false,
        changes: 0,
        initialData: {
            registry: 'collection',
            recordAssociations: JSON.parse(JSON.stringify(relations))
        }
    },
    generalInformation: {},
    record: {
        fairsharingRecord: {
            id: 1243,
            type: "metric"
        }
    },

};
recordStore.state.currentRecord.fairsharingRecord = {
    id: 1243,
    type: "model"
}

userStore.state.user().credentials.token = "thisisatoken";
const $store = new Vuex.Store({
    modules: {
        users: userStore,
        record: recordStore,
        editor: editorStore
    }
});
let $route = { path: "/123/edit", params: {id: 123} };
const router = new VueRouter();
const $router = { push: jest.fn() };

let restStub;
let graphStub;

describe("EditRelationships.vue", function() {
    let wrapper;

    beforeEach(async () => {
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({data: relationTypes});
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            searchFairsharingRecords: { records: [{id: 1}]}
        });
        wrapper = await shallowMount(editRelations, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
        wrapper.vm.$refs['editRecordAssociation'] = {
            validate: jest.fn()
        };
    });

    afterEach(() => {
        restStub.restore();
        graphStub.restore();
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("EditRelationships");
        wrapper.vm.labelsFilter = null;
        expect(wrapper.vm.getAssociations).toStrictEqual([relations[0]]);
    });

    it("can watch and react to search and associations changes", async () => {
        wrapper.vm.search = 'tester';
        expect(wrapper.vm.availableRecords).toStrictEqual([{id: 1, isActive: true}]);
        let pushItem = {
            "id":123,
            "linkedRecord":{"id":456,"name":"no","registry":"collection", abbreviation: "no"},
            "recordAssocLabel":"?",
            "recordAssocLabelId":1
        };
        await recordStore.state.sections.relations.data.recordAssociations.push(pushItem);
        expect(recordStore.state.sections.relations.changes).toBe(1);
        await wrapper.vm.removeItem({
            linkedRecord: {
                id: 456
            },
            recordAssocLabelId: 1
        });
        expect(recordStore.state.sections.relations.changes).toBe(0);
    });

    it("can open the overlay to add a new association", () => {
        let output = [
            {"relation":"deprecates","target":"collection","id":9,"relationId":9},
            {"relation":"collects","target":"collection","id":10,"relationId":10}];
        wrapper.vm.showOverlay({
            name: "no",
            id: 123,
            registry: 'collection',
            type: 'collection'
        });
        expect(wrapper.vm.panelContent).toStrictEqual(output);
        wrapper.vm.showOverlay({
            name: "no",
            id: 111,
            registry: 'collection',
            type: 'collection'
        });
        expect(wrapper.vm.panelContent).toStrictEqual(output);
        wrapper.vm.addingRelation.recordAssocLabel = {
            id: 1,
            relation: 'undefined',
            relationId: 1,
            target: "collection"
        };
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        wrapper.vm.addItem();
        expect(wrapper.vm.sections.relations.data.recordAssociations[0]).toStrictEqual({
            new: true,
            linkedRecord: wrapper.vm.addingRelation.linkedRecord,
            recordAssocLabel: wrapper.vm.addingRelation.recordAssocLabel
        });
        jest.clearAllMocks();
        wrapper.vm.removeItem({
            linkedRecord: {
                id: wrapper.vm.addingRelation.linkedRecord.id
            },
            recordAssocLabelId: wrapper.vm.addingRelation.recordAssocLabel.id
        });
    });

    it ("can search for records", async () => {
        wrapper.vm.searchFilters.standards = false;
        await wrapper.vm.runSearch();
        expect(wrapper.vm.availableRecords).toStrictEqual([ { id: 1, isActive: true } ]);
        wrapper.vm.searchFilters.standards = true;
    });

    it("can save relationships", async () => {
        wrapper.vm.showOverlay({
            name: "yolo",
            id: 333,
            registry: 'collection',
            type: 'collection'
        });
        wrapper.vm.addingRelation.recordAssocLabel = {
            id: 1,
            relation: 'undefined',
            relationId: 1,
            target: "collection"
        };
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        wrapper.vm.addItem();
        expect(wrapper.vm.sections.relations.data.recordAssociations[0]).toStrictEqual({
            new: true,
            linkedRecord: wrapper.vm.addingRelation.linkedRecord,
            recordAssocLabel: wrapper.vm.addingRelation.recordAssocLabel
        });
        jest.clearAllMocks();
        wrapper.vm.removeItem({
            linkedRecord: {
                id: wrapper.vm.addingRelation.linkedRecord.id
            },
            recordAssocLabelId: wrapper.vm.addingRelation.recordAssocLabel.id
        });
        graphStub.restore();
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            fairsharingRecord: { recordAssociations: []}
        });
        await wrapper.vm.saveRecord(false);
        expect(wrapper.vm.message.error).toBe(false);
        expect(wrapper.vm.message.value).toBe("Record successfully updated!");
        await wrapper.vm.saveRecord(true);
        expect($router.push).toHaveBeenCalledWith({path: '/123'});

        restStub.restore();
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {error: "I am an error" }
        });
        wrapper.vm.addItem();
        await wrapper.vm.saveRecord(true);
        expect(wrapper.vm.message.error).toBe(true);
        expect(wrapper.vm.message.value).toBe("I am an error")
    });

    it('can save again', async() => {
        graphStub.restore();
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            fairsharingRecord: { recordAssociations: []}
        });
        recordStore.state.sections.relations.data.recordAssociations = relations;
        recordStore.state.sections.relations.initialData.recordAssociations = relations;
        wrapper.vm.showOverlay({
            name: "yolo",
            id: 333,
            registry: 'collection',
            type: 'collection'
        });
        wrapper.vm.addingRelation.recordAssocLabel = {
            id: 1,
            relation: 'undefined',
            relationId: 1,
            target: "collection"
        };
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        wrapper.vm.addItem();
        expect(wrapper.vm.sections.relations.data.recordAssociations[0]).toStrictEqual({
            new: true,
            linkedRecord: wrapper.vm.addingRelation.linkedRecord,
            recordAssocLabel: wrapper.vm.addingRelation.recordAssocLabel
        });
        await wrapper.vm.saveRecord(true);
        jest.clearAllMocks();
    })

    it("doesn't add the same record/relation twice", () => {
        wrapper.vm.addingRelation = {
            linkedRecord: {
                name: "yes",
                registry: "collection",
                type: "collection"
            },
            recordAssocLabel: {
                relation: "undefined"
            }

        };
        wrapper.vm.sections.relations.data.recordAssociations = [
            {
                "linkedRecord": {
                    "name":"yes",
                    registry: "collection",
                    type: "collection"
                },
                "recordAssocLabel": {
                    "relation":"undefined",
                },
            }
        ]
        wrapper.vm.addItem();
        expect(wrapper.vm.duplicateRelationship).toBe(true);
    });



});
