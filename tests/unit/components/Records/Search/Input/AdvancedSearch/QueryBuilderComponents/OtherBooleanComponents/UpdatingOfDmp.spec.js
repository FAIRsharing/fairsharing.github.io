import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import UpdatingOfDmp from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/UpdatingOfDmp.vue";


let vuetify = createVuetify();

describe("UpdatingOfDmp", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(UpdatingOfDmp, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("UpdatingOfDmp");
  });
});
