import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataCuration from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataCuration.vue";


let vuetify = createVuetify();

describe("DataCuration.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataCuration, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataCuration");
  });
});
