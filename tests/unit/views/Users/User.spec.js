import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex"
import sinon from "sinon"
import User from "@/views/Users/User.vue"
import Client from "@/components/Client/RESTClient.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import usersStore from "@/store/users";

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore
    },
});
const router = new VueRouter();

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
            mocks: {$store}
        });
        const title = "User";
        expect(wrapper.name()).toMatch(title);
    });

    it("has a getRecords methods that sorts the records for easy use", () => {
        wrapper = shallowMount(User, {
            localVue,
            router,
            mocks: {$store}
        });
        let records = wrapper.vm.getRecords('maintenanceRequests');
        expect(records).toStrictEqual([{name: "recordTest"}])
    });

    it("can process errors", () => {
        restStub.restore();
        restStub = sinon.stub(Client.prototype, "executeQuery").returns({
            data: {error: "error"}
        });
        wrapper = shallowMount(User, {
            localVue,
            router,
            mocks: {$store}
        });
        console.log($store.state.users.messages().login);
    })

});
