import { createLocalVue,shallowMount } from "@vue/test-utils"
import { RouterLinkStub } from '@vue/test-utils';
import sinon from "sinon"
import VueRouter from "vue-router"
import Vuex from "vuex"

import ORCIDfixture from "@/../tests/fixtures/ORCIDpub.json"
import ExternalClient from "@/lib/Client/ExternalClients.js"
import Client from "@/lib/Client/RESTClient.js"
import GraphClient from "@/lib/GraphClient/GraphClient.js"
import editorStore from "@/store/editor";
import usersStore from "@/store/users";
import User from "@/views/Users/User.vue"


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
        externalClientStub = sinon.stub(ExternalClient.prototype, "executeQuery").returns({data: ORCIDfixture});
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
        expect(wrapper.vm.$options.name).toMatch(title);
        expect(wrapper.vm.booleanToString(true)).toBe("Yes");
        expect(wrapper.vm.booleanToString(false)).toBe("No");
        wrapper.vm.user().records = null;
        expect(wrapper.vm.maintenanceRequests.length).toBe(0);
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
    });

    it("can clean up store on destroy", () => {
        wrapper = shallowMount(User, {
            localVue,
            router,
            mocks: {$store, $router, $route},
            stubs: {RouterLink: RouterLinkStub}
        });
        wrapper.destroy();
        expect(usersStore.state.user().records).toStrictEqual({})
    })

    it("handles publications errors", async() => {
        /*
         * TODO: This test does not address normal conditions, i.e. no error returned by the
         * TODO: external query. For unknown reasons publications are always [] even though
         * TODO: the Vue methods are getting data from the stub correctly.
         */
        externalClientStub.returns({data: {error: "error"} });
        let wrapper = await shallowMount(User, {
            localVue,
            router,
            mocks: {$store, $router, $route},
            stubs: {RouterLink: RouterLinkStub}
        });
        expect(wrapper.vm.publications).toStrictEqual([]);
    });

    it("can copy url correctly", async () => {
        let wrapper = await shallowMount(User, {
            localVue,
            router,
            mocks: {$store, $router, $route},
            stubs: {RouterLink: RouterLinkStub}
        });
        wrapper.vm.copyURL()
        expect(wrapper.vm.copyButtonStatus).toBe(true);
    });

});
