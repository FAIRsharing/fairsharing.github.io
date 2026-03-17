import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DatabaseRecordType from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DatabaseRecordType.vue";
import recordTypes from "@/store/AdvancedSearchComponents/recordTypes";
import { recordTypes as recordTypesMixin } from "@/utils/advancedSearchUtils";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };

let vuetify = createVuetify();

describe("DatabaseRecordType.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    recordTypes.getters = {
      getRecordTypes: () => {
        return [
          {
            id: 1,
            name: "database record type",
            fairsharingRegistry: {
              id: 2,
              name: "Database",
            },
          },
          {
            id: 2,
            name: "model_and_format",
            fairsharingRegistry: {
              id: 1,
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
    wrapper = shallowMount(DatabaseRecordType, {
      global: {
        plugins: [store, vuetify],
        mixins: [recordTypesMixin],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DatabaseRecordType");
  });

  it("mixin having method filteredRecordTypes to filter records according to fairsharing registry i.e. database/standard/policy", function () {
    let resultArr = ["database record type"];
    const filterFunction = wrapper.vm.filteredRecordTypes("Database");
    expect(filterFunction).toStrictEqual(resultArr);
  });
});
