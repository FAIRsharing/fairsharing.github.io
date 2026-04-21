import { shallowMount } from "@vue/test-utils";

import Error from "@/views/Errors/500.vue";

describe("500 error page", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Error, {});
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Error500");
    expect(wrapper.vm.$options.metaInfo.call(wrapper.vm).title).toBe(
      "FAIRsharing | Server Error",
    );
  });
});
