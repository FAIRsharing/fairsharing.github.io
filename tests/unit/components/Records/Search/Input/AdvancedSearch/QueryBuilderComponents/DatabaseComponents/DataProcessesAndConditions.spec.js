import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataProcessesAndConditions from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataProcessesAndConditions.vue";


let vuetify = createVuetify();

describe("DataProcessesAndConditions", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataProcessesAndConditions, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataProcessesAndConditions");
  });
});
