import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import IndeterminateExamples from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/FairassistComponents/IndeterminateExamples.vue";


let vuetify = createVuetify();

describe("IndeterminateExamples", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(IndeterminateExamples, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("IndeterminateExamples");
  });
});
