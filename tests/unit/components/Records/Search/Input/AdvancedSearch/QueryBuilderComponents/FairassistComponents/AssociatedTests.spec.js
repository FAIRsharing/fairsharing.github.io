import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import AssociatedTests from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/FairassistComponents/AssociatedTests.vue";


let vuetify = createVuetify();

describe("AssociatedTests", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AssociatedTests, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("AssociatedTests");
  });
});
