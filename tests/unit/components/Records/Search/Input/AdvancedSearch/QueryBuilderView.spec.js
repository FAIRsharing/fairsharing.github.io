import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import QueryBuilderView from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderView.vue";
import advancedSearch from "@/store/AdvancedSearchComponents/advancedSearch";

const $router = {
  push: vi.fn(),
};
let $route = { path: "/search", query: {} };

let vuetify = createVuetify();

describe("QueryBuilderView.vue", () => {
  let wrapper, store;

  beforeEach(() => {
    advancedSearch.getters = {
      getEditAdvancedSearch: () => {
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

      getEditDialogStatus: () => {
        return false;
      },
    };

    store = new Vuex.Store({
      modules: {
        namespaced: true,
        advancedSearch: advancedSearch,
      },
    });

    wrapper = shallowMount(QueryBuilderView, {
      global: {
        plugins: [store, vuetify],
        mocks: { $router, $route },
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("QueryBuilderView");
  });
});
