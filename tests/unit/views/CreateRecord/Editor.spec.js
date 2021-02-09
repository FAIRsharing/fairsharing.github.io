import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import CreateRecord from "@/views/CreateRecord/Editor.vue"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";
import GraphClient from "@/components/GraphClient/GraphClient.js";
import RESTClient from "@/components/Client/RESTClient.js"
import metaTemplate from "../../../fixtures/metaTemplate.json"
import VueRouter from "vue-router";
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);

const $store = new Vuex.Store({modules: {
    record: recordStore,
    users: userStore
}});
$store.state.users.user = function(){return {credentials: {token: "123"}}};
let $route = {params: {id: "123"}};
const router = new VueRouter();
const $router = { push: jest.fn() };
let graphStub;
let restStub;

describe("Editor.vue", function() {
    let wrapper;

    beforeAll(() => {
        let returnedData = metaTemplate.data;
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.withArgs(sinon.match.any).returns({
            fairsharingRecord: returnedData
        });
        restStub = sinon.stub(RESTClient.prototype, "executeQuery");
        restStub.withArgs(sinon.match.any).returns({
            data: {id: 1}
        });
    });
    afterAll(() => {
        graphStub.restore();
        restStub.restore();
    });

    it("can be instantiated", async () => {
        wrapper = await shallowMount(CreateRecord, {
            localVue,
            mocks: {$store, $route}
        });
        expect(wrapper.name()).toMatch("Editor");
        expect(wrapper.vm.userToken).toBe("123");
        $store.state.users.user = async () => {return {}};
        expect(wrapper.vm.userToken).toBe(null);
        wrapper.destroy();
    });

    it("can deal with errors", async () => {
        $route.params.id = "FAIRsharing.abcde";
        restStub.restore();
        restStub = sinon.stub(RESTClient.prototype, "executeQuery");
        restStub.withArgs(sinon.match.any).returns({data: {error: "error"}});
        wrapper = await shallowMount(CreateRecord, {
            localVue,
            mocks: {$store, $route}
        });
        await wrapper.vm.getData();
        expect(wrapper.vm.error).toBe(true);
    });

    it("reloads data correctly", async () => {
        wrapper = await shallowMount(CreateRecord, {
            localVue,
            mocks: {$store, $route}
        });
        wrapper.vm.confirmPanels[0].show = true;
        await wrapper.vm.confirmPanels[0].method();
        expect(wrapper.vm.confirmPanels[0].show).toBe(false);
    });

    it("can prevent leaving the route", async () => {
        wrapper = await shallowMount(CreateRecord, {
            localVue,
            router,
            mocks: {$store, $route, $router}
        });
        global.confirm = jest.fn(() => true);
        const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave;
        let nextFun = jest.fn();
        beforeRouteLeave.call(wrapper.vm , "toObj", "fromObj", nextFun);
        expect(nextFun).toHaveBeenCalledTimes(1);
        recordStore.state.sections.generalInformation.changes = 1;
        beforeRouteLeave.call(wrapper.vm , "toObj", "fromObj", nextFun);
        expect(nextFun).toHaveBeenCalledTimes(2);
        global.confirm = jest.fn(() => false);
        beforeRouteLeave.call(wrapper.vm , "toObj", "fromObj", nextFun);
        expect(nextFun).toHaveBeenCalledTimes(2);
    });

    it("can load without support links", async () => {
        let returnedData = metaTemplate.data;
        returnedData.metadata.support_links = null;
        graphStub.returns({
            fairsharingRecord: returnedData
        });
        wrapper = await shallowMount(CreateRecord, {
            localVue,
            router,
            mocks: {$store, $route, $router}
        });
        expect(wrapper.name()).toMatch("Editor");
    });

});
