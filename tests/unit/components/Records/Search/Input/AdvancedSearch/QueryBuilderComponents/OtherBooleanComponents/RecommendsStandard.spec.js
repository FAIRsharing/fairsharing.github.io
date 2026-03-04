import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import RecommendsStandard from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/RecommendsStandard.vue";


let vuetify = createVuetify();

describe("RecommendsStandard", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(RecommendsStandard, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("RecommendsStandard");
  });
});
