import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import Taxonomies from "@/components/Records/Search/Input/QueryBuilderComponents/Taxonomies";
import advancedSearch from "@/store/advancedSearch";
import taxonomiesSearch from "@/store/AdvancedSearchComponents/taxonomiesSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

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
      fetchSearchTaxonomies: jest.fn(),
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
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Taxonomies");
  });
});
