import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import Organisations from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Organisations.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";
import organisationSearch from "@/store/AdvancedSearchComponents/organisationSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

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
      fetchSearchOrganisations: jest.fn(),
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
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Organisations");
  });
});
