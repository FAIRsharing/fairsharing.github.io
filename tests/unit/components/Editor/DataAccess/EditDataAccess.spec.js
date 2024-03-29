import { createLocalVue, shallowMount } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuetify from "vuetify"
import Vuex from "vuex"

import DataAccess from "@/components/Editor/DataAccess/EditDataAccess.vue"
import RestClient from "@/lib/Client/RESTClient.js"
import GraphClient from "@/lib/GraphClient/GraphClient.js"
import editorStore from "@/store/editor.js"
import recordStore from "@/store/recordData.js"
import userStore from "@/store/users.js"
const sinon = require("sinon");
const VueScrollTo = require('vue-scrollto');

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueScrollTo);

recordStore.state.sections = {
    dataAccess: {
        data: {
            support_links: [{type: "Other", url: "https://example.com/test"}],
            licences: [{id: 222, name: "test", licence: {id: 123}}]
        },
        initialData: {
            support_links: [{type: "Other", url: "https://example.com/test"}],
            licences: [{id: 222, name: "test", licence: {id: 123}}]
        },
        changes: 0,
        error: null,
        message: null
    },
    generalInformation: {
        data: {metadata: {}},
        initialData: {metadata: {}}
    },
    additionalInformation: {
        data: {metadata: {}},
        initialData: {metadata: {}}
    }
};
userStore.state.user().credentials.token = 123;
const $store = new Vuex.Store({
    modules: {
        editor: editorStore,
        record: recordStore,
        users: userStore
    }
}),
    vuetify = new Vuetify(),
    router = new VueRouter(),
    $router = { push: jest.fn() };
let graphStub,
    restStub,
    wrapper,
    $route = { path: "/123/edit", params: {id: 123} };


describe("Edit -> DataAccess.vue", function() {
    beforeAll(async () => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            searchLicences: [{id: 1, name: "test"}, {id: 2, name: "test2"}]
        });
    });
    beforeEach(async () => {
        wrapper = await shallowMount(DataAccess, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    });
    afterAll(async() => {
        graphStub.restore();
    });

    it("can be mounted", async () => {
        expect(wrapper.vm.$options.name).toMatch("EditDataAccess");
    });

    it("can react to changes of values", async () => {
        wrapper.vm.dataAccess.support_links[0] = {type: "Other", url: "https://example.com/test"};
        expect(recordStore.state.sections.dataAccess.changes).toBe(0);
        await wrapper.vm.dataAccess.support_links.push({type: "Other", url: "https://example.com/test2"});
        expect(recordStore.state.sections.dataAccess.changes).toBe(1);
        await wrapper.vm.dataAccess.licences.push({id: 1, name: "test", licence: {id: 123}});

        expect(recordStore.state.sections.dataAccess.changes).toBe(2);
    });

    it('can save a record', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({data: 'GG!'});
        graphStub.restore();
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            fairsharingRecord: {
                licenceLinks: [
                    {id: 222, name: "test", licence: {id: 123}},
                    {id: 555, name: "test555", licence: {id: 555}}
                ],
                metadata: {
                    support_links: [
                        {type: "Other", url: "https://example.com/test"},
                        {type: "Tess", name: "a test", url: "https://example.com/test"}
                    ]
                }
            }
        });
        await wrapper.vm.saveRecord(false);
        expect(recordStore.state.sections.dataAccess.error).toBe(null);
        expect(recordStore.state.sections.dataAccess.message).toBe("Record successfully updated!");
        wrapper.vm.dataAccess.support_links = [{type: "Other", url: { url: "https://example.com/test2"}}];
        wrapper.vm.dataAccess.licences = [
            {id: 222, name: "test2", licence: {id: 123}},
            {id: 111, name: "test3", licence: {id: 345}},
            {name: "test3", licence: {name: "name"}, fairsharingRecord: {id: 123}}
        ];
        await wrapper.vm.saveRecord(true);
        expect(recordStore.state.sections.dataAccess.error).toBe(null);
        expect(recordStore.state.sections.dataAccess.message).toBe("Record successfully updated!");
        expect($router.push).toHaveBeenCalledWith({path: "/123"});
        expect($router.push).toHaveBeenCalledTimes(1);
        restStub.returns({data: {error: 'I am en error !'}});
        await wrapper.vm.saveRecord(true);
        expect(recordStore.state.sections.dataAccess.error).toBe(true);
        jest.clearAllMocks();
    });
});
