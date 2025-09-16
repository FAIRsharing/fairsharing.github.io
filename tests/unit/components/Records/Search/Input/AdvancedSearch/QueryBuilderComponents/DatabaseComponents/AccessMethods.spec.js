import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import AccessMethods from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/AccessMethods.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("AccessMethods.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AccessMethods, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("AccessMethods");
  });
});
