import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataPreservation from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/DataPreservation.vue";


let vuetify = createVuetify();

describe("DataPreservation", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataPreservation, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataPreservation");
  });
});
