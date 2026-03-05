import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Licences from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Licences.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";
import licencesSearch from "@/store/AdvancedSearchComponents/licencesSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
let vuetify = createVuetify();

describe("Licences.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    licencesSearch.getters = {
      getSearchLicences: () => {
        return ["Test", "Abc"];
      },
    };
    advancedSearch.getters = {
      getEditDialogStatus: () => {
        return true;
      },
    };
    actions = {
      fetchSearchLicences: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        advancedSearch: advancedSearch,
        licencesSearch: licencesSearch,
      },
    });
    wrapper = shallowMount(Licences, {
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Licences");
  });
});
