import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import SupportedCosts from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/SupportedCosts.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("SupportedCosts", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(SupportedCosts, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("SupportedCosts");
  });
});
