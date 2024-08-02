import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import ExceptionsToDataSharing from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/ExceptionsToDataSharing.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("ExceptionsToDataSharing", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ExceptionsToDataSharing, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("ExceptionsToDataSharing");
  });
});
