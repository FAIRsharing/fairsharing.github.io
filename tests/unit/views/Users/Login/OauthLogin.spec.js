import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import Vuex from "vuex";

import Client from "@/lib/Client/RESTClient.js";
import usersStore from "@/store/users.js";
import OauthLogin from "@/views/Users/Login/OauthLogin.vue";

const $store = new Vuex.Store({
  modules: {
    users: usersStore,
  },
});
let $route = {
  fullPath: "/login_success?jwt=123&expiry=456",
  name: "OAuth Login",
  path: "/login_success",
  query: {
    jwt: 123,
    expiry: 456,
  },
};

const $router = {
  push: vi.fn(),
};

describe("Login.vue", () => {
  let wrapper;
  let restStub;

  const mountComponent = async () => {
    wrapper = await shallowMount(OauthLogin, {
      mocks: { $store, $route, $router },
    });
  };

  beforeAll(() => {
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({
      data: {
        username: "Terazus",
      },
    });
  });
  afterAll(() => {
    restStub.restore();
  });
  beforeEach(() => {
    $router.push.mockClear();
    $route = {
      fullPath: "/login_success?jwt=123&expiry=456",
      name: "OAuth Login",
      path: "/login_success",
      query: {
        jwt: 123,
        expiry: 456,
      },
    };
  });

  it("can instantiate", async () => {
    await mountComponent();
    const title = "OauthLogin";
    expect(wrapper.vm.$options.name).toMatch(title);
  });

  it("can process empty query params", async () => {
    $route = {
      fullPath: "/login_success",
      name: "OAuth Login",
      path: "/login_success",
      query: {},
    };
    await mountComponent();
    expect(wrapper.vm.messages().login.message).toBe("Missing token or expiry");
    expect(wrapper.vm.messages().login.error).toBe(true);
  });

  it("can process missing token error", async () => {
    $route = {
      fullPath: "/login_success?jwt=123",
      name: "OAuth Login",
      path: "/login_success",
      query: {
        jwt: 123,
      },
    };
    await mountComponent();
    expect(wrapper.vm.messages().login.message).toBe("Missing token or expiry");
    expect(wrapper.vm.messages().login.error).toBe(true);
  });

  it("can process missing jwt error", async () => {
    $route = {
      fullPath: "/login_success?expiry=456",
      name: "OAuth Login",
      path: "/login_success",
      query: {
        expiry: 456,
      },
    };
    await mountComponent();
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
        return_to: "/exciting/page",
      },
    };
    await mountComponent();
    await wrapper.vm.login();
    expect($router.push).toHaveBeenCalledWith({ path: "/exciting/page" });
  });

  it("uses the default redirect path when return_to is missing", async () => {
    await mountComponent();
    await wrapper.vm.login();
    expect($router.push).toHaveBeenCalledWith({ path: "accounts/profile" });
  });

  it("passes jwt and expiry to oauthLogin", async () => {
    await mountComponent();
    wrapper.vm.oauthLogin = vi.fn().mockResolvedValue();
    await wrapper.vm.login();
    expect(wrapper.vm.oauthLogin).toHaveBeenCalledWith({
      jwt: 123,
      expiry: 456,
    });
  });
});
