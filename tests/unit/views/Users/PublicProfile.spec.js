import {shallowMount, createLocalVue, RouterLinkStub} from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex"
import sinon from "sinon"
import PublicProfile from "@/views/Users/PublicProfile"
import Client from "@/components/Client/RESTClient.js"
import ExternalClient from "@/components/Client/ExternalClients.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import usersStore from "@/store/users";
import editorStore from "@/store/editor";
import ORCIDfixture from "@/../tests/fixtures/ORCIDpub.json"
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
    params: { id: "12345" }
};

const router = new VueRouter();
const $router = { push: jest.fn() };

describe("PublicProfile.vue", () => {

    let wrapper;
    let restStub;
    let graphStub;
    let externalClientStub;

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
    });

    afterAll(() => {
        restStub.restore();
        graphStub.restore();
        externalClientStub.restore();
    });

    it("can be instantiated", () => {
        const title = "PublicProfile";
        expect(wrapper.name()).toMatch(title);
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
        expect(pubs.length).toEqual(0);
    });

    it("doesn't look for publications if the user doesn't load", async () => {
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
        jest.spyOn(wrapper.vm.methods, "getPublications");
        expect(wrapper.vm.publications).toStrictEqual([]);
        expect(wrapper.vm.getPublications()).not.toHaveBeenCalled();
    });

});
