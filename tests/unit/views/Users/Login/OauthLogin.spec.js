import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import VueRouter from "vue-router"
import sinon from "sinon"
import OauthLogin from "@/views/Users/Login/OauthLogin.vue"
import Client from "@/lib/Client/RESTClient.js"
import usersStore from "@/store/users.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore
    },
});
let $route = {
    fullPath: "/login_success?jwt=123&expiry=456",
    name: "OAuth Login",
    path: "/login_success",
    query: {
        jwt: 123,
        expiry: 456
    }

};
const router = new VueRouter();
const $router = {
    push: jest.fn()
};

describe("Login.vue", ()=> {

    let wrapper;
    let restStub;

    beforeAll( () => {
        restStub = sinon.stub(Client.prototype, "executeQuery");
        restStub.returns({data:{
            username: "Terazus",
        }});
    });
    afterAll(() => {
        restStub.restore();
    });

    it("can instantiate", async () => {
        wrapper = await shallowMount(OauthLogin, {
            localVue,
            router,
            mocks: {$store, $route, $router}
        });
        const title = "OauthLogin";
        expect(wrapper.name()).toMatch(title);
    });

    it("can process missing token error", async () =>{
        $route = {
            fullPath: "/login_success?jwt=123",
            name: "OAuth Login",
            path: "/login_success",
            query: {
                jwt: 123,
            }
        };
        wrapper = await shallowMount(OauthLogin, {
            localVue,
            router,
            mocks: {$store, $route, $router}
        });
        expect(wrapper.vm.messages().login.message).toBe("Missing token or expiry");
        expect(wrapper.vm.messages().login.error).toBe(true);

    });

    it("handles redirects after successful oauth authentication", async () => {
        $route = {
            fullPath: "/login_success?jwt=123&expiry=456",
            name: "OAuth Login",
            path: "/login_success",
            query: {
                jwt: 123,
                expiry: 456,
                return_to: '/exciting/page'
            }
        };
        wrapper = await shallowMount(OauthLogin, {
            localVue,
            router,
            mocks: {$store, $route, $router}
        });
        await wrapper.vm.login();
        expect($router.push).toHaveBeenCalledWith({path: "/exciting/page"});
    });
});
