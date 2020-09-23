import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import CreateRecord from "@/views/CreateRecord/Editor.vue"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";
import GraphClient from "@/components/GraphClient/GraphClient.js";
import RESTClient from "@/components/Client/RESTClient.js"
import metaTemplate from "../../../fixtures/metaTemplate.json"
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store({modules: {
    record: recordStore,
    users: userStore
}});
$store.state.users.user = function(){return {credentials: {token: "123"}}};
let $route = {params: {id: "123"}};
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


});
