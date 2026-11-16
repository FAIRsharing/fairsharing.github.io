import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createMemoryHistory, createRouter, RouterView } from "vue-router";

import AllPage from "@/pages/all/+Page.vue";

describe("all +Page.vue", () => {
  let wrapper;
  let router;

  const FirstPage = { template: "<p>First routed page</p>" };
  const SecondPage = { template: "<p>Second routed page</p>" };

  beforeEach(async () => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", component: FirstPage },
        { path: "/other", component: SecondPage },
      ],
    });
    await router.push("/");
    await router.isReady();

    wrapper = mount(AllPage, {
      global: {
        plugins: [router],
        components: { "router-view": RouterView },
        stubs: { "router-view": false },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("renders the active route through RouterView", () => {
    expect(wrapper.findComponent(RouterView).exists()).toBe(true);
    expect(wrapper.findComponent(FirstPage).exists()).toBe(true);
    expect(wrapper.text()).toBe("First routed page");
  });

  it("replaces the routed view after navigation", async () => {
    await router.push("/other");
    await flushPromises();

    expect(wrapper.findComponent(FirstPage).exists()).toBe(false);
    expect(wrapper.findComponent(SecondPage).exists()).toBe(true);
    expect(wrapper.text()).toBe("Second routed page");
  });
});
