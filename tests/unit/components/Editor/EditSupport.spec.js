import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import editSupport from "@/components/Editor/EditSupport.vue"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";
import RestClient from "@/components/Client/RESTClient.js";
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

recordStore.state.currentRecord = {
    fairsharingRecord: {
        metadata: {
            contacts: [
                {
                    contact_name: "Im a contact",
                    contact_email: "email@test.com",
                    contact_orcid: ""
                }
            ]
        }
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

let restStub;

describe("EditSupport.vue", function() {
    let wrapper;

    beforeEach( () => {
        wrapper = shallowMount(editSupport, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("EditSupport");
    });

    it("can add and remove new contact", () => {
        const contact = {
            contact_name: "",
            contact_email: "",
            contact_orcid: ""
        };
        wrapper.vm.addContact();
        expect(wrapper.vm.contacts[1]).toStrictEqual(contact);
        wrapper.vm.removeContact(contact);
        expect(wrapper.vm.contacts.length).toBe(1)
    });

    it("can post the new record", async() => {
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {data: { id: 123}}
        });
        const contact = {
            contact_name: "contact2",
            contact_email: "email@test.com",
            contact_orcid: "123"
        };
        wrapper.vm.contacts.push(contact);
        await wrapper.vm.editRecord();
        expect($router.push).toHaveBeenCalledWith({"path": "/123"});
        restStub.restore();
    });

    it("can handle errors", async() => {
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({data: {error: {
            response: {
                statusText: 123
            }
        }}});
        await wrapper.vm.editRecord();
        expect($router.push).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.error).toBe(123);
        restStub.restore();
    });

});
