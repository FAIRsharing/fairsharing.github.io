import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataProtection from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/DataProtection.vue";


let vuetify = createVuetify();

describe("DataProtection", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataProtection, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataProtection");
  });
});
