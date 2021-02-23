import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import editAdditionalInfo from "@/components/Editor/AdditionalInformation/EditAdditionalInfo"
import RestClient from "@/components/Client/RESTClient.js"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";
import editorStore from "@/store/editor.js"
import VueRouter from "vue-router";
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const VueScrollTo = require('vue-scrollto');
localVue.use(VueScrollTo);

let record = {
    access_points: [
        {
            type: 'REST',
            url: 'http://wibble.com',
            documentation_url: 'http://wibble.com/docs',
            example_url: 'http://wibble.com/example'
        }
    ],
    associated_tools: [
        {
            name: 'Exciting Access',
            url: 'http://exciting.com'
        }
    ],
    type: "model_and_format"
};
recordStore.state.sections = {
    additionalInformation: {
        error: false,
        data: record,
        initialData: JSON.parse(JSON.stringify(record)),
        changes: 0,
        message: null
    },
    generalInformation: {
        error: false,
        data: {metadata: {}},
        initialData: {metadata: {}},
        changes: 0,
        message: null
    },
    dataAccess: {
        error: false,
        data: {metadata: {}},
        initialData: {metadata: {}},
        changes: 0,
        message: null
    }
};
userStore.state.user().credentials.token = "thisisatoken";
const $store = new Vuex.Store({
    modules: {
        record: recordStore,
        users: userStore,
        editor: editorStore
    }
});

const router = new VueRouter();
const $router = { push: jest.fn() };
let $route = { path: "/123/edit", params: {id: 123} };

let restStub;

describe("EditAdditionalInfo", function() {
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(editAdditionalInfo, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $router, $route}
        });
        restStub = sinon.stub(RestClient.prototype, 'executeQuery');
        restStub.returns(['this', 'that']);
    });
    afterEach(() => {
        restStub.restore();
    });

    it("can be mounted", () => {
        expect(wrapper.name()).toMatch("EditAdditionalInfo");
    });

    // Fails to run in the test for unknown reasons.
    it("returns the correct list of fields names", async () => {
        await wrapper.vm.getFieldNames();
        expect(wrapper.vm.allowedFields).toStrictEqual([
            "access_points",
            "associated_tools"
        ]);
    });

    it("can update a record", async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        recordStore.state.sections.additionalInformation.changes = 1;
        restStub.returns({data: {id: 123}});
        await wrapper.vm.saveRecord(true);
        expect($router.push).toHaveBeenCalledWith({path: "/123"});
        expect($router.push).toHaveBeenCalledTimes(1);
        await wrapper.vm.saveRecord(false);
        expect(recordStore.state.sections.additionalInformation.changes).toEqual(0);
        restStub.returns({data: {error: {response: {data: "error"}}}});
        await wrapper.vm.saveRecord(true);
        expect(recordStore.state.sections.additionalInformation.error).toBe(true);
        expect(recordStore.state.sections.additionalInformation.message).toStrictEqual({"response": {"data": "error"}});
        restStub.restore();
        jest.clearAllMocks();
    });

    it("can update counts", () => {
        expect(wrapper.vm.counts.access_points).toEqual(0);
        wrapper.vm.updateCounts({access_points: 1});
        expect(wrapper.vm.counts.access_points).toEqual(1);
    });
});
