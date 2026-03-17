import { shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";
import { createVuetify } from "vuetify";

import Footer from "@/components/Navigation/Footer.vue";

const vuetify = createVuetify();
const router = new VueRouter();

describe("Footer.vue", () => {
  it("can be instantiated", () => {
    const wrapper = shallowMount(Footer, {
      vuetify,
      router,
      directives: {
        scrollTo() {
          /* stub */
        },
      },
    });
    expect(wrapper.vm.$options.name).toMatch("Footer");
  });
});
