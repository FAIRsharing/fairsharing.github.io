import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex"
import sinon from "sinon"
import User from "@/views/Users/User.vue"
import Client from "@/components/Client/RESTClient.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import usersStore from "@/store/users";

const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore
    },
});
const router = new VueRouter();
const $router = { push: jest.fn() };

describe("User.vue", () => {

    let wrapper;
    let restStub;
    let graphStub;

    beforeAll( () => {
       restStub = sinon.stub(Client.prototype, "executeQuery").returns({
           data: {id: "12345", name: "Terazus"}
       });
       graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
           user: {
               maintenanceRequests: [
                   {
                       fairsharingRecord: {
                           name: "recordTest"
                       }
                   }
               ],
               maintainedRecords: [
                   {
                       name: "anotherRecord"
                   }
               ]
           }
       })
    });

    afterAll(() => {
        restStub.restore();
        graphStub.restore();
    });

    it("can be instantiated", () => {
        wrapper = shallowMount(User, {
            localVue,
            router,
            mocks: {$store, $router}
        });
        const title = "User";
        expect(wrapper.name()).toMatch(title);
    });

    it("can process errors", () => {
        restStub.restore();
        restStub = sinon.stub(Client.prototype, "executeQuery").returns({
            data: {error: "error"}
        });
        wrapper = shallowMount(User, {
            localVue,
            router,
            mocks: {$store, $router}
        });
    })

});
