import { shallowMount } from "@vue/test-utils";

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
