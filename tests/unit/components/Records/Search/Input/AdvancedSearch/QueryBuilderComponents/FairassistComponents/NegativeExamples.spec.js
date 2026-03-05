import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import NegativeExamples from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/FairassistComponents/NegativeExamples.vue";


let vuetify = createVuetify();

describe("NegativeExamples", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(NegativeExamples, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("NegativeExamples");
  });
});
