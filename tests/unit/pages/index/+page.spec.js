import { shallowMount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import IndexPage from "@/pages/index/+Page.vue";
import Home from "@/views/Home/Home.vue";

describe("homepage +Page.vue", () => {
  it("renders the Home view", () => {
    const wrapper = shallowMount(IndexPage);

    try {
      expect(wrapper.findAllComponents(Home)).toHaveLength(1);
      expect(wrapper.findComponent(Home).element).toBe(wrapper.element);
    } finally {
      wrapper.unmount();
    }
  });
});
