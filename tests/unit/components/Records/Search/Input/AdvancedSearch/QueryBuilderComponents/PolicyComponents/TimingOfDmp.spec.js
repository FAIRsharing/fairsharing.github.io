import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import TimingOfDmp from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/TimingOfDmp.vue";


let vuetify = createVuetify();

describe("TimingOfDmp", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(TimingOfDmp, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("TimingOfDmp");
  });
});
