import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import AssociatedTests from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/FairassistComponents/AssociatedTests.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("AssociatedTests", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AssociatedTests, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("AssociatedTests");
  });
});
