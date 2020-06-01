import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import GraphClient from "@/components/GraphClient/GraphClient.js";
import RestClient from "@/components/Client/RESTClient.js";
import CreateRecord from "@/views/CreateRecord/NewRecord.vue"
import usersStore from "@/store/users.js";
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);

const $store = new Vuex.Store({modules: {users: usersStore}});
let $route = { name: "New_content", path: "/new" };
const router = new VueRouter();
const $router = { push: jest.fn() };

let restStub;
let graphStub;

describe("CreateRecord.vue", function() {
    let wrapper;
    let vuetify;

    beforeAll(() => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.withArgs(sinon.match.any).returns({
            fairsharingRegistries:{
                records: [
                    {
                        id: 1,
                        name: 'standard',
                        description: 'description',
                        recordTypes: [
                            {
                                id:3,
                                name:"model_and_format",
                                description:"A type of standard"
                            }
                        ]
                    },
                    {
                        id: 2,
                        name: 'Collection',
                        description: 'description',
                        recordTypes: [
                            {
                                id:2,
                                name:"collection",
                                description:"A type of standard"
                            }
                        ]
                    }
                ]
            }
        });
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
    });

    afterAll(() => {
        GraphClient.prototype.executeQuery.restore();
        RestClient.prototype.executeQuery.restore();
    });

    beforeEach(() => {
        vuetify = new Vuetify();
        wrapper = shallowMount(CreateRecord, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("NewRecordPage");
    });

    it("can reaction to setting type to collection", () => {
        wrapper.vm.record = {
            name: "test",
            recordType: {
                name: "notCollection"
            },
            recordStatus: {
                name:"ready"
            }
        };
        wrapper.vm.models.recordType = {
            name: "collection"
        };
        expect(wrapper.vm.models).toStrictEqual({
            recordType: {name: "collection"},
            recordStatus: null
        });
        wrapper.vm.models.recordStatus = {
            name: "ready"
        };
        wrapper.vm.models.recordType = {
            name: "NotCollection"
        };
        expect(wrapper.vm.models).toStrictEqual({
            recordType: {name: "NotCollection"},
            recordStatus:null
        })
    });

    it("can create records", async () => {
        wrapper.vm.record = {
            "metadata": {
                "name":"Cool test FS",
                "abbreviation":"CTF",
                "homepage":"http://example.com",
                "description":"test",
                "status":"ready"
            },
            "record_type_id": 3
        };
        wrapper.vm.models = {
            recordStatus: {
                name: "statusName"
            },
            recordType: {
                id: 1234
            }
        };
        restStub.returns({
            data: {
                data: {
                    id: 1234,
                    type: "fairsharing-records"
                }
            }
        });
        await wrapper.vm.createRecord();
        expect($router.push).toHaveBeenCalledWith({path: 1234});
        restStub.returns({
            data: {
                data: {}}
        });
        await wrapper.vm.createRecord();
        expect($router.push).toHaveBeenCalledTimes(1);
    });

});
