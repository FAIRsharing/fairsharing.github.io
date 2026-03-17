import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import UsesPersistentIdentifier from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/UsesPersistentIdentifier.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("UsesPersistentIdentifier", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(UsesPersistentIdentifier, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("UsesPersistentIdentifier");
  });
});
