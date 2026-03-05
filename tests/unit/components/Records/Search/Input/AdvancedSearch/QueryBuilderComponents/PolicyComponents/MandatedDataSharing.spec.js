import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import MandatedDataSharing from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/MandatedDataSharing.vue";


let vuetify = createVuetify();

describe("MandatedDataSharing", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(MandatedDataSharing, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("MandatedDataSharing");
  });
});
