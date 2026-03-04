import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Persistent from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/Persistent.vue";


let vuetify = createVuetify();

describe("Persistent", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Persistent, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Persistent");
  });
});
