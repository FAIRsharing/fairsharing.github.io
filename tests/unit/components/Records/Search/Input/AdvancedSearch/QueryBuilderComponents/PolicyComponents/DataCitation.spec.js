import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DataCitation from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/DataCitation.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("DataCitation", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataCitation, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataCitation");
  });
});
