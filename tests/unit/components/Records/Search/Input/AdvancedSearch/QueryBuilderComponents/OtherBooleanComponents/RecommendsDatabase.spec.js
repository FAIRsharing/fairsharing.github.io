import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import RecommendsDatabase from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/RecommendsDatabase.vue";


let vuetify = createVuetify();

describe("RecommendsDatabase", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(RecommendsDatabase, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("RecommendsDatabase");
  });
});
