import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataContactInformation from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataContactInformation.vue";


let vuetify = createVuetify();

describe("DataContactInformation.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataContactInformation, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataContactInformation");
  });
});
