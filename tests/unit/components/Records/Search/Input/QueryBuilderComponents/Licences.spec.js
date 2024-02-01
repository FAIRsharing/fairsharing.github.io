import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import Licences from "@/components/Records/Search/Input/QueryBuilderComponents/Licences";
import advancedSearch from "@/store/advancedSearch";
import licencesSearch from "@/store/AdvancedSearchComponents/licencesSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

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
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Licences");
  });
});
