import { renderToString } from "@vue/server-renderer";
import { shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createSSRApp } from "vue";
import { createStore } from "vuex";

import Layout from "@/pages/+Layout.vue";
import introspection from "@/store/introspector.js";
import uiController from "@/store/uiController.js";
import { VSlotStub } from "../../stubs/index.js";

describe("+Layout.vue", () => {
  let wrapper;
  let store;

  beforeEach(async () => {
    store = createStore({
      modules: {
        uiController: {
          ...uiController,
          state: () => ({
            ...uiController.state,
            UIGeneralStatus: { ...uiController.state.UIGeneralStatus },
          }),
        },
        introspection: {
          ...introspection,
          state: () => ({ ...introspection.state, searchQueryParameters: {} }),
        },
      },
    });
    wrapper = shallowMount(Layout, { global: { plugins: [store] } });
    await wrapper.vm.$nextTick();
  });

  afterEach(() => wrapper?.unmount());

  it("keeps the application shell hidden during server rendering", async () => {
    const app = createSSRApp(Layout);
    app.use(store);
    app.component("RouterView", VSlotStub);
    const container = document.createElement("div");
    container.innerHTML = await renderToString(app);
    expect(container.childElementCount).toBe(0);
  });

  it("reveals the application shell after mounting", () => {
    expect(wrapper.vm.isMounted).toBe(true);
    expect(wrapper.find("#app").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "VNavigationDrawer" }).exists()).toBe(
      true,
    );
  });

  it("renders navigation, messages, routed content, chat and footer", () => {
    for (const name of [
      "NavigationDrawer",
      "HeaderComp",
      "Jumbotron",
      "PublicMessages",
      "FionaChat",
      "FooterComp",
    ]) {
      expect(wrapper.findComponent({ name }).exists(), name).toBe(true);
    }
    expect(wrapper.get("router-view-stub").classes()).toContain(
      "min-height-70vh",
    );
    expect(wrapper.findComponent({ name: "VAlert" }).exists()).toBe(false);
  });

  it("shows and removes the read-only notice as the store changes", async () => {
    store.commit("introspection/setReadOnlyMode");
    await wrapper.vm.$nextTick();
    const alert = wrapper.findComponent({ name: "VAlert" });
    expect(alert.props("type")).toBe("info");
    expect(alert.text()).toContain("editing is disabled");
    expect(wrapper.findComponent({ name: "HeaderComp" }).exists()).toBe(true);
    store.state.introspection.readOnlyMode = false;
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: "VAlert" }).exists()).toBe(false);
  });

  it("synchronizes drawer visibility between its v-model and Vuex", async () => {
    const drawer = wrapper.findComponent({ name: "VNavigationDrawer" });
    expect(drawer.props("modelValue")).toBe(false);
    drawer.vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(store.state.uiController.UIGeneralStatus.drawerVisibilityState).toBe(
      true,
    );
    store.commit("uiController/setUIStatus", { drawerVisibilityState: false });
    await wrapper.vm.$nextTick();
    expect(drawer.props("modelValue")).toBe(false);
  });
});
