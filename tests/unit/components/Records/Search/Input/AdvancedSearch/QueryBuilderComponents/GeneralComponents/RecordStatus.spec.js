import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import RecordStatus from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/RecordStatus.vue";

let vuetify = createVuetify();

describe("RecordStatus.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(RecordStatus, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("RecordStatus");
  });
});
