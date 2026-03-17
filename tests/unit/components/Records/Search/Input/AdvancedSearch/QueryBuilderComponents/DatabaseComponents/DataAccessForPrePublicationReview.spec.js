import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataAccessForPrePublicationReview from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataAccessForPrePublicationReview.vue";


let vuetify = createVuetify();

describe("DataAccessForPrePublicationReview.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataAccessForPrePublicationReview, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataAccessForPrePublicationReview");
  });
});
