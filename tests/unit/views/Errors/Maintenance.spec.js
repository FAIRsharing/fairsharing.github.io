import { shallowMount } from "@vue/test-utils";

import Maintenance from "@/views/Errors/Maintenance.vue";

describe("Maintenance page", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Maintenance, {});
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Maintenance");
    expect(wrapper.vm.$options.metaInfo.call(wrapper.vm).title).toBe(
      "FAIRsharing | Maintenance Mode",
    );
  });
});
