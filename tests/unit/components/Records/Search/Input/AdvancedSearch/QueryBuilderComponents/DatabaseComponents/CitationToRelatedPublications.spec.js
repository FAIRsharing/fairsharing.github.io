import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import CitationToRelatedPublications from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/CitationToRelatedPublications.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("CitationToRelatedPublications.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(CitationToRelatedPublications, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("CitationToRelatedPublications");
  });
});
