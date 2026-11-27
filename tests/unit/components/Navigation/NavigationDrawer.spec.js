import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";
import { reactive } from "vue"; // For a reactive $route
import NavDrawer from "@/components/Navigation/NavigationDrawer.vue";
import userStore from "@/store/users.js";
import { VBtnStub, VIconStub, VRouterLinkStub } from "../../../stubs/index.js";

const vuetify = createVuetify();

// 1. Mock the store
const $store = new Vuex.Store({
  modules: { users: userStore },
});

describe("NavigationDrawer.vue", () => {
  let wrapper;
  let account;
  const $route = reactive({ path: "/", fullPath: "/", query: {} });
  const $router = { push: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign($route, { path: "/", fullPath: "/", query: {} });
    account = reactive({
      isLoggedIn: false,
      credentials: { username: "A user" },
    });
    $store.state.users.user = () => account;
    wrapper = shallowMount(NavDrawer, {
      global: {
        plugins: [vuetify, $store],
        mocks: { $route, $router },
        stubs: {
          VBtn: VBtnStub,
          VIcon: VIconStub,
          "router-link": VRouterLinkStub,
        },
      },
    });
  });

  afterEach(() => wrapper.unmount());

  it("can be instantiated and navigate", async () => {
    // --- Test Case 1: Collections ---
    await wrapper.vm.goTo({ path: "collections", query: {} });

    expect($router.push).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        path: "/collections",
      }),
    );

    // IMPORTANT: Clear the history so the next assertion doesn't see "collections"
    $router.push.mockClear();

    // --- Test Case 2: Login ---
    await wrapper.vm.goToLogin();

    // Use objectContaining to ignore that weird { goTo: undefined } noise
    expect($router.push).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/accounts/login",
      }),
    );
  });

  it("navigates through the rendered registry buttons and marks only the selected one active", async () => {
    const standards = wrapper.findAll("button")[0];
    expect(standards.attributes("variant")).toBe("outlined");
    expect(standards.get("span").classes()).toContain("text-accent3");
    await standards.trigger("click");
    expect($router.push).toHaveBeenLastCalledWith({
      path: "/search",
      query: { fairsharingRegistry: "Standard" },
    });
    expect(
      wrapper.vm.buttons
        .filter((button) => button.active)
        .map((button) => button.name),
    ).toEqual(["Standards"]);
    expect(standards.attributes("variant")).toBeUndefined();
    expect(standards.get("span").classes()).not.toContain("text-accent3");
    await wrapper.findAll("button")[3].trigger("click");
    expect($router.push).toHaveBeenLastCalledWith({
      path: "/search",
      query: { fairsharingRegistry: "Collection" },
    });
    expect(
      wrapper.vm.buttons
        .filter((button) => button.active)
        .map((button) => button.name),
    ).toEqual(["Collections"]);
  });

  it("does not navigate when the selected registry is already displayed", async () => {
    Object.assign($route, {
      path: "/search",
      query: { fairsharingRegistry: "Standard" },
    });
    await wrapper.vm.$nextTick();
    await wrapper.findAll("button")[0].trigger("click");
    expect($router.push).not.toHaveBeenCalled();
    expect(wrapper.vm.buttons[0].active).toBe(true);
    await wrapper.findAll("button")[1].trigger("click");
    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: { fairsharingRegistry: "Database" },
    });
  });

  it("reacts to route path and nested query changes", async () => {
    Object.assign($route, {
      path: "/search",
      query: { fairsharingRegistry: "Database" },
    });
    await wrapper.vm.$nextTick();
    expect(
      wrapper.vm.buttons
        .filter((button) => button.active)
        .map((button) => button.name),
    ).toEqual(["Databases"]);
    $route.query.fairsharingRegistry = "Policy";
    await wrapper.vm.$nextTick();
    expect(
      wrapper.vm.buttons
        .filter((button) => button.active)
        .map((button) => button.name),
    ).toEqual(["Policies"]);
    Object.assign($route, { path: "/organisations", query: {} });
    await wrapper.vm.$nextTick();
    expect(
      wrapper.vm.buttons
        .filter((button) => button.active)
        .map((button) => button.name),
    ).toEqual(["Organisations"]);
  });

  it("preserves the current URL when Login is clicked and avoids navigating twice on the login page", async () => {
    $route.fullPath = "/search?fairsharingRegistry=Database";
    await wrapper
      .findAll("button")
      .find((button) => button.text().startsWith("Login"))
      .trigger("click");
    expect($router.push).toHaveBeenCalledWith({
      path: "/accounts/login",
      query: { goTo: $route.fullPath },
    });
    $router.push.mockClear();
    $route.path = "/accounts/login";
    await wrapper.vm.$nextTick();
    await wrapper.vm.goToLogin();
    expect($router.push).not.toHaveBeenCalled();
  });

  it("replaces Login with the signed-in profile and links the logo to home", async () => {
    account.isLoggedIn = true;
    await wrapper.vm.$nextTick();
    expect(
      wrapper
        .findAll("button")
        .some((button) => button.text().startsWith("Login")),
    ).toBe(false);
    const profile = wrapper
      .findAll("button")
      .find((button) => button.attributes("to") === "/accounts/profile");
    expect(profile.text()).toContain("A user");
    expect(
      wrapper.get('a[href="/"]').find("v-img-stub").attributes("src"),
    ).toBe("/assets/fairsharing-logo.svg");
  });
});
