import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import Vuex from "vuex";

import usersStore from "@/store/users.js";
import LoginFailure from "@/views/Users/Login/LoginFailure.vue";

const vuetify = new Vuetify();

const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store({
  modules: {
    users: usersStore,
  },
});
let $route = {
  fullPath: "/login_failure",
  name: "OAuth Failure",
  path: "/login_failure",
  query: {
    errors:
      '{ "message": {"user":{"email":["can\'t be blank","is invalid"],"username":["can\'t be blank"]},"login":{}}, "error": true }',
  },
};
const router = new VueRouter();
const $router = {
  push: jest.fn(),
};

describe("Login.vue", () => {
  let wrapper;

  it("can instantiate", async () => {
    wrapper = await shallowMount(LoginFailure, {
      localVue,
      router,
      vuetify,
      mocks: { $store, $route, $router },
    });
    const title = "LoginFailure";
    expect(wrapper.vm.$options.name).toMatch(title);
  });
});
