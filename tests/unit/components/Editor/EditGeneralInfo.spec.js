import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import editMeta from "@/components/Editor/EditGeneralInfo.vue"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";
import status from "@/data/status.json"
import GraphClient from "@/components/GraphClient/GraphClient.js";
import RestClient from "@/components/Client/RESTClient.js";
import typesQuery from "@/components/GraphClient/queries/getRecordsTypes.json"
import countriesQuery from "@/components/GraphClient/queries/getCountries.json"
import metaTemplate from "../../../fixtures/metaTemplate.json"
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const countriesReady = [
    {
        name: "uk",
        id: 1
    },
    {
        name: "fr",
        id: 2
    }
];
let recordReady = metaTemplate.data;
recordReady.countries = countriesReady;
recordStore.state.metaTemplate = recordReady;
userStore.state.user().credentials.token = "thisisatoken";
const $store = new Vuex.Store({
    modules: {
        users: userStore,
        record: recordStore
    }
});
let $route = { path: "/123/edit", params: {id: 123} };
const router = new VueRouter();
const $router = { push: jest.fn() };

let graphStub;
let restStub;

describe("CreateRecord.vue", function() {
    let wrapper;

    beforeEach( async () => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.withArgs(typesQuery).returns({
            fairsharingRegistries: {
                records: [
                    {
                        name: "abc",
                        id: 1,
                        recordTypes: [
                            {
                                name: "def",
                                id: 1
                            }
                        ]
                    },
                    {
                        name: "tfc",
                        id: 5,
                        recordTypes: [
                            {
                                name: "jhb",
                                id: 2
                            }
                        ]
                    }
                ]
            }
        });
        graphStub.withArgs(countriesQuery).returns({
            searchCountries: countriesReady
        });
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {data: { id: 123}}
        });
        wrapper = await shallowMount(editMeta, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    });
    afterEach(() => {
        graphStub.restore();
        restStub.restore();
    });

    it("can be instantiated", async () => {
        expect(wrapper.name()).toMatch("EditGeneralInfo");
        expect(wrapper.vm.status).toStrictEqual(status.status);
        let countries = await wrapper.vm.getCountries();
        expect(countries).toStrictEqual(countriesReady);
    });

    it("can react to type/registry change", async () => {
        expect(wrapper.vm.metaTemplate).toStrictEqual(recordStore.state.metaTemplate);
        wrapper.vm.metaTemplate.type = 'collection' ;
        expect(wrapper.vm.metaTemplate.status).toMatch("uncertain");
        wrapper.vm.metaTemplate.type = 'test' ;
    });

    it("can post an edited record", async () => {
        wrapper.vm.metaTemplate.type = {
            id: 1
        };
        await wrapper.vm.editRecord();
        expect($router.push).toHaveBeenCalledWith({"path": "/123"});
        expect($router.push).toHaveBeenCalledTimes(1);
    });

    it("can raise an error", async () => {
        restStub.returns({data: {error: {
            response: {
                statusText: 123
            }
        }}});
        await wrapper.vm.editRecord();
        expect($router.push).toHaveBeenCalledTimes(1);
    });

    it("removes countries on click", () => {
        expect(wrapper.vm.countries.length).toEqual(2);
        let preserved = wrapper.vm.countries[1]
        wrapper.vm.removeCountry(wrapper.vm.countries[0]);
        expect(wrapper.vm.countries.length).toEqual(1);
        expect(wrapper.vm.countries[0]).toBe(preserved);
    });
});
