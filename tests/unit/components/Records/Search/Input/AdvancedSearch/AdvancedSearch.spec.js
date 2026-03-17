import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import AdvancedSearch from "@/components/Records/Search/Input/AdvancedSearch/AdvancedSearch.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/search", query: {} };

let vuetify = createVuetify();

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
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("AdvancedSearch");
  });
});
