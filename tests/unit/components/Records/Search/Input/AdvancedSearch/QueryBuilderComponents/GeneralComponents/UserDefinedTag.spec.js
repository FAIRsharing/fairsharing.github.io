import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import UserDefinedTag from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/UserDefinedTag.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";
import userDefinedTagsSearch from "@/store/AdvancedSearchComponents/userDefinedTagsSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
let vuetify = createVuetify();

describe("UserDefinedTag.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    userDefinedTagsSearch.getters = {
      getSearchUserDefinedTags: () => {
        return ["Test", "Abc"];
      },
    };
    advancedSearch.getters = {
      getEditDialogStatus: () => {
        return true;
      },
    };
    actions = {
      fetchSearchTaxonomies: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        advancedSearch: advancedSearch,
        userDefinedTagsSearch: userDefinedTagsSearch,
      },
    });
    wrapper = shallowMount(UserDefinedTag, {
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("UserDefinedTag");
  });
});
