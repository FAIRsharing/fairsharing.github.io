import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import SharingResearchSoftware from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/SharingResearchSoftware.vue";


let vuetify = createVuetify();

describe("SharingResearchSoftware", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(SharingResearchSoftware, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("SharingResearchSoftware");
  });
});
