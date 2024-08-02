import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import ResourceSustainability from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/ResourceSustainability.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("ResourceSustainability", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ResourceSustainability, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("ResourceSustainability");
  });
});
