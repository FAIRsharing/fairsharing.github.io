import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import MandatedDmpCreation from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/MandatedDmpCreation.vue";


let vuetify = createVuetify();

describe("MandatedDmpCreation", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(MandatedDmpCreation, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("MandatedDmpCreation");
  });
});
