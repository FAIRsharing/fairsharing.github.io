import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import Footer from "@/components/Navigation/Footer.vue";

const vuetify = createVuetify();

describe("Footer.vue", () => {
  it("can be instantiated", () => {
    const wrapper = shallowMount(Footer, {
      vuetify,
      directives: {
        scrollTo() {
          /* stub */
        },
      },
    });
    expect(wrapper.vm.$options.name).toMatch("Footer");
  });
});
