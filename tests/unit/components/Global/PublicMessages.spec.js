import { shallowMount } from "@vue/test-utils";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createStore } from "vuex";

import PublicMessages from "@/components/Global/PublicMessages";
import messages from "@/store/messages.js";

messages.state.loading = false;
messages.state.publicMessages = ["test message"];

const $store = createStore({
  modules: {
    messages: messages,
  },
});

describe("PublicMessages.vue", () => {
  let wrapper;

  beforeAll(() => {
    import.meta.env.VITE_API_ENDPOINT = "https://dev-api.fairsharing.org";
  });

  beforeEach(() => {
    wrapper = shallowMount(PublicMessages, {
      global: {
        plugins: [$store],
      },
    });
  });
  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("PublicMessages");
  });

  it("can be check moment method", () => {
    const momentifiedDate = wrapper.vm.moment("2021-08-26T14:24:46");
    expect(momentifiedDate).toBe("Thursday, August 26th 2021, 14:24");
  });

  it("can check is_development method when vite end point does NOT include 'dev-api'", () => {
    import.meta.env.VITE_API_ENDPOINT = "https://test-api.fairsharing.org";
    expect(wrapper.vm.is_development()).toBe(false);
  });

  it("can check is_localhost method when vite end point does include 'localhost:3000'", () => {
    import.meta.env.VITE_API_ENDPOINT = "https://localhost:3000";
    expect(wrapper.vm.is_localhost()).toBe(true);
  });
});
