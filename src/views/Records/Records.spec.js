import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex"
import Records from "./Records.vue";
import Client from "../../components/GraphClient/GraphClient.js";
import records from "../../store/records.js"
const sinon = require("sinon");
const axios = require("axios");

const localVue = createLocalVue();
localVue.use(Vuex);
const $route = {
    path: "/standards",
    query: {
        param1: "string",
        param2: null,
        param3: "false",
        param4: "[abc,def]",
        param5: 123
    }
};
const $store = new Vuex.Store({
    modules: {
        records: records
    },
});

const jsdomScrollTo = window.scrollTo;

describe("Records.vue", () => {

    let stub = sinon.stub(Client.prototype, "executeQuery");

    beforeAll( () => {
        stub.withArgs(sinon.match.object).returns({
            searchFairsharingRecords: {
                records: [
                    1
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
        wrapper = shallowMount(Records, {
            mocks: {$route, $store},
            localVue,
        });
        window.scrollTo = () => {};
    });
    afterEach( () =>{
        window.scrollTo = jsdomScrollTo;
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Records");
    });

    it("has a currentPath computed attribute", () => {
        expect(wrapper.vm.currentPath[0]).toBe("Standards");
    });

    it("react to path change", async () => {
        $route.path = "/search";
        $route.query = {};
        expect(wrapper.vm.currentPath[0]).toBe("Search");
    });

    it("can correctly raise an error", async () =>{
        Client.prototype.executeQuery.restore();
        sinon.stub(axios, "post").withArgs(sinon.match.any).returns({
            data: {
                errors: [
                    {message: "Error"}
                ]
            }
        });
        await expect(wrapper.vm.getData()).rejects;
        axios.post.restore();

    })

});
