import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex"
import Vuetify from "vuetify"
import Records from "./Records.vue";
import Client from "../../components/GraphClient/GraphClient.js";
import records from "../../store/records.js"
import introspection from "../../store/introspector.js"

const sinon = require("sinon");
const axios = require("axios");

const localVue = createLocalVue();
localVue.use(Vuex);



const $route = {
    path: "/search",
    query: {
        fairsharingRegistry:"standard",
        grants: "string",
        publications: null,
        isRecommended: "false",
        registry: "[abc,def]",
        licences: 123
    }
};

const $store = new Vuex.Store({
    modules: {
        records: records,
        introspection: introspection
    },
});

const jsdomScrollTo = window.scrollTo;

describe("Records.vue", () => {

    let vuetify;
    let stub = sinon.stub(Client.prototype, "executeQuery");

    beforeAll( () => {
        stub.withArgs(sinon.match.object).returns({searchFairsharingRecords: {records: [1]}});
    });

    afterAll( () => {
        Client.prototype.executeQuery.restore();
    });

    // Set up the wrapper
    let wrapper;
    beforeEach(() => {
        vuetify = new Vuetify();
        wrapper = shallowMount(Records, {mocks: {$route, $store}, localVue, vuetify});
        window.scrollTo = () => {};
    });
    afterEach( () =>{
        window.scrollTo = jsdomScrollTo;
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Records");
    });

    it("has a currentPath computed attribute", () => {
        expect(wrapper.vm.currentPath[0]).toBe("Standard");
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
    });

    it("can get the query parameters types from introspection", async () => {
        let returnedVal = {
            data: {
                data: {
                    "__schema": {
                        "types": [
                            {
                                name: "Query",
                                fields: [
                                    {
                                        name: "searchFairsharingRecords",
                                        args: [
                                            {
                                                name: "test",
                                                description: "testDescription",
                                                type: "String",
                                                defaultValue: "1"
                                            }
                                        ]
                                    }
                                ]
                            }]
                    }
                }
            }
        };
        let errorTest = {
            data: {
                errors: [
                    {message: "Error"}
                ]
            }
        };

        sinon.stub(Client.prototype, "getData").withArgs(sinon.match.any).returns(returnedVal);
        await wrapper.vm.$store.dispatch("introspection/fetchParameters");
        expect(wrapper.vm.$store.state.introspection.searchQueryParameters.args).toStrictEqual([{
            name: "test",
            description: "testDescription",
            type: "String",
            defaultValue: "1"
        }]);
        Client.prototype.getData.restore();


        sinon.stub(Client.prototype, "getData").withArgs(sinon.match.any).returns(errorTest);
        await wrapper.vm.$store.dispatch("introspection/fetchParameters");
        expect(wrapper.vm.$store.state.introspection.error).toBe("Can't initialize application");
        Client.prototype.getData.restore();
    });

    it("can switch between panels", () => {
        wrapper.vm.setPanel("Facets");
        expect(wrapper.vm.currentPanel).toBe("Facets");
    });

    it("can get the records", async () => {
        $route.query = {
            "test": "abc",
            "test2": ["abcdef"],
            "test3": "abc, def",
            "test4": 123,
            "test5": true
        };
        let returnedVal = {
            data: {
                data: {
                    "__schema": {
                        "types": [
                            {
                                name: "Query",
                                fields: [
                                    {
                                        name: "searchFairsharingRecords",
                                        args: [
                                            {
                                                name: "test",
                                                description: "testDescription",
                                                type: "String",
                                                defaultValue: "1"
                                            },
                                            {
                                                name: "test2",
                                                description: "testDescription2",
                                                type: {
                                                    kind: "LIST",
                                                    ofType: {
                                                        ofType: {
                                                            name: "String"
                                                        }
                                                    }
                                                },
                                                defaultValue: "1",

                                            },
                                            {
                                                name: "test3",
                                                description: "testDescription2",
                                                type: {
                                                    kind: "LIST",
                                                    ofType: {
                                                        ofType: {
                                                            name: "String"
                                                        }
                                                    }
                                                },
                                                defaultValue: "1",

                                            },
                                            {
                                                name: "test4",
                                                description: "testDescription",
                                                type: {
                                                    name: "Int"
                                                },
                                                defaultValue: "1"
                                            },
                                            {
                                                name: "test5",
                                                description: "testDescription",
                                                type: {
                                                    name: "Boolean"
                                                },
                                                defaultValue: "1"
                                            }
                                        ]
                                    }
                                ]
                            }]
                    }
                }
            }
        };
        sinon.stub(Client.prototype, "getData").withArgs(sinon.match.any).returns(returnedVal);
        await wrapper.vm.$store.dispatch("introspection/fetchParameters");
        Client.prototype.getData.restore();
        let path = wrapper.vm.currentPath;

        const queryParameters = await wrapper.vm.$store.getters["introspection/buildQueryParameters"](path);
        expect(queryParameters).toStrictEqual({
            test: 'abc',
            test2: 'abcdef',
            test3: [ 'abc', ' def' ],
            test4: 123,
            test5: true
        })
    });

    it("can reset the store when destroyed", () => {
        wrapper.destroy();
        expect(wrapper.vm.$store.state.records.facets).toStrictEqual([]);
        expect(wrapper.vm.$store.state.records.records).toStrictEqual([]);
    });

    it("react to path change", async () => {
        $route.path = "/search";
        $route.query = {};
        expect(wrapper.vm.currentPath[0]).toBe("Search");
    });

});
