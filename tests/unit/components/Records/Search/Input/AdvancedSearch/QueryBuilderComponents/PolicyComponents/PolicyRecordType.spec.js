import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import PolicyRecordType from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/PolicyComponents/PolicyRecordType.vue";
import recordTypes from "@/store/AdvancedSearchComponents/recordTypes";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };

let vuetify = createVuetify();

describe("PolicyRecordType.vue", () => {
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
              name: "Policy",
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
    wrapper = shallowMount(PolicyRecordType, {
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("PolicyRecordType");
  });
});
