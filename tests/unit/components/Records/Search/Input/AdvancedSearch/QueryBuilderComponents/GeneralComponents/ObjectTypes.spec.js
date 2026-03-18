import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import ObjectTypes from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/ObjectTypes.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";
import objectTypes from "@/store/AdvancedSearchComponents/objectTypes";

const $router = {
  push: vi.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
let vuetify = createVuetify();

describe("ObjectTypes.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    objectTypes.getters = {
      getObjectTypes: () => {
        return ["Test", "Abc"];
      },
      getLoadingData: () => {
        return true;
      },
    };
    advancedSearch.getters = {
      getEditDialogStatus: () => {
        return true;
      },
    };
    actions = {
      fetchObjectTypes: vi.fn(),
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
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("ObjectTypes");
  });
});
