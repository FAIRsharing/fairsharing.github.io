import { shallowMount } from "@vue/test-utils";
import VueMeta from "vue-meta";

import Hidden from "@/views/Errors/Hidden.vue";

describe("Hidden record notification", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Hidden, {});
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Hidden");
  });
});
