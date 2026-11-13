import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { cloneDeep } from "lodash-es";
import { flushPromises, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import Client from "@/lib/Client/RESTClient.js";
import usersStore from "@/store/users.js";
import Login from "@/views/Users/Login/Login.vue";
import {
  VSlotStub,
  VFormStub,
  VTextFieldStub,
  VBtnStub,
  VIconStub,
  VRouterLinkStub,
} from "../../../../stubs/index.js";
const initialUsers = cloneDeep(usersStore.state);

const $store = new Vuex.Store({
  modules: {
    users: usersStore,
  },
});
let $route = {
  name: "Login",
  path: "/accounts/login",
  query: { goTo: "/123" },
};

const $router = {
  go: vi.fn(),
  push: vi.fn(),
  currentRoute: {
    path: "/accounts/login",
  },
};

describe("Login.vue", () => {
  let wrapper;
  let restStub;
  let wrappers;
  let originalStoredUser;
  const createWrapper = (props = {}) => {
    const mountedWrapper = shallowMount(Login, {
      props: { redirect: true, ...props },
      global: {
        plugins: [$store],
        mocks: { $route, $router },
        stubs: {
          VForm: VFormStub,
          VContainer: VSlotStub,
          VRow: VSlotStub,
          VCol: VSlotStub,
          VCard: VSlotStub,
          VCardTitle: VSlotStub,
          VCardText: VSlotStub,
          VCardActions: VSlotStub,
          VList: VSlotStub,
          VListItem: VSlotStub,
          VLayout: VSlotStub,
          VTextField: VTextFieldStub,
          VBtn: VBtnStub,
          VIcon: VIconStub,
          VDivider: true,
          "router-link": VRouterLinkStub,
          "router-view": true,
        },
      },
    });
    wrappers.push(mountedWrapper);
    return mountedWrapper;
  };

  beforeAll(() => {
    restStub = sinon.stub(Client.prototype, "executeQuery");
  });
  afterAll(() => {
    restStub.restore();
  });
  beforeEach(() => {
    wrappers = [];
    originalStoredUser = localStorage.getItem("user");
    Object.assign($store.state.users, cloneDeep(initialUsers));
    $route.path = "/accounts/login";
    $route.fullPath = "/accounts/login";
    $route.query = { goTo: "/123" };
    $router.push.mockClear();
    $router.go.mockClear();
    restStub.resetBehavior();
    restStub.resetHistory();
    restStub.returns({
      data: { id: 1, username: "Terazus", jwt: "test-token" },
    });
    vi.stubEnv("VITE_NODE_ENV", "local");
    vi.stubEnv("VITE_API_ENDPOINT", "https://api.example.org");
    wrapper = createWrapper();
  });

  afterEach(async () => {
    await flushPromises();
    wrappers.forEach((w) => w.unmount());
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    if (originalStoredUser === null) localStorage.removeItem("user");
    else localStorage.setItem("user", originalStoredUser);
  });

  it("can instantiate", () => {
    restStub.returns({
      data: {
        username: "Terazus",
      },
    });
    const title = "Login";
    expect(wrapper.vm.$options.name).toMatch(title);
  });

  it("can log users in", async () => {
    restStub.returns({
      data: {
        username: "Terazus",
      },
    });
    wrapper.vm.loginData = {
      name: "Terazus",
      password: "niceTry!Lolz",
    };
    await wrapper.vm.logUser();
    expect(wrapper.vm.$route.path).toBe("/accounts/login");

    $route.query = {};
    let anotherWrapper = createWrapper({ redirect: true });
    await anotherWrapper.vm.logUser();
    expect($router.push).toHaveBeenCalledWith({ path: "/accounts/profile" });
    $route.query = { goTo: "/123" };
  });

  it("can prevent users from logging in", async () => {
    restStub.returns({
      data: {
        error: {
          response: {
            data: {
              error:
                "You have to confirm your email address before continuing.",
            },
          },
        },
      },
    });
    wrapper.vm.loginData = {};
    expect(wrapper.vm.resendButton).toBe(false);
    await wrapper.vm.logUser();
    expect(wrapper.vm.messages().login).toStrictEqual({
      error: true,
      message: "You have to confirm your email address before continuing.",
    });
    expect(wrapper.vm.resendButton).toBe(true);
  });

  it("doesn't show resend button if the error isn't a confirmation error", async () => {
    restStub.returns({
      data: {
        error: {
          response: {
            data: {
              error: "sorry, you're out of luck this time",
            },
          },
        },
      },
    });
    wrapper.vm.loginData = {};
    expect(wrapper.vm.resendButton).toBe(false);
    await wrapper.vm.logUser();
    expect(wrapper.vm.messages().login).toStrictEqual({
      error: true,
      message: "sorry, you're out of luck this time",
    });
    expect(wrapper.vm.resendButton).toBe(false);
  });

  it("can process redirection", async () => {
    const anotherWrapper = createWrapper({ redirect: false });
    restStub.returns({
      data: {
        username: "Terazus",
      },
    });
    anotherWrapper.vm.loginData = {
      name: "Terazus",
      password: "niceTry!Lolz",
    };
    await anotherWrapper.vm.logUser();
    expect(anotherWrapper.vm.$route.path).toBe("/accounts/login");
  });

  it("can process special redirection", async () => {
    $route.query.redirect = true;
    let anotherWrapper = createWrapper({ redirect: false });
    restStub.returns({
      data: {
        username: "Terazus",
      },
    });
    anotherWrapper.vm.loginData = {
      name: "Terazus",
      password: "niceTry!Lolz",
    };
    await anotherWrapper.vm.logUser();
    expect(anotherWrapper.vm.$route.path).toBe("/accounts/login");
    expect($router.push).not.toHaveBeenCalled();
    expect(anotherWrapper.emitted("ClosePopup")).toEqual([[false]]);
  });

  it("generates correct oauth links", () => {
    expect(wrapper.vm.getCurrentLocation()).toEqual("?origin=%2F123");
    wrapper.vm.$route.query = {};
    expect(wrapper.vm.getCurrentLocation()).toEqual(
      "?origin=%2Faccounts%2Fprofile",
    );
  });

  it("logs in through the form models and LOGIN button", async () => {
    expect(
      wrapper.find("button.bg-primary").attributes("disabled"),
    ).toBeDefined();
    await wrapper.find('[aria-label="Username or email"]').setValue("Terazus");
    await wrapper.find('[aria-label="Password"]').setValue("secret-password");
    wrapper.findComponent(VFormStub).vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find("button.bg-primary").attributes("disabled"),
    ).toBeUndefined();
    await wrapper.find("button.bg-primary").trigger("click");
    await flushPromises();
    expect(restStub.firstCall.args[0].data).toEqual({
      user: { login: "Terazus", password: "secret-password" },
    });
    expect($store.state.users.user().isLoggedIn).toBe(true);
    expect($router.push).toHaveBeenCalledWith({ path: "/123" });
    expect(wrapper.emitted("ClosePopup")).toEqual([[false]]);
  });

  it.each(["Username or email", "Password"])(
    "submits login on Enter from the %s field",
    async (label) => {
      await wrapper
        .find(`[aria-label="${label}"]`)
        .trigger("keyup", { key: "Enter" });
      await flushPromises();
      expect(restStub.callCount).toBe(1);
      expect($router.push).toHaveBeenCalledWith({ path: "/123" });
    },
  );

  it("toggles password visibility and synchronizes the inner form model", async () => {
    const password = wrapper
      .findAllComponents(VTextFieldStub)
      .find((f) => f.props("label") === "Password");
    expect(password.attributes("type")).toBe("password");
    expect(password.attributes("append-inner-icon")).toBe("fas fa-eye-slash");
    password.vm.$emit("click:append-inner");
    await wrapper.vm.$nextTick();
    expect(password.attributes("type")).toBe("text");
    expect(password.attributes("append-inner-icon")).toBe("fas fa-eye");
    password.vm.$emit("click:append-inner");
    wrapper
      .findAllComponents(VFormStub)
      .at(1)
      .vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.show1).toBe(false);
    expect(wrapper.vm.formValid).toBe(true);
    expect(wrapper.vm.rules.isRequired()("")).toBe("Required");
    expect(wrapper.vm.rules.isRequired()("present")).toBe(true);
  });

  it("shows confirmation recovery after an API error and emits when clicked", async () => {
    restStub.returns({
      data: {
        error: {
          response: {
            data: {
              error:
                "You have to confirm your email address before continuing.",
            },
          },
        },
      },
    });
    await wrapper.vm.logUser();
    await wrapper.vm.$nextTick();
    const resend = wrapper.find('[href="/users/resendConfirmation"]');
    expect(resend.text()).toBe("Resend me the confirmation email");
    await resend.trigger("click");
    expect(wrapper.emitted("ClosePopup")).toEqual([[false], [true]]);
    expect($router.push).not.toHaveBeenCalled();
  });

  it("reports a rejected login request without redirecting", async () => {
    restStub.rejects(new Error("Login service unavailable"));
    await wrapper.vm.logUser();
    expect(wrapper.vm.messages().login).toEqual({
      error: true,
      message: "Login service unavailable",
    });
    expect(wrapper.vm.resendButton).toBe(false);
    expect($router.push).not.toHaveBeenCalled();
  });

  it.each([
    [
      "/search?q=cell&registry=database&",
      { path: "/search", query: { q: "cell", registry: "database" } },
    ],
    [
      "/advancedsearch?operator=AND&fields=%28operator%3DOR%26registry%3Ddatabase%2Bstandard%29",
      {
        path: "/advancedsearch",
        query: {
          operator: "AND",
          fields: "(operator=OR&registry=database+standard)",
        },
      },
    ],
  ])(
    "preserves query parameters when redirecting to %s",
    async (goTo, target) => {
      $route.query = { goTo };
      await wrapper.vm.logUser();
      expect($router.push).toHaveBeenCalledExactlyOnceWith(target);
    },
  );

  it.each(["production", "local", "development"])(
    "shows OAuth options only on supported endpoints: %s",
    async (environment) => {
      vi.stubEnv("VITE_NODE_ENV", environment);
      wrapper = createWrapper();
      expect(wrapper.vm.checkEndpoint()).toBe(environment !== "development");
      await wrapper.vm.$nextTick();
      const oauthButtons = wrapper.findAll("button[href*='/users/auth/']");
      expect(oauthButtons).toHaveLength(environment === "development" ? 0 : 2);
      if (environment !== "development") {
        expect(oauthButtons.map((b) => b.attributes("href"))).toEqual([
          "https://api.example.org/users/auth/orcid?origin=%2F123",
          "https://api.example.org/users/auth/github?origin=%2F123",
        ]);
      }
    },
  );

  it.each([null, 42, "", "https://example.org", "//example.org"])(
    "rejects non-local OAuth return paths: %j",
    (goTo) => {
      $route.query = { goTo };
      expect(wrapper.vm.isLocalPath(goTo)).toBe(false);
      expect(wrapper.vm.getCurrentLocation()).toBe(
        "?origin=%2Faccounts%2Fprofile",
      );
    },
  );

  it("uses the current local page as the OAuth origin for a popup login", async () => {
    $route.path = "/search";
    $route.fullPath = "/search?q=cell&registry=database";
    $route.query = {};
    await wrapper.setProps({ popUp: true, redirect: false });
    expect(wrapper.vm.getCurrentLocation()).toBe(
      "?origin=%2Fsearch%3Fq%3Dcell%26registry%3Ddatabase",
    );
    expect(wrapper.find('div[cols="12"]').attributes("lg")).toBe("12");
    expect(
      wrapper.find("h2").element.parentElement.classList.contains("py-0"),
    ).toBe(true);
    await wrapper.vm.logUser();
    expect($router.push).not.toHaveBeenCalled();
  });

  it("falls back to the profile when the current page is not a local path", () => {
    $route.path = "/search";
    $route.fullPath = "https://example.org";
    $route.query = {};
    expect(wrapper.vm.getCurrentLocation()).toBe(
      "?origin=%2Faccounts%2Fprofile",
    );
  });

  it.each([
    "/accounts/forgotPassword",
    "/accounts/signup",
    "https://fairsharing.gitbook.io/fairsharing/#accessing-fairsharing-through-3rd-party-accounts",
  ])("closes the popup when clicking the help link %s", async (href) => {
    const link = wrapper.find(`a[href="${href}"]`);
    link.element.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    await link.find("span").trigger("click");
    expect(wrapper.emitted("ClosePopup")).toEqual([[true]]);
  });

  it("hides the credential form when another panel is active", async () => {
    await wrapper.setData({ currentPanel: "Other panel" });
    expect(wrapper.find("h2").text()).toBe("Other panel");
    expect(wrapper.find('[aria-label="Password"]').exists()).toBe(false);
    expect(wrapper.find("button.bg-primary").exists()).toBe(false);
  });
});
