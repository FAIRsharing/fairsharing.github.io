import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import editLicences from "@/components/Editor/EditLicences.vue"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";
import GraphClient from "@/components/GraphClient/GraphClient.js";
import RestClient from "../../../../src/components/Client/RESTClient.js"
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

recordStore.state.currentRecord = {
    fairsharingRecord: {
        licenceLinks: [
            {
                relation: "name",
                fairsharing_record_id: 1,
                licence: {
                    id: 2
                },
                licence_attributes: {
                    name: "",
                    url: ""
                }
            },
            {
                name: "name1",
                id: 1,
                licence_attributes: {
                    name: "",
                    url: ""
                }
            },

        ]
    }
};
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

describe("EditLicences.vue", function() {
    let wrapper;

    beforeEach(() => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            searchLicences: []
        });
        wrapper = shallowMount(editLicences, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    });

    afterEach( () => {
        graphStub.restore();
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("EditLicences");
    });

    it('can add/remove licence links to the component', () => {
        wrapper.vm.addLicence();
        expect(wrapper.vm.currentLicences[2]).toStrictEqual({
            fairsharing_record_id: 123,
            licence: {
                name: "",
                id: ""
            },
            relation: "",
            licence_attributes: {
                name: "",
                url: ""
            }
        });
        expect(wrapper.vm.currentLicences.length).toBe(3);
        wrapper.vm.removeLicence(2);
        expect(wrapper.vm.currentLicences.length).toBe(2);
        wrapper.vm.removeLicence(1);
        expect(wrapper.vm.removedLicences[0]).toBe(1);
    });

    it('can create a new licence link to the database', async () => {
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {
                id: 123
            }
        });
        await wrapper.vm.createLicences();
        expect(wrapper.vm.errors.length).toBe(0);
        restStub.restore();
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {
                error: new Error("Im an error")
            }
        });
        await wrapper.vm.createLicences();
        expect(wrapper.vm.errors.length).toBe(1);
        restStub.restore();
    });

    it('can delete an existing licence link from the database', async () => {
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {
                id: 123
            }
        });
        wrapper.vm.removedLicences = [1];
        await wrapper.vm.deleteLicences();
        expect(wrapper.vm.errors.length).toBe(0);
        restStub.restore();
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {
                error: new Error("Im an error")
            }
        });
        await wrapper.vm.deleteLicences();
        expect(wrapper.vm.errors.length).toBe(1);
        restStub.restore();
    });

    it('can update an existing licence link from the database', async () => {
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {
                id: 123
            }
        });
        wrapper.vm.currentLicences = [
            {
                relation: "name",
                fairsharingRecord: {
                    id: 1
                },
                licence: {
                    id: 2
                },
                licence_attributes: {
                    name: "",
                    url: ""
                }
            }
        ] ;
        await wrapper.vm.updateLicences();
        expect(wrapper.vm.errors.length).toBe(0);
        restStub.restore();
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {
                error: new Error("Im an error")
            }
        });
        await wrapper.vm.updateLicences();
        expect(wrapper.vm.errors.length).toBe(1);
        restStub.restore();
    });

    it("can react to errors", async () => {
        let returnedData = {
            error: new Error("Im an error")
        };
        let createStub = sinon.stub(RestClient.prototype, "createLicenceLink");
        createStub.returns(returnedData);
        let deleteStub = sinon.stub(RestClient.prototype, "deleteLicenceLink");
        deleteStub.returns(returnedData);
        let updateStub = sinon.stub(RestClient.prototype, "updateLicenceLink");
        updateStub.returns(returnedData);


        await wrapper.vm.updateRecord();
        expect($router.push).toHaveBeenCalledTimes(0);
        createStub.restore();
        deleteStub.restore();
        updateStub.restore();
    });

    it("can update the record", async () => {

        let returnedData = {
            data: {
                id: 123
            }
        };
        let createStub = sinon.stub(RestClient.prototype, "createLicenceLink");
        createStub.returns(returnedData);
        let deleteStub = sinon.stub(RestClient.prototype, "deleteLicenceLink");
        deleteStub.returns(returnedData);
        let updateStub = sinon.stub(RestClient.prototype, "updateLicenceLink");
        updateStub.returns(returnedData);


        await wrapper.vm.updateRecord();
        expect($router.push).toHaveBeenCalledTimes(1);
        createStub.restore();
        deleteStub.restore();
        updateStub.restore();
    })

});
