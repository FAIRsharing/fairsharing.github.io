import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import ObjectTypes from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/ObjectTypes.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";
import objectTypes from "@/store/AdvancedSearchComponents/objectTypes";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("ObjectTypes.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    objectTypes.getters = {
      getObjectTypes: () => {
        return ["Test", "Abc"];
      }
    };
    advancedSearch.getters = {
      getEditDialogStatus: () => {
        return true;
      },
    };
    actions = {
      fetchObjectTypes: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        advancedSearch: advancedSearch,
        objectTypes: objectTypes,
      },
    });
    wrapper = shallowMount(ObjectTypes, {
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("ObjectTypes");
  });
});
