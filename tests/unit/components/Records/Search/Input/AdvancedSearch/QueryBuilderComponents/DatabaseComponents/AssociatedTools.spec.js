import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import AssociatedTools from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/AssociatedTools.vue";


let vuetify = createVuetify();

describe("AssociatedTools.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AssociatedTools, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("AssociatedTools");
  });
});
