import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import ExceptionsToDataSharing from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/ExceptionsToDataSharing.vue";


let vuetify = createVuetify();

describe("ExceptionsToDataSharing", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ExceptionsToDataSharing, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("ExceptionsToDataSharing");
  });
});
