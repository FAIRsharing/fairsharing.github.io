import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Organisations from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Organisations.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";
import organisationSearch from "@/store/AdvancedSearchComponents/organisationSearch";

const $router = {
  push: vi.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
let vuetify = createVuetify();

describe("Organisations.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    organisationSearch.getters = {
      getSearchOrganisations: () => {
        return ["Test", "Abc"];
      },
    };
    advancedSearch.getters = {
      getEditDialogStatus: () => {
        return true;
      },
    };
    actions = {
      fetchSearchOrganisations: vi.fn(),
    };
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        advancedSearch: advancedSearch,
        organisationSearch: organisationSearch,
      },
    });
    wrapper = shallowMount(Organisations, {
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Organisations");
  });
});
