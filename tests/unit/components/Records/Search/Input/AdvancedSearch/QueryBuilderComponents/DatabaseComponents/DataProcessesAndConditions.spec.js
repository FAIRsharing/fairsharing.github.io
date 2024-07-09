import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DataProcessesAndConditions from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataProcessesAndConditions.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("DataProcessesAndConditions", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataProcessesAndConditions, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataProcessesAndConditions");
  });
});
