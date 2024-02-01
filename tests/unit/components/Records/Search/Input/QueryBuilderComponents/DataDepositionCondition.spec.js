import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DataDepositionCondition from "@/components/Records/Search/Input/QueryBuilderComponents/DataDepositionCondition";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("DataDepositionCondition.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataDepositionCondition, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataDepositionCondition");
  });
});
