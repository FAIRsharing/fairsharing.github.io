import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DatabaseRecordType from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/RecordTypes/DatabaseRecordType.vue";
import recordTypes from "@/store/AdvancedSearchComponents/recordTypes";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("DatabaseRecordType.vue", () => {
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
        ];
      },
    };
    actions = {
      fetchAllRecordTypes: jest.fn(),
    };
    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        recordTypes: recordTypes,
      },
    });
    wrapper = shallowMount(DatabaseRecordType, {
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DatabaseRecordType");
  });
});
