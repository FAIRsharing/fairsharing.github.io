import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import MandatedDataSharing from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/MandatedDataSharing.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("MandatedDataSharing", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(MandatedDataSharing, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("MandatedDataSharing");
  });
});
