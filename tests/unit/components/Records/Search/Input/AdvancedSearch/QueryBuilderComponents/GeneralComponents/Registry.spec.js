import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Registry from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Registry.vue";
import recordTypes from "@/store/AdvancedSearchComponents/recordTypes";

const $router = {
  push: vi.fn(),
};
let $route = { path: "/search", query: {} };
let vuetify = createVuetify();

describe("Registry.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    recordTypes.getters = {
      getRecordTypes: () => {
        return [
          {
            id: 1,
            name: "test",
            fairsharingRegistry: {
              id: 2,
              name: "Database",
            },
          },
          {
            id: 2,
            name: "abc",
            fairsharingRegistry: {
              id: 2,
              name: "Database",
            },
          },
          {
            id: 3,
            name: "test",
            fairsharingRegistry: {
              id: 1,
              name: "Standard",
            },
          },
        ];
      },
    };
    actions = {
      fetchAllRecordTypes: vi.fn(),
    };
    recordTypes.actions = {
      fetchAllRecordTypes: actions.fetchAllRecordTypes,
    };
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        recordTypes: recordTypes,
      },
    });
    wrapper = shallowMount(Registry, {
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Registry");
  });
});
