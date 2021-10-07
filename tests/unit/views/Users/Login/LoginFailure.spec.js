import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import VueRouter from "vue-router"
import LoginFailure from "@/views/Users/Login/LoginFailure.vue"
import usersStore from "@/store/users.js";
import Vuetify from "vuetify"

const vuetify = new Vuetify();

const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore
    },
});
let $route = {
    fullPath: "/login_failure",
    name: "OAuth Failure",
    path: "/login_failure",
    query: {
        errors:  '{ "message": {"user":{"email":["cant be blank","is invalid"],"username":["cant be blank"]},"login":{}}, "error": true }'
    }

};
const router = new VueRouter();
const $router = {
    push: jest.fn()
};

describe("Login.vue", ()=> {

    let wrapper;

    it("can instantiate", async () => {
        wrapper = await shallowMount(LoginFailure, {
            localVue,
            router,
            vuetify,
            mocks: {$store, $route, $router}
        });
        const title = "LoginFailure";
        expect(wrapper.name()).toMatch(title);
    });

});
