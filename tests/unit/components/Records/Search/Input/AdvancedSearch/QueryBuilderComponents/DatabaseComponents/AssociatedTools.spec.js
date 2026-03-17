import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import AssociatedTools from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/AssociatedTools.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("AssociatedTools.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AssociatedTools, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("AssociatedTools");
  });
});
