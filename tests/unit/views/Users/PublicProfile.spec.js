import {createLocalVue, RouterLinkStub,shallowMount} from "@vue/test-utils"
import sinon from "sinon"
import VueRouter from "vue-router"
import Vuex from "vuex"

import ORCIDfixture from "@/../tests/fixtures/ORCIDpub.json"
import ExternalClient from "@/lib/Client/ExternalClients.js"
import Client from "@/lib/Client/RESTClient.js"
import GraphClient from "@/lib/GraphClient/GraphClient.js"
import editorStore from "@/store/editor";
import usersStore from "@/store/users";
import PublicProfile from "@/views/Users/PublicProfile"
import User from "@/views/Users/User";


const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore,
        editor: editorStore
    },
});
let $route = {
    path: "/users/12345",
    params: { id: 12345 }
};

const router = new VueRouter();
const $router = { push: jest.fn() };

describe("PublicProfile.vue", () => {

    let wrapper;
    let restStub;
    let graphStub;
    let externalClientStub;
    let getpubs;

    beforeAll( () => {
        restStub = sinon.stub(Client.prototype, "executeQuery").returns({
            data: {id: "12345", name: "mrgoatse", orcid: '123'}
        });
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
           user: {
               email:"mrg@goatse.cx",
               firstName: "Mr.",
               lastName: "Goatse",
               homepage: "http://goatse.cx",
               orcid: "1234-5678-9012-3456",
               username: "goatse",
               twitter: "goatse",
               maintainedRecords: [],
           }
       });
       externalClientStub = sinon.stub(ExternalClient.prototype, "executeQuery").returns({data: ORCIDfixture});
       wrapper = shallowMount(PublicProfile, {
            localVue,
            router,
            mocks: {$store, $router, $route},
        });
        getpubs = jest.spyOn(wrapper.vm, "getPublications");
    });

    afterAll(() => {
        restStub.restore();
        graphStub.restore();
        externalClientStub.restore();
    });

    it("can be instantiated", () => {
        const title = "PublicProfile";
        expect(wrapper.vm.$options.name).toMatch(title);
        expect(wrapper.vm.publications.length).toBeGreaterThan(0);
        expect(getpubs).toHaveBeenCalledTimes(1);
    });


    it("has correct public user metadata", () => {
        expect(wrapper.vm.getPublicUserMeta.lastName).toEqual("Goatse");
        expect(wrapper.vm.getPublicUserMeta.maintainedRecords).toBe(undefined);
    });

    it("does not return publications if no orcid", async () => {
        let pubs = await wrapper.vm.getPublications();
        expect(pubs.length).toBeGreaterThan(0);
        wrapper.vm.userData.user.orcid = null;
        pubs = await wrapper.vm.getPublications();
        expect(getpubs).toHaveBeenCalledTimes(3);
        expect(pubs.length).toEqual(0);
    });

    it("doesn't look for publications if the user doesn't load", async () => {
        graphStub.restore();
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
            user: {orcid: "123456"}
        });
        wrapper = shallowMount(PublicProfile, {
            localVue,
            router,
            mocks: {$store, $router, $route},
            stubs: {RouterLink: RouterLinkStub}
        });
        expect(getpubs).toHaveBeenCalledTimes(3);
        graphStub.restore();
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
            error: "error"
        });
        wrapper = shallowMount(PublicProfile, {
            localVue,
            router,
            mocks: {$store, $router, $route},
            stubs: {RouterLink: RouterLinkStub}
        });
        //expect(wrapper.vm.publications).toStrictEqual([]);
        // This has already been called thrice; it shouldn't have been called again here.
        expect(getpubs).toHaveBeenCalledTimes(3);
    });

    it("handles publications errors", async() => {
        /*
         * TODO: This test does not address normal conditions, i.e. no error returned by the
         * TODO: external query. For unknown reasons publications are always [] even though
         * TODO: the Vue methods are getting data from the stub correctly.
         */
        externalClientStub.returns({data: {error: "error"}});
        let wrapper = await shallowMount(User, {
            localVue,
            router,
            mocks: {$store, $router, $route},
            stubs: {RouterLink: RouterLinkStub}
        });
        expect(wrapper.vm.publications).toStrictEqual([]);
    });

});
