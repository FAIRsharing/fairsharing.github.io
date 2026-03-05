import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Resolvable from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/Resolvable.vue";


let vuetify = createVuetify();

describe("Resolvable", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Resolvable, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Resolvable");
  });
});
