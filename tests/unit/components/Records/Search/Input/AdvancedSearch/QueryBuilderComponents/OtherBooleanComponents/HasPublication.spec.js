import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import HasPublication from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/HasPublication.vue";


let vuetify = createVuetify();

describe("HasPublication", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(HasPublication, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("HasPublication");
  });
});
