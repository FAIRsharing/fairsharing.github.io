import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DatabaseRecordType from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/RecordTypes/DatabaseRecordType.vue";
import recordTypes from "@/store/AdvancedSearchComponents/recordTypes";
import { recordTypes as recordTypesMixin } from "@/utils/advancedSearchUtils";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/advancedsearch", query: {} };
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.mixin(recordTypesMixin);
let vuetify = new Vuetify();

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
      mixins: [recordTypesMixin],
      mocks: { $router, $route },
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
