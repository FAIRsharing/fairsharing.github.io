import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import jumpToTop from "@/components/Navigation/jumpToTop.vue";

const vuetify = createVuetify();

describe("jumpToTop.vue", function () {
  let wrapper;
  wrapper = shallowMount(jumpToTop, {
    vuetify,
    directives: {
      scrollTo() {
        /* stub */
      },
    },
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("JumpToTop");
  });
});
