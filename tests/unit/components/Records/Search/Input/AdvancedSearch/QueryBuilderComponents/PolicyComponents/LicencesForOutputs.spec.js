import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import LicencesForOutputs from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/LicencesForOutputs.vue";


let vuetify = createVuetify();

describe("LicencesForOutputs", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(LicencesForOutputs, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("LicencesForOutputs");
  });
});
