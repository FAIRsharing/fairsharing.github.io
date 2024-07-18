import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import GuidanceToHelpEnableCompliance from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/GuidanceToHelpEnableCompliance.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("GuidanceToHelpEnableCompliance", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(GuidanceToHelpEnableCompliance, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("GuidanceToHelpEnableCompliance");
  });
});
