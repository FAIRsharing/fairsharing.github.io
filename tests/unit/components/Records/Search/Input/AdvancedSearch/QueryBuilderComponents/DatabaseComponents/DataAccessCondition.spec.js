import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataAccessCondition from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataAccessCondition.vue";


let vuetify = createVuetify();

describe("DataAccessCondition.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataAccessCondition, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataAccessCondition");
  });
});
