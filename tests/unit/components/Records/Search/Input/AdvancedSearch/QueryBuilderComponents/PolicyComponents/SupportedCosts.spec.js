import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import SupportedCosts from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/SupportedCosts.vue";


let vuetify = createVuetify();

describe("SupportedCosts", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(SupportedCosts, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("SupportedCosts");
  });
});
