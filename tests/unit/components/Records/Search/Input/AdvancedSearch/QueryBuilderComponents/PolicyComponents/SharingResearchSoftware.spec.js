import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import SharingResearchSoftware from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/SharingResearchSoftware.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("SharingResearchSoftware", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(SharingResearchSoftware, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("SharingResearchSoftware");
  });
});
