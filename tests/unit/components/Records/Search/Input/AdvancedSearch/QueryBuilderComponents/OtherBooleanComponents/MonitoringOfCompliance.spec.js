import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import MonitoringOfCompliance from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/MonitoringOfCompliance.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("MonitoringOfCompliance", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(MonitoringOfCompliance, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("MonitoringOfCompliance");
  });
});
