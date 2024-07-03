import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DataCuration from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataCuration.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("DataCuration.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataCuration, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataCuration");
  });
});
