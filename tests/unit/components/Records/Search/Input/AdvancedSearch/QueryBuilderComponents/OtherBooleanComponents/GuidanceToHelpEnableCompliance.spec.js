import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import GuidanceToHelpEnableCompliance from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/GuidanceToHelpEnableCompliance.vue";


let vuetify = createVuetify();

describe("GuidanceToHelpEnableCompliance", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(GuidanceToHelpEnableCompliance, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("GuidanceToHelpEnableCompliance");
  });
});
