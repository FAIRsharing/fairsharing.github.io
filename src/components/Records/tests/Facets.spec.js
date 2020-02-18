import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex"
import Facets from "../Facets.vue"
import records from "../../../store/records.js"
import Client from "../../GraphClient/GraphClient.js"

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

    it("can get the facets sizes from the store", () => {
        const sizes = wrapper.vm.facetsSize;
        expect(sizes).toStrictEqual({userDefinedTags: 4, isRecommended: 4});
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

});