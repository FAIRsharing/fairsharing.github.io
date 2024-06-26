import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import Countries from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/Countries.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";
import countriesSearch from "@/store/AdvancedSearchComponents/countriesSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("Countries.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    countriesSearch.getters = {
      getSearchCountries: () => {
        return ["Test", "Abc"];
      },
    };
    advancedSearch.getters = {
      getEditDialogStatus: () => {
        return true;
      },
    };
    actions = {
      fetchSearchCountries: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        advancedSearch: advancedSearch,
        countriesSearch: countriesSearch,
      },
    });
    wrapper = shallowMount(Countries, {
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Countries");
  });
});
