import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import IndeterminateExamples from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/FairassistComponents/IndeterminateExamples.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("IndeterminateExamples", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(IndeterminateExamples, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("IndeterminateExamples");
  });
});
