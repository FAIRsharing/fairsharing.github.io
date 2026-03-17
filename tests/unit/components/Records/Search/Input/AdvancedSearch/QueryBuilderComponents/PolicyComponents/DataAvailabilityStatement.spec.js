import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DataAvailabilityStatement from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/DataAvailabilityStatement.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("DataAvailabilityStatement", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataAvailabilityStatement, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataAvailabilityStatement");
  });
});
