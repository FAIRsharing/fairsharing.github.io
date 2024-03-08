import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import Subject from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/Subject.vue";
import advancedSearch from "@/store/advancedSearch";
import subjectSearch from "@/store/AdvancedSearchComponents/subjectSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

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
      fetchSearchSubjects: jest.fn(),
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
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Subject");
  });
});
