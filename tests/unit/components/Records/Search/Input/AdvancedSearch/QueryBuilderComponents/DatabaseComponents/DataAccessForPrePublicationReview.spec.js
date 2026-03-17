import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DataAccessForPrePublicationReview from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataAccessForPrePublicationReview.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("DataAccessForPrePublicationReview.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataAccessForPrePublicationReview, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataAccessForPrePublicationReview");
  });
});
