import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataPreservationPolicy from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataPreservationPolicy.vue";


let vuetify = createVuetify();

describe("DataPreservationPolicy", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataPreservationPolicy, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataPreservationPolicy");
  });
});
