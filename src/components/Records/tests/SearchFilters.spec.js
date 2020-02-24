import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex"
import Vuetify from "vuetify"
import searchFilters from "../SearchFilters.vue"
import filters from "../../../store/searchFilters.js"
import records from "../../../store/records.js"
import Client from "../../GraphClient/GraphClient.js"

const axios = require("axios");
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);

const $route = {
   path: "/123",
   query: {}
};
const $store = new Vuex.Store({
    modules: {
        records: records,
        searchFilters: filters
    },
});

const $router = {
    push: jest.fn(),
};

describe("SearchFilters.vue", () => {

    // Set up the wrapper
    let wrapper;
    let vuetify;
    let client = new Client();

    beforeAll(() => {
        sinon.stub(axios, "post").withArgs(sinon.match.any).returns({
                data: {
                    data: {
                        searchFairsharingRecords: {
                            aggregations: {
                                countries: {
                                    buckets: [
                                        {key: "the united states of america"},
                                        {key: "the_united_of_canada"}
                                    ]
                                },
                                publications: {
                                    buckets: [
                                        {
                                            key_as_string: "a publication",
                                            values: ["pub1", "pub2", "pub3"]
                                        }
                                    ]
                                },
                                "AfAkeField": {
                                    buckets: []
                                },
                                licences: {
                                    buckets: [
                                        {
                                            key: "test_something"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }});
    });
    afterAll(() => {
        axios.post.restore();
    });
    beforeEach(() => {
        vuetify = new Vuetify();
        wrapper = shallowMount(searchFilters, {
            mocks: {$route, $store, $router},
            localVue,
            vuetify
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchFilters");
    });

    it("can render the filters from the store", async () => {
        await wrapper.vm.$store.dispatch('searchFilters/fetchFilters', client);
        expect(wrapper.vm.filters[0].filterName).toMatch("id");
        expect(wrapper.vm.filters[1].filterName).toMatch("countries");
        expect(wrapper.vm.filters[2].filterName).toMatch("publications");
        await wrapper.vm.$store.dispatch('searchFilters/fetchFilters', client);
    });

    it("can append/modify query parameters", async () => {
        await wrapper.vm.$store.dispatch('searchFilters/fetchFilters', client);
        wrapper.vm.form.data = {
            publications: "pub1"
        };
        await wrapper.vm.applyFilters();
        expect(wrapper.vm.$store.state.records.records).toStrictEqual([]);

        wrapper.vm.cleanString("test_something");
        wrapper.vm.form.data = {countries: "the united of canada", publications: "test_something"};
        await wrapper.vm.applyFilters();
        expect(wrapper.vm.$store.state.records.records).toStrictEqual([]);
    });

    it("can reset the filter values", async () => {
        await wrapper.vm.$store.dispatch('searchFilters/fetchFilters', client);
        wrapper.vm.form.data = {
            publications: "pub1"
        };
        wrapper.vm.reset();
        expect(wrapper.vm.form.data).toStrictEqual({});
    });

    it("can clean up a given string", () => {
        let rawString = "this_is_a_super test";
        expect(wrapper.vm.cleanString(rawString)).toMatch("this is a super test");
        rawString = "this/is@another-test";
        expect(wrapper.vm.cleanString(rawString)).toMatch(rawString);
    });


});