import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import CreateRecord from "@/views/CreateRecord/Editor.vue"
import recordStore from "@/store/record.js";
import GraphClient from "@/components/GraphClient/GraphClient.js";
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store({modules: {record: recordStore}});
let $route = {
    params: {
        id: "123"
    }
};
let graphStub;

describe("Editor.vue", function() {
    let wrapper;

    beforeAll(() => {
        let returnedData = {
            type: "standard",
            status: "ready",
            countries: "",
            metadata: {
                name: "",
                abbreviation: "",
                year_creation: 2020,
                homepage: "",
                description: ""
            }
        };
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.withArgs(sinon.match.any).returns({
            fairsharingRecord: returnedData
        });
    });
    afterAll(() => {
        graphStub.restore()
    });

    beforeEach(() => {
        wrapper = shallowMount(CreateRecord, {
            localVue,
            mocks: {$store, $route}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Editor");
    });

});
