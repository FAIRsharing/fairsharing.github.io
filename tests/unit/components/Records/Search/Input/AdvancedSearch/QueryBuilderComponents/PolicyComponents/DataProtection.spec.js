import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DataProtection from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/DataProtection.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("DataProtection", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataProtection, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataProtection");
  });
});
