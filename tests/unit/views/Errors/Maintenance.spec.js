import { shallowMount  } from "@vue/test-utils";
import VueMeta from "vue-meta";

import Maintenance from "@/views/Errors/Maintenance.vue";


describe("Maintenance page", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Maintenance, {
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Maintenance");
    expect(wrapper.vm.$meta().refresh().metaInfo.title).toBe(
      "FAIRsharing | Maintenance Mode",
    );
  });
});
