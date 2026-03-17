import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataCitation from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/DataCitation.vue";


let vuetify = createVuetify();

describe("DataCitation", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataCitation, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataCitation");
  });
});
