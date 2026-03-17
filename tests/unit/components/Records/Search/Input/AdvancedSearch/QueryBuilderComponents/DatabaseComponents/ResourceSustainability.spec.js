import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import ResourceSustainability from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/ResourceSustainability.vue";


let vuetify = createVuetify();

describe("ResourceSustainability", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ResourceSustainability, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("ResourceSustainability");
  });
});
