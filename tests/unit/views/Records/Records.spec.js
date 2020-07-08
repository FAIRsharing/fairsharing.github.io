import {shallowMount, createLocalVue} from "@vue/test-utils";
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueMeta from "vue-meta";
import Records from "@/views/Records/Records.vue";
import Client from "@/components/GraphClient/GraphClient.js";
import records from "@/store/records.js"
import introspection from "@/store/introspector.js"
import uiController from "@/store/uiController.js"

const sinon = require("sinon");
const axios = require("axios");

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueMeta);

const $route = {
    name: "Standards",
    path: "/standards",
    query: {
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
        introspection: introspection,
        uiController: uiController
    },
});

const jsdomScrollTo = window.scrollTo;

describe("Records.vue", () => {

    let vuetify;
    let stub = sinon.stub(Client.prototype, "executeQuery");

    beforeAll(() => {
        stub.withArgs(sinon.match.object).returns({searchFairsharingRecords: {records: [1]}});
    });

    afterAll(() => {
        Client.prototype.executeQuery.restore();
    });

    // Set up the wrapper
    let wrapper;
    beforeEach(async () => {
        vuetify = new Vuetify();
        window.scrollTo = () => {
        };
        wrapper = await shallowMount(Records, {
            mocks: {$route, $store},
            localVue,
            vuetify
        });
    });
    afterEach(() => {
        window.scrollTo = jsdomScrollTo;
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Records");
    });

    it("has a currentPath computed attribute", () => {
        expect(wrapper.vm.currentPath[0]).toBe("Standard");
    });

    it("can correctly raise an error", async () => {
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
        const path = wrapper.vm.currentPath;
        const queryParameters = await wrapper.vm.$store.getters["introspection/buildQueryParameters"](path);
        expect(queryParameters).toStrictEqual({
            fairsharingRegistry: "Standard",
            test: 'abc',
            test2: 'abcdef',
            test3: ['abc', ' def'],
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

    it("can correctly redirect", async () => {
        $route.path = "/standards";
        $route.params = {fairsharingRegistry: "Standard"};
        $route.query = {fairsharingRegistry: "Standard"};
        const $router = {
            push: jest.fn(),
        };
        let localWrapper = await shallowMount(Records, {
            mocks: {$route, $store, $router},
            localVue,
            vuetify
        });
        await localWrapper.vm.tryRedirect();
        expect($router.push).toHaveBeenCalledTimes(2);
        $route.name = "test";
        $route.params = {fairsharingRegistry: "123"};
        $route.query = {fairsharingRegistry: "123"};
        await localWrapper.vm.tryRedirect();
        expect($router.push).toHaveBeenCalledTimes(2);
    })


    it("can check responsiveClassObject",  () => {
        wrapper.vm.stickToLeft = true
        vuetify.framework.breakpoint.xlOnly = true
    })

    it("can onScroll function work properly",  () => {

        wrapper.vm.offsetTop = 150;
        let mEvent = {
            target: { scrollTop:150},
        };
        wrapper.vm.onScroll(mEvent);

        mEvent = {
            target: { scrollTop:50},
        };
        wrapper.vm.onScroll(mEvent);

        mEvent = {
            target: { scrollTop:501},
        };
        wrapper.vm.onScroll(mEvent);
    })


});
