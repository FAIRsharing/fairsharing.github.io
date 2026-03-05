import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import GloballyUnique from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/GloballyUnique.vue";


let vuetify = createVuetify();

describe("GloballyUnique", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(GloballyUnique, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("GloballyUnique");
  });
});
