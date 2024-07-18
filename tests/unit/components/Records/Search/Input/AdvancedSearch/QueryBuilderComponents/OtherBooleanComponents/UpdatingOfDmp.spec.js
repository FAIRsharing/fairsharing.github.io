import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import UpdatingOfDmp from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/UpdatingOfDmp.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("UpdatingOfDmp", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(UpdatingOfDmp, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("UpdatingOfDmp");
  });
});
