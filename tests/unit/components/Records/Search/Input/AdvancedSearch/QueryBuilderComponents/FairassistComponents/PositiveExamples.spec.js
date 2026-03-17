import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import PositiveExamples from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/FairassistComponents/PositiveExamples.vue";


let vuetify = createVuetify();

describe("PositiveExamples", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(PositiveExamples, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("PositiveExamples");
  });
});
