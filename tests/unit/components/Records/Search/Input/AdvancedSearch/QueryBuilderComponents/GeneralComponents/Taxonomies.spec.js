import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Taxonomies from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Taxonomies.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";
import taxonomiesSearch from "@/store/AdvancedSearchComponents/taxonomiesSearch";

const $router = {
  push: vi.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
let vuetify = createVuetify();

describe("Taxonomies.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    taxonomiesSearch.getters = {
      getSearchTaxonomies: () => {
        return ["Test", "Abc"];
      },
    };
    advancedSearch.getters = {
      getEditDialogStatus: () => {
        return true;
      },
    };
    actions = {
      fetchSearchTaxonomies: vi.fn(),
    };
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        advancedSearch: advancedSearch,
        taxonomiesSearch: taxonomiesSearch,
      },
    });
    wrapper = shallowMount(Taxonomies, {
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Taxonomies");
  });
});
