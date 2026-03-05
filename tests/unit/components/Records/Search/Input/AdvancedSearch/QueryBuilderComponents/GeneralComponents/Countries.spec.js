import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Countries from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Countries.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";
import countriesSearch from "@/store/AdvancedSearchComponents/countriesSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
let vuetify = createVuetify();

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
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Countries");
  });
});
