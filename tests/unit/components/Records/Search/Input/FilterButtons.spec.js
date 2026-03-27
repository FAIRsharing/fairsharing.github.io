import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import FilterButtons from "@/components/Records/Search/Input/FilterButtons.vue";
import searchFilters from "@/store/searchFilters.js";
import users from "@/store/users.js";

const vuetify = createVuetify();

describe("FilterButtons.vue", function () {
  const getWrapper = () => {
    const $store = new Vuex.Store({
      modules: {
        users: users,
        searchFilters: searchFilters,
      },
    });

    return {
      $store,
      wrapper: shallowMount(FilterButtons, {
        vuetify,
        mocks: { $store },
      }),
    };
  };

  it("can be instantiated", () => {
    const { wrapper } = getWrapper();
    expect(wrapper.vm.$options.name).toMatch("FilterButtons");
  });

  it("shows everything to curators", () => {
    const { $store, wrapper } = getWrapper();
    $store.state.searchFilters.filterButtons = [
      {
        data: [],
        curator_only: true,
      },
      {
        data: [],
        curator_only: false,
      },
    ];
    $store.state.users.user = function () {
      return { is_curator: true };
    };
    expect(wrapper.vm.allowedFilterButtons.length).toEqual(2);
    $store.state.users.user = function () {
      return { is_curator: false };
    };
    expect(wrapper.vm.allowedFilterButtons.length).toEqual(1);
  });
});
