import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import MandatedDmpCreation from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/MandatedDmpCreation.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("MandatedDmpCreation", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(MandatedDmpCreation, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("MandatedDmpCreation");
  });
});
