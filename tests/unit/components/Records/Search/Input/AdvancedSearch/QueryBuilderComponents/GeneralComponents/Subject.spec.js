import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Subject from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Subject.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";
import subjectSearch from "@/store/AdvancedSearchComponents/subjectSearch";

const $router = {
  push: vi.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
let vuetify = createVuetify();

describe("Subject.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    subjectSearch.getters = {
      getSearchSubjects: () => {
        return ["Test", "Abc"];
      },
    };
    advancedSearch.getters = {
      getEditDialogStatus: () => {
        return true;
      },
    };
    actions = {
      fetchSearchSubjects: vi.fn(),
    };
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        advancedSearch: advancedSearch,
        subjectSearch: subjectSearch,
      },
    });
    wrapper = shallowMount(Subject, {
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Subject");
  });
});
