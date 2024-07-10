import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import RecommendsStandard from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/RecommendsStandard.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("RecommendsStandard", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(RecommendsStandard, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("RecommendsStandard");
  });
});
