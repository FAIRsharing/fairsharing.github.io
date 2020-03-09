import { createLocalVue, shallowMount } from "@vue/test-utils";
import Record from "./Record.vue";
import VueMeta from "vue-meta";
import Client from "../../components/GraphClient/GraphClient.js";
import Vuex from "vuex";
import records from "../../store/records";
const sinon = require("sinon");
const axios = require("axios");

const $route = {
    path: "/",
    params: {
        id: "980190962"
    }
};

let localVue = createLocalVue();
localVue.use(VueMeta);
localVue.use(Vuex);
let queryStub;

const $store = new Vuex.Store({
    modules: {
        records: records
    }
});


describe("Record.vue", function() {

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
                ]
            }
        });
    });

    afterAll( () => {
        Client.prototype.executeQuery.restore();
    });

    // Set up the wrapper
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(Record, {
            mocks: {$route, $store},
            localVue
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



});
