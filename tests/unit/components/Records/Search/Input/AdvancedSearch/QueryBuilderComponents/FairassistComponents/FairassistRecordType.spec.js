import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import FairassistRecordType from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/FairassistComponents/FairassistRecordType.vue";
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

describe("FairassistRecordType.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    recordTypes.getters = {
      getRecordTypes: () => {
        return [
          {
            id: 1,
            name: "metric",
            fairsharingRegistry: {
              id: 2,
              name: "FAIRassist",
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
    wrapper = shallowMount(FairassistRecordType, {
      localVue,
      vuetify,
      store,
      mixins: [recordTypesMixin],
      mocks: { $router, $route },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("FairassistRecordType");
  });

  it("mixin having method filteredRecordTypes to filter records according to fairsharing registry i.e. database/standard/policy", function () {
    let resultArr = ["metric"];
    const filterFunction = wrapper.vm.filteredRecordTypes("FAIRassist");
    expect(filterFunction).toStrictEqual(resultArr);
  });
});
