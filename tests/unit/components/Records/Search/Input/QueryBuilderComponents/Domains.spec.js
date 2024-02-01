import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import Domains from "@/components/Records/Search/Input/QueryBuilderComponents/Domains";
import advancedSearch from "@/store/advancedSearch";
import domainsSearch from "@/store/AdvancedSearchComponents/domainsSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("Domains.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    domainsSearch.getters = {
      getSearchDomains: () => {
        return ["Test", "Abc"];
      },
    };
    advancedSearch.getters = {
      getEditDialogStatus: () => {
        return true;
      },
    };
    actions = {
      fetchSearchDomains: jest.fn(),
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
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Domains");
  });
});
