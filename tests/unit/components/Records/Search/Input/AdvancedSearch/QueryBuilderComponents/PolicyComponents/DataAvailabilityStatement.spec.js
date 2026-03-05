import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataAvailabilityStatement from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/DataAvailabilityStatement.vue";


let vuetify = createVuetify();

describe("DataAvailabilityStatement", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataAvailabilityStatement, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataAvailabilityStatement");
  });
});
