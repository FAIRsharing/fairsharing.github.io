import { shallowMount } from "@vue/test-utils";

import Error from "@/views/Errors/404.vue";

describe("404 error page", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Error, {});
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Error404");
    expect(wrapper.vm.$options.metaInfo.call(wrapper.vm).title).toBe(
      "FAIRsharing | Not Found",
    );
  });
});
