import {shallowMount, createLocalVue} from "@vue/test-utils";
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueMeta from "vue-meta";
import Records from "@/views/Records/Records.vue";
import Client from "@/lib/GraphClient/GraphClient.js";
import records from "@/store/recordSearch.js"
import introspection from "@/store/introspector.js"
import fakeIntrospection from "@/../tests/fixtures/fakeIntrospection.json"
import uiController from "@/store/uiController.js"
import {actions} from "@/store/uiController.js"
import VueScrollTo from "vue-scrollto";

const sinon = require("sinon");
const axios = require("axios");

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueMeta);
localVue.use(VueScrollTo,{})
const $route = {
    name: "Standards",
    path: "standard",
    query: {
        fairsharingRegistry: "Standard",
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

        wrapper = await shallowMount(Records, {
            mocks: {$route, $store},
            localVue,
            vuetify,
        });
        delete global.window['top'];
        global.window = Object.create(window);
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
                data: fakeIntrospection.data
            },
            headers: {
                maintenance: "false"
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

    it("react to path change", async () => {
        $route.path = "/search";
        $route.query = {};
        expect(wrapper.vm.currentPath[0]).toBe("Search");
        $route.path = "/standard";
        expect(wrapper.vm.currentPath[0]).toBe("Standard");

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
    });

    it("can onScroll function work properly", () => {

        wrapper.vm.$store.state.records.records = ['1', '2', '3'];

        global.window.top = {scrollY:150};
        actions.commit = jest.fn();
        actions.setGeneralUIAttributesAction({});
        wrapper.vm.onScroll();
        expect(actions.commit).toHaveBeenCalledTimes(1);


        global.window.top = {scrollY:50};
        actions.commit = jest.fn();
        actions.setGeneralUIAttributesAction({});
        wrapper.vm.onScroll();
        expect(actions.commit).toHaveBeenCalledTimes(1);

        global.window.top = {scrollY:501};
        actions.commit = jest.fn();
        actions.setGeneralUIAttributesAction({});
        wrapper.vm.onScroll();
        expect(actions.commit).toHaveBeenCalledTimes(1);
    });


    it("can reset the store when destroyed", () => {
        wrapper.destroy();
        expect(wrapper.vm.$store.state.records.facets).toStrictEqual([]);
        expect(wrapper.vm.$store.state.records.records).toStrictEqual([]);
        expect(wrapper.vm.$store.state.records.loading).toBe(false);
        const otherStates = ["hits","totalPages","perPage","currentPage"]
        otherStates.forEach(state => {
            expect(wrapper.vm.$store.state.records[state]).toBe(null)
        })
    });

});
