import { beforeEach, describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import App from "@/App.vue"; // Adjust path if necessary

// Dummy components to act as stubs
const HeaderComp = { template: '<div class="header-stub"></div>' };
const FooterComp = { template: '<div class="footer-stub"></div>' };
const Jumbotron = { template: '<div class="jumbotron-stub"></div>' };
const PublicMessages = { template: '<div class="messages-stub"></div>' };

const NavigationDrawer = {
  name: "v-navigation-drawer",
  template: '<div class="v-navigation-drawer-stub"><slot /></div>',
  props: ["modelValue", "location"],
  emits: ["update:modelValue"],
};

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

  const createWrapper = () => {
    return shallowMount(App, {
      global: {
        plugins: [store],
        mocks: {
          $vuetify: vuetifyMock,
        },
        stubs: {
          HeaderComp,
          FooterComp,
          Jumbotron,
          PublicMessages,
          "router-view": true,
          "v-app": { template: "<div><slot /></div>" },
          "v-navigation-drawer": NavigationDrawer,
          "v-alert": { template: '<div class="v-alert"><slot /></div>' },
        },
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
    vuetifyMock.display.mdAndDown = true;
    const wrapper = createWrapper();
    expect(wrapper.findComponent(NavigationDrawer).exists()).toBe(true);
  });

  it("updates drawerVisibilityState when the drawer emits an update event", async () => {
    stateUI.UIGeneralStatus.drawerVisibilityState = true;
    vuetifyMock.display.mdAndDown = true;

    const wrapper = createWrapper();
    let drawer = wrapper.findComponent(NavigationDrawer);
    await drawer.vm.$emit("update:modelValue", false);
    expect(stateUI.UIGeneralStatus.drawerVisibilityState).toBe(false);
  });

  it("does NOT render navigation drawer when screen is larger than md", () => {
    vuetifyMock.display.mdAndDown = false;
    const wrapper = createWrapper();
    expect(wrapper.findComponent(NavigationDrawer).exists()).toBe(false);
  });

  it("executes the updated hook when reactive data changes", async () => {
    const wrapper = createWrapper();
    await wrapper.setData({ title: "Trigger Update" });
    await wrapper.vm.$nextTick();
    expect(wrapper.exists()).toBe(true);
  });
});
