import { createLocalVue,shallowMount } from "@vue/test-utils"
import sinon from "sinon"
import VueRouter from "vue-router"
import Vuex from "vuex"

import Client from "@/lib/Client/RESTClient.js"
import usersStore from "@/store/users.js";
import OauthLogin from "@/views/Users/Login/OauthLogin.vue"

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
            id: 42,
            expiry: 456,
        }});
    });
    afterAll(() => {
        restStub.restore();
    });
    beforeEach(() => {
        $route = {
            fullPath: "/login_success?jwt=123&expiry=456",
            name: "OAuth Login",
            path: "/login_success",
            query: {
                jwt: 123,
                expiry: 456
            }
        };
        $router.push.mockClear();
    });

    it("can instantiate", async () => {
        wrapper = await shallowMount(OauthLogin, {
            localVue,
            router,
            mocks: {$store, $route, $router}
        });
        const title = "OauthLogin";
        expect(wrapper.vm.$options.name).toMatch(title);
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

    it("can process missing jwt error", async () =>{
        $route = {
            fullPath: "/login_success?expiry=456",
            name: "OAuth Login",
            path: "/login_success",
            query: {
                expiry: 456
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

    it("can process empty params error", async () =>{
        $route = {
            fullPath: "/login_success",
            name: "OAuth Login",
            path: "/login_success",
            query: {}
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

    it("uses default redirect path and dispatches oauth payload", async () => {
        $route = {
            fullPath: "/login_success?jwt=987&expiry=654",
            name: "OAuth Login",
            path: "/login_success",
            query: {
                jwt: 987,
                expiry: 654
            }
        };
        const dispatchSpy = jest.spyOn($store, "dispatch");
        wrapper = await shallowMount(OauthLogin, {
            localVue,
            router,
            mocks: {$store, $route, $router}
        });
        await wrapper.vm.login();

        expect(dispatchSpy).toHaveBeenCalledWith("users/oauthLogin", { jwt: 987, expiry: 654 });
        expect($router.push).toHaveBeenCalledWith({path: "accounts/profile"});
        dispatchSpy.mockRestore();
    });
});
