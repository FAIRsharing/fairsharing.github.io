import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import advancedSearch from "@/store/advancedSearch";
import AdvancedSearchRecordsView from "@/views/AdvancedSearch/AdvancedSearchRecordsView.vue";

let $route = {
  name: "search",
  query: {},
};

const $router = {
  push: jest.fn(),
};

describe("AdvancedSearchRecordsView.vue", function () {
  let wrapper, store, actions;
  const vuetify = new Vuetify();
  const localVue = createLocalVue();
  localVue.use(Vuex);

  beforeEach(() => {
    advancedSearch.getters = {
      getLoadingStatus: () => {
        return [true];
      },
    };

    actions = {
      resetAdvancedSearchResponse: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        advancedSearch: advancedSearch,
      },
    });

    wrapper = shallowMount(AdvancedSearchRecordsView, {
      localVue,
      vuetify,
      store,
      mocks: { $route, $router },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("AdvancedSearchRecordsView");
  });
});
