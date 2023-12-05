import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import AdvancedSearch from "@/components/Records/Search/Input/AdvancedSearch";
import advancedSearch from "@/store/advancedSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/search", query: {} };
const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("AdvancedSearch.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    advancedSearch.getters = {
      getAdvancedSearch: () => {
        return [
          {
            operatorIdentifier: "_and",
            children: [
              {
                operatorIdentifier: "_and",
                children: [
                  {
                    identifier: "registry",
                    value: ["database", "standard"],
                  },
                ],
              },
            ],
          },
        ];
      },
    };

    actions = {
      fetchAdvancedSearchResults: jest.fn(),
      resetAdvancedSearchQuery: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        advancedSearch: advancedSearch,
      },
    });

    wrapper = shallowMount(AdvancedSearch, {
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("AdvancedSearch");
  });
});
