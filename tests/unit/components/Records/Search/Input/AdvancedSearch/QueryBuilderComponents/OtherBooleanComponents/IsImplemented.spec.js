import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import IsImplemented from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/IsImplemented.vue";


let vuetify = createVuetify();

describe("IsImplemented", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(IsImplemented, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("IsImplemented");
  });
});
