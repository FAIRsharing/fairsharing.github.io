import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataVersioning from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataVersioning.vue";


let vuetify = createVuetify();

describe("DataVersioning.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataVersioning, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataVersioning");
  });
});
