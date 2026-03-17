import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import UsesPersistentIdentifier from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/UsesPersistentIdentifier.vue";


let vuetify = createVuetify();

describe("UsesPersistentIdentifier", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(UsesPersistentIdentifier, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("UsesPersistentIdentifier");
  });
});
