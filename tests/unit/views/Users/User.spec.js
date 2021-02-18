import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex"
import sinon from "sinon"
import { RouterLinkStub } from '@vue/test-utils';
import User from "@/views/Users/User.vue"
import Client from "@/components/Client/RESTClient.js"
import ExternalClient from "@/components/Client/ExternalClients.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import usersStore from "@/store/users";
import editorStore from "@/store/editor";


const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore,
        editor: editorStore
    },
});
let $route = { path: "/accounts/profile"};
const router = new VueRouter();
const $router = { push: jest.fn() };

describe("User.vue", () => {

    let wrapper;
    let restStub;
    let graphStub;
    let externalClientStub;

    beforeAll( () => {
        restStub = sinon.stub(Client.prototype, "executeQuery").returns({
            data: {id: "12345", name: "Terazus", orcid: '123'}
        });
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
           user: {
               maintenanceRequests: [
                   {
                       fairsharingRecord: {
                           name: "recordTest",
                           type: ""
                       }
                   }
               ],
               maintainedRecords: [],
               createdRecords: [],
               watchedRecords: []
           }
       });
        externalClientStub = sinon.stub(ExternalClient.prototype, "executeQuery").returns({
            data: { 'activities-summary': { works: { group: [
                {'work-summary': [{title: {title: {value: "abc"}}}] }
            ]}}}
        });
    });

    afterAll(() => {
        restStub.restore();
        graphStub.restore();
        externalClientStub.restore();
    });

    it("can be instantiated", () => {
        wrapper = shallowMount(User, {
            localVue,
            router,
            mocks: {$store, $router},
            stubs: {RouterLink: RouterLinkStub}
        });
        const title = "User";
        expect(wrapper.name()).toMatch(title);
        expect(wrapper.vm.booleanToString(true)).toBe("Yes");
        expect(wrapper.vm.booleanToString(false)).toBe("No");
        wrapper.vm.user().records = null;
        expect(wrapper.vm.maintenanceRequests.length).toBe(0)
    });

    it("can process errors", () => {
        restStub.restore();
        restStub = sinon.stub(Client.prototype, "executeQuery").returns({
            data: {error: "error"}
        });
        wrapper = shallowMount(User, {
            localVue,
            router,
            mocks: {$store, $router, $route},
            stubs: {RouterLink: RouterLinkStub}
        });
    })

});
