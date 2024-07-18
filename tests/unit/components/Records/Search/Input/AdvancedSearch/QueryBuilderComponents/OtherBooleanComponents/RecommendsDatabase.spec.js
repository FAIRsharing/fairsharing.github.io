import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import RecommendsDatabase from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/RecommendsDatabase.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("RecommendsDatabase", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(RecommendsDatabase, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("RecommendsDatabase");
  });
});
