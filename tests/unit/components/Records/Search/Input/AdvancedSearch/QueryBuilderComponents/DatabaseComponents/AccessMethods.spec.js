import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import AccessMethods from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/AccessMethods.vue";


let vuetify = createVuetify();

describe("AccessMethods.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AccessMethods, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("AccessMethods");
  });
});
