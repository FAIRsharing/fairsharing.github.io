import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Domains from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Domains.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";
import domainsSearch from "@/store/AdvancedSearchComponents/domainsSearch";

const $router = {
  push: vi.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
let vuetify = createVuetify();

describe("Domains.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    domainsSearch.getters = {
      getSearchDomains: () => {
        return ["Test", "Abc"];
      },
      getLoadingStatus: () => {
        return true;
      },
    };
    advancedSearch.getters = {
      getEditDialogStatus: () => {
        return true;
      },
    };
    actions = {
      fetchSearchDomains: vi.fn(),
    };
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        advancedSearch: advancedSearch,
        domainsSearch: domainsSearch,
      },
    });
    wrapper = shallowMount(Domains, {
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Domains");
  });
});
