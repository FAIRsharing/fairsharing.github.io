import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";
import VueScrollTo from "vue-scrollto";
import Vuetify from "vuetify";

import Footer from "@/components/Navigation/Footer.vue";

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VueScrollTo, {});
const router = new VueRouter();

describe("Footer.vue", () => {
  it("can be instantiated", () => {
    const wrapper = shallowMount(Footer, {
      localVue,
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
