import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import NegativeExamples from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/FairassistComponents/NegativeExamples.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("NegativeExamples", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(NegativeExamples, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("NegativeExamples");
  });
});
