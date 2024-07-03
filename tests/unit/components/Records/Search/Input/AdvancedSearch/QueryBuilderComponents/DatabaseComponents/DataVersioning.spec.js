import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DataVersioning from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataVersioning.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("DataAccessForPrePublicationReview.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataVersioning, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataVersioning");
  });
});
