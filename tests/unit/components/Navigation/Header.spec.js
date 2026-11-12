import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cloneDeep } from "lodash-es";
import { reactive } from "vue";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { isEqual } from "lodash-es";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Header from "@/components/Navigation/Header.vue";
import RESTClient from "@/lib/Client/RESTClient.js";
import uiControllerStore from "@/store/uiController.js";
import usersStore from "@/store/users.js";
import {
  VSlotStub,
  VBtnStub,
  VMenuStub,
  VIconStub,
  VRouterLinkStub,
} from "../../../stubs/index.js";
const initialUI = cloneDeep(uiControllerStore.state);
const initialUsers = cloneDeep(usersStore.state);

const routerPush = vi.fn();

const vuetify = createVuetify();

const $route = reactive({
  name: "Standards",
  query: { fairsharingRegistry: "Standard" },
});

const $store = new Vuex.Store({
  modules: {
    uiController: uiControllerStore,
    users: usersStore,
  },
});

describe("Header.vue", function () {
  let wrapper;

  let originalUser;
  let wrappers;
  const mountOptions = {
    global: {
      plugins: [vuetify, $store],
      mocks: { $route, $router: { push: routerPush } },
      stubs: {
        VAppBar: VSlotStub,
        VAppBarNavIcon: VBtnStub,
        VBtn: VBtnStub,
        VMenu: VMenuStub,
        VIcon: VIconStub,
        "router-link": VRouterLinkStub,
      },
    },
  };
  beforeEach(async () => {
    wrappers = [];
    originalUser = localStorage.getItem("user");
    Object.assign($store.state.uiController, cloneDeep(initialUI));
    Object.assign($store.state.users, cloneDeep(initialUsers));
    $route.name = "Standards";
    $route.query = { fairsharingRegistry: "Standard" };
    routerPush.mockClear();
    vi.spyOn(RESTClient.prototype, "logout").mockResolvedValue({
      error: false,
    });
    vi.stubGlobal("innerWidth", 1280);
    vuetify.display.update();
    wrapper = shallowMount(Header, mountOptions);
    wrappers.push(wrapper);
    await wrapper.vm.$nextTick();
  });
  afterEach(() => {
    wrappers.forEach((w) => w.unmount());
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    if (originalUser === null) localStorage.removeItem("user");
    else localStorage.setItem("user", originalUser);
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Header");
  });

  it("can update the uiController store's UIGeneralStatus state", () => {
    const expectedData = {
      headerVisibilityState: true,
      drawerVisibilityState: true,
    };
    wrapper.vm.toggleDrawerLeft();
    expect($store.state.uiController.UIGeneralStatus).toStrictEqual(
      expectedData,
    );
  });

  it("sets the closePopup value", () => {
    expect(wrapper.vm.closeMenuStatus).toStrictEqual(false);
    let status = false;
    wrapper.vm.closePopup(status);
    expect(wrapper.vm.closeMenuStatus).toStrictEqual(status);
    status = true;
    wrapper.vm.closePopup(status);
    expect(wrapper.vm.closeMenuStatus).toStrictEqual(status);
  });

  it("toggle button activeness using route changes", () => {
    wrapper.vm.$route.query = {};
    wrapper.vm.$route.name = "Statistics";
    wrapper.vm.setCurrentActiveButton("Statistics");
    const selectedItem = wrapper.vm.links.find(
      (item) => item.name === "Statistics",
    );
    // expect selectedItem to be true
    expect(selectedItem.active).toBe(true);
    // expect all other items to be false when one is selected
    wrapper.vm.links.forEach((item) => {
      if (!isEqual(item, selectedItem)) {
        expect(item.active).toBe(false);
      }
    });
  });

  it("logs out and redirects to Login", async () => {
    const push = vi.fn();
    const logoutSpy = vi
      .spyOn(RESTClient.prototype, "logout")
      .mockResolvedValue({ error: false });

    const localWrapper = shallowMount(Header, {
      ...mountOptions,
      global: { ...mountOptions.global, mocks: { $route, $router: { push } } },
    });
    wrappers.push(localWrapper);

    await localWrapper.vm.logoutUser();

    expect(push).toHaveBeenCalledWith({ name: "Login" });
    logoutSpy.mockRestore();
  });

  it("renders the logo, search and all navigation links", () => {
    expect(wrapper.find('a[href="/"] img').attributes("alt")).toBe(
      "FAIRsharing logo",
    );
    expect(
      wrapper.findComponent({ name: "StringSearch" }).attributes("placeholder"),
    ).toBe("Search through all content");
    expect(
      wrapper.findAll("button.menuLinks").map((b) => b.attributes("to")),
    ).toEqual(wrapper.vm.links.map((l) => l.link));
    expect(wrapper.find('a[href="/"]').attributes("active-class")).toBe(
      "router-link-active",
    );
  });

  it("toggles the drawer in both directions through the navigation icon", async () => {
    const icon = wrapper.find("button.d-block");
    await icon.trigger("click");
    expect(
      $store.state.uiController.UIGeneralStatus.drawerVisibilityState,
    ).toBe(true);
    await icon.trigger("click");
    expect(
      $store.state.uiController.UIGeneralStatus.drawerVisibilityState,
    ).toBe(false);
    expect(
      $store.state.uiController.UIGeneralStatus.headerVisibilityState,
    ).toBe(true);
  });

  it("opens login and consumes its close-popup event", async () => {
    await wrapper.setData({ closeMenuStatus: true });
    await wrapper
      .findAll("button")
      .find((b) => b.text().includes("Login"))
      .trigger("click");
    expect(wrapper.vm.closeMenuStatus).toBe(false);
    const login = wrapper.findComponent({ name: "Login" });
    expect(login.props()).toMatchObject({ popUp: true, redirect: false });
    login.vm.$emit("ClosePopup", true);
    await wrapper.vm.$nextTick();
    expect(
      wrapper.findComponent(VMenuStub).attributes("close-on-content-click"),
    ).toBe("true");
  });

  it("renders the logged-in user and logs out through the power icon", async () => {
    $store.state.users.user = () => ({
      isLoggedIn: true,
      credentials: { token: "token", username: "Example user" },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[to="/accounts/profile"]').text()).toContain(
      "Example user",
    );
    expect(wrapper.findComponent({ name: "Login" }).exists()).toBe(false);
    await wrapper.find('[icon="fas fa-power-off"]').trigger("click");
    await flushPromises();
    expect(RESTClient.prototype.logout).toHaveBeenCalledWith("token");
    expect(routerPush).toHaveBeenCalledWith({ name: "Login" });
  });

  it("updates active navigation from reactive query changes and route-name fallback", async () => {
    $route.query.fairsharingRegistry = "Database";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.links.filter((l) => l.active).map((l) => l.name)).toEqual(
      ["Database"],
    );
    expect(
      wrapper
        .findAll("button.menuLinks")
        .find((b) => b.attributes("to") === "/databases")
        .attributes("variant"),
    ).toBe("elevated");
    $route.query = {};
    $route.name = "Statistics";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.currentParameter).toEqual({
      fairsharingRegistry: "Statistics",
    });
    expect(wrapper.vm.links.filter((l) => l.active).map((l) => l.name)).toEqual(
      ["Statistics"],
    );
    $route.name = "Unknown";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.links.every((l) => !l.active)).toBe(true);
  });

  it("renders a disabled login placeholder before mounting completes", async () => {
    await wrapper.setData({ isMounted: false });
    expect(wrapper.find(".navSecond").exists()).toBe(false);
    expect(
      wrapper
        .findAll("button")
        .find((b) => b.text().includes("Login"))
        .attributes("disabled"),
    ).toBeDefined();
    expect(wrapper.findComponent({ name: "Login" }).exists()).toBe(false);
    expect(wrapper.find('a[href="/"]').attributes("active-class")).toBe("");
    expect(wrapper.find('a[href="/"]').attributes("exact-active-class")).toBe(
      "",
    );
  });

  it("uses larger navigation buttons on extra-large screens", async () => {
    vi.stubGlobal("innerWidth", 2000);
    vuetify.display.update();
    await wrapper.vm.$nextTick();
    expect(wrapper.find("button.menuLinks").attributes("size")).toBe("x-large");
  });
});
