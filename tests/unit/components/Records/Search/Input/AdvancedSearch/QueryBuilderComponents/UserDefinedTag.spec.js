import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import UserDefinedTag from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/UserDefinedTag.vue";
import advancedSearch from "@/store/advancedSearch";
import userDefinedTagsSearch from "@/store/AdvancedSearchComponents/userDefinedTagsSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

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
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("UserDefinedTag");
  });
});
