import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex"
import Facets from "../../../../src/components/Records/Search/Facets.vue"
import records from "../../../../src/store/records.js"
import Client from "../../../../src/components/GraphClient/GraphClient.js"

const sinon  =  require("sinon");
const localVue = createLocalVue();
localVue.use(Vuex);

const $route = {
    path: "/search",
    query: {}
};
const $store = new Vuex.Store({
    modules: {
        records: records
    }
});

const push = jest.fn();
const $router = {
    push: jest.fn(),
};

describe("Facets.vue", () =>{
    // Set up the wrapper
    let wrapper;

    beforeAll( () => {
        sinon.stub(Client.prototype, "executeQuery").withArgs(sinon.match.any).returns({
            searchFairsharingRecords: {
                records: [],
                aggregations: {
                    user_defined_tags: {
                        buckets: [
                            {
                                key: 123
                            },
                            {
                                key: "test_me_please"
                            }
                        ]
                    },
                    is_recommended: {
                        buckets: [
                            {
                                key_as_string: "True",
                                key: true
                            }
                        ]
                    },
                    isFake: {
                        buckets: [
                            {
                                key_as_string: "True",
                                key: true
                            }
                        ]
                    }
                }
            }
        });
    });
    afterAll(() => {
        Client.prototype.executeQuery.restore();
    });
    beforeEach(async () => {
        wrapper = shallowMount(Facets, {
            mocks: {$route, $store, $router},
            localVue
        });
        await wrapper.vm.$store.dispatch("records/fetchRecords", {});
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Facets");
    });

    it("can change the display size of a given facet", () => {
        wrapper.vm.changeSize("is_recommended", 10);
        const sizes = wrapper.vm.facetsSize;
        expect(sizes["is_recommended"]).toBe(10);
    });

    it("can add the current facet value as a query parameter of the URL", async () => {
        wrapper.vm.$router.push = push;
        await wrapper.vm.addParam("isRecommended", {key: "True"});
        expect($router.push).toHaveBeenCalledTimes(1);
        wrapper.vm.$route.query = {
            "isRecommended": "True"
        };
        await wrapper.vm.addParam("isRecommended", {key:"True"});
        expect($router.push).toHaveBeenCalledTimes(1);
        await wrapper.vm.addParam("isRecommended", {key: 123});
        expect($router.push).toHaveBeenCalledTimes(2);
    })

    it("has a method cleanString() that replaces underscores from input", () => {
        const testString = "please_test_me";
        let stringOutput = wrapper.vm.cleanString(testString);
        expect(stringOutput).toBe("please test me");
        const testInt = 123;
        stringOutput = wrapper.vm.cleanString(testInt);
        expect(stringOutput).toBe(123);
    });

});
