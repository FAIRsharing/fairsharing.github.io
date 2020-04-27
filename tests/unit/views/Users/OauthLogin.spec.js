import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import sinon from "sinon"
import OauthLogin from "@/views/Users/Login/OauthLogin.vue"
import Client from "@/components/Client/RESTClient.js"
import usersStore from "@/store/users.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore
    },
});
let $route = {
    name: "GitHub Login",
    fullPath: "/users/auth/github/callback?code=123&state=456",
    path: "/users/auth/github/callback"
};

describe("Login.vue", ()=> {

    let wrapper;
    let restStub;

    beforeAll( () => {
        restStub = sinon.stub(Client.prototype, "executeQuery");
        restStub.returns({
            username: "Terazus"
        });
    });
    afterAll(() => {
        restStub.restore();
    });
    beforeEach( async () => {
        wrapper = await shallowMount(OauthLogin, {
            localVue,
            mocks: {$store, $route}
        });
    });

    it("can instantiate", () => {
        const title = "OauthLogin";
        expect(wrapper.name()).toMatch(title);
        expect(wrapper.vm.user).toStrictEqual({username: "Terazus"})
    });
});
