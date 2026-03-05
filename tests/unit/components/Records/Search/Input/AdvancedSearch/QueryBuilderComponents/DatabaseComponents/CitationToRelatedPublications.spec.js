import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import CitationToRelatedPublications from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/CitationToRelatedPublications.vue";


let vuetify = createVuetify();

describe("CitationToRelatedPublications.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(CitationToRelatedPublications, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("CitationToRelatedPublications");
  });
});
