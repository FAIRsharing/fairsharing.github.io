import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import TimingOfDmp from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/TimingOfDmp.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("TimingOfDmp", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(TimingOfDmp, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("TimingOfDmp");
  });
});
