import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import StandardRecordType from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/StandardRecordType.vue";
import recordTypes from "@/store/AdvancedSearchComponents/recordTypes";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
let vuetify = createVuetify();

describe("StandardRecordType.vue", () => {
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
              name: "Standard",
            },
          },
        ];
      },
    };
    actions = {
      fetchAllRecordTypes: jest.fn(),
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
    wrapper = shallowMount(StandardRecordType, {
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("StandardRecordType");
  });
});
