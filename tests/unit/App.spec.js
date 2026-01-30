import { beforeEach, describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import App2 from "@/App.vue"; // Adjust path if necessary

// Dummy components to act as stubs
const HeaderComp = { template: '<div class="header-stub"></div>' };
const FooterComp = { template: '<div class="footer-stub"></div>' };
const Jumbotron = { template: '<div class="jumbotron-stub"></div>' };
const NavigationDrawer = { template: '<div class="nav-drawer-stub"></div>' };
const PublicMessages = { template: '<div class="messages-stub"></div>' };

describe("App.vue", () => {
  let store;
  let stateUI;
  let stateIntrospection;
  let vuetifyMock;

  beforeEach(() => {
    // 1. Setup Mock State
    stateUI = {
      UIGeneralStatus: {
        drawerVisibilityState: true,
      },
    };

    stateIntrospection = {
      readOnlyMode: false,
    };

    // 2. Create a fresh Mock Store for every test
    store = createStore({
      modules: {
        uiController: {
          namespaced: true,
          state: stateUI,
        },
        introspection: {
          namespaced: true,
          state: stateIntrospection,
        },
      },
    });

    // 3. Setup Vuetify Mock
    vuetifyMock = {
      display: {
        mdAndDown: false, // Default to desktop view
      },
    };
  });

  const createWrapper = (overrides = {}) => {
    return shallowMount(App2, {
      global: {
        plugins: [store],
        mocks: {
          $vuetify: vuetifyMock,
        },
        stubs: {
          HeaderComp,
          FooterComp,
          Jumbotron,
          NavigationDrawer,
          PublicMessages,
          "router-view": true,
          "v-app": { template: "<div><slot /></div>" },
          "v-navigation-drawer": { template: "<div><slot /></div>" },
          "v-alert": { template: '<div class="v-alert"><slot /></div>' },
        },
        ...overrides,
      },
    });
  };

  it("renders the core layout components always", () => {
    const wrapper = createWrapper();

    expect(wrapper.findComponent(HeaderComp).exists()).toBe(true);
    expect(wrapper.findComponent(Jumbotron).exists()).toBe(true);
    expect(wrapper.findComponent(PublicMessages).exists()).toBe(true);
    expect(wrapper.findComponent(FooterComp).exists()).toBe(true);
    expect(wrapper.find("router-view-stub").exists()).toBe(true);
  });

  it("shows the read-only alert when readOnlyMode is true", () => {
    // Update state for this specific test
    stateIntrospection.readOnlyMode = true;

    const wrapper = createWrapper();

    const alert = wrapper.find(".v-alert");
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toContain(
      "The site currently only allows viewing of records",
    );
  });

  it("does NOT show the read-only alert when readOnlyMode is false", () => {
    stateIntrospection.readOnlyMode = false;

    const wrapper = createWrapper();

    const alert = wrapper.find(".v-alert");
    expect(alert.exists()).toBe(false);
  });

  it("renders navigation drawer only when screen is mdAndDown", () => {
    // Mock mobile view
    vuetifyMock.display.mdAndDown = true;

    const wrapper = createWrapper();

    // Check if the drawer component is rendered
    expect(wrapper.findComponent(NavigationDrawer).exists()).toBe(true);
  });

  it("does NOT render navigation drawer when screen is larger than md", () => {
    // Mock desktop view
    vuetifyMock.display.mdAndDown = false;

    const wrapper = createWrapper();

    expect(wrapper.findComponent(NavigationDrawer).exists()).toBe(false);
  });
});
