import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import QueryBuilderView from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderView.vue";
import advancedSearch from "@/store/advancedSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/search", query: {} };

const localVue = createLocalVue();
localVue.use(Vuex);

let vuetify = new Vuetify();

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
      localVue,
      vuetify,
      store,
      mocks: { $router, $route },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("QueryBuilderView");
  });
});
