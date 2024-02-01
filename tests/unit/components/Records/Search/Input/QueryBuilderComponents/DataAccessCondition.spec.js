import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DataAccessCondition from "@/components/Records/Search/Input/QueryBuilderComponents/DataAccessCondition";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("DataAccessCondition.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataAccessCondition, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataAccessCondition");
  });
});
