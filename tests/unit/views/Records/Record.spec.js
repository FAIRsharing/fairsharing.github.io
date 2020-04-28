import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import Record from "../../../../src/views/Records/Record.vue";
import VueMeta from "vue-meta";
import Client from "../../../../src/components/GraphClient/GraphClient.js";
import record from "../../../../src/store/record.js";
import users from "../../../../src/store/users.js";
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
                ]
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



});
