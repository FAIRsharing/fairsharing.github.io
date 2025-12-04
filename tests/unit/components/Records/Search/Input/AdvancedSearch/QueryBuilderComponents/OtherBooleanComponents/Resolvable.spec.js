import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import Resolvable from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/Resolvable.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("Resolvable", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(Resolvable, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Resolvable");
  });
});
