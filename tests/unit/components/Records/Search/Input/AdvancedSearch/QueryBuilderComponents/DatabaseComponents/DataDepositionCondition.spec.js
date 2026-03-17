import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataDepositionCondition from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataDepositionCondition.vue";


let vuetify = createVuetify();

describe("DataDepositionCondition.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataDepositionCondition, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataDepositionCondition");
  });
});
