import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueMeta from "vue-meta";

import Hidden from "@/views/Errors/Hidden.vue";

const localVue = createLocalVue();
localVue.use(VueMeta);

describe("Hidden record notification", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Hidden, {
      localVue,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Hidden");
  });
});
