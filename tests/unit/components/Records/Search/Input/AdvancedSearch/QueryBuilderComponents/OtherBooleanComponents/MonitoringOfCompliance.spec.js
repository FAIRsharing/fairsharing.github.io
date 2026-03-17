import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import MonitoringOfCompliance from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/MonitoringOfCompliance.vue";


let vuetify = createVuetify();

describe("MonitoringOfCompliance", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(MonitoringOfCompliance, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("MonitoringOfCompliance");
  });
});
