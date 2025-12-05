import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import Persistent from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/Persistent.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("Persistent", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Persistent, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Persistent");
  });
});
