import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import editMeta from "@/components/Editor/EditGeneralInfo.vue"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";
import status from "@/components/Editor/status.json"
import GraphClient from "@/components/GraphClient/GraphClient.js";
// import metaTemplate from "../../../fixtures/metaTemplate.json"
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();
recordStore.state.metaTemplate = {
    type: 'type1',
    status: 'ready'
};;
const $store = new Vuex.Store({
    modules: {
        users: userStore,
        record: recordStore
    }
});
let $route = { name: "New_content", path: "/new" };
const router = new VueRouter();
const $router = { push: jest.fn() };

let graphStub;

describe("CreateRecord.vue", function() {
    let wrapper;

    it("can be instantiated", async () => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
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
        wrapper = await shallowMount(editMeta, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
        expect(wrapper.name()).toMatch("EditGeneralInfo");
        expect(wrapper.vm.status).toStrictEqual(status.status);
        graphStub.restore();
    });

    it("can reaction to type change", async () => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
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
        wrapper = await shallowMount(editMeta, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
        expect(wrapper.vm.metaTemplate).toStrictEqual(recordStore.state.metaTemplate);
        wrapper.vm.metaTemplate.type = 'collection' ;
        expect(wrapper.vm.metaTemplate.status).toMatch("uncertain");
        wrapper.vm.metaTemplate.type = 'test' ;
        graphStub.restore();
    })
});
