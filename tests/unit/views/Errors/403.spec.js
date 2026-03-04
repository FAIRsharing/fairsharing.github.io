import { shallowMount  } from "@vue/test-utils";
import VueMeta from "vue-meta";

import Error from "@/views/Errors/403.vue";


describe("403 unauthorized page", () => {
  let wrapper;

  it("can mount", () => {
    wrapper = shallowMount(Error, {
    });
    expect(wrapper.vm.$options.name).toBe("Error403");
    expect(wrapper.vm.$meta().refresh().metaInfo.title).toBe(
      "FAIRsharing | Not Authorized",
    );
  });
});
