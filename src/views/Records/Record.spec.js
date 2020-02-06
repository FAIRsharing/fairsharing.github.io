import { createLocalVue, shallowMount } from "@vue/test-utils";
import Record from "./Record.vue";
import VueMeta from "vue-meta";

import Client from "../../components/GraphClient/GraphClient.js";
const sinon = require("sinon");

const $route = {
    path: "/",
    params: {
        id: "980190962"
    }
};

let localVue = createLocalVue();
localVue.use(VueMeta);
let queryStub;

describe("Record.vue", function() {

    beforeAll( () => {
        queryStub = sinon.stub(Client.prototype, "executeQuery");
        queryStub.withArgs(sinon.match.object).returns({
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
            mocks: {$route},
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

});
