import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DataPreservation from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/DataPreservation.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("DataPreservation", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataPreservation, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataPreservation");
  });
});
