import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";

import SearchInput from "@/components/Records/Search/Input/SearchInput"
import searchFiltersStore from "@/store/searchFilters.js";
import uiControllerStore from "@/store/uiController.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let $route = {
  name: "search",
  query: {}
};

const $router = {
  push: jest.fn(),
};

const $store = new Vuex.Store({
  modules: {
    searchFilters: searchFiltersStore,
    uiController: uiControllerStore,
  }
});

describe("FilterPanel.vue", function () {
  let wrapper;

  wrapper = shallowMount(SearchInput, {
    localVue,
    vuetify,
    mocks: {$store, $router, $route}
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SearchInput");
    expect(wrapper.vm.responsiveClassObject).toStrictEqual({
      'filters-holder-default': true,
      'filters-holder-after-scroll': false
    });
  });

  it("can check setup function", () => {
    $store.state.searchFilters.filters.push({filterName: 'filterNameTest', filterLabel: 'filterLabelTest'});
    wrapper.vm.setPanel();
    wrapper.vm.createIndexForFilters();
  });

  it("can check resetPanel", () => {
    wrapper.vm.resetPanel();
    expect(wrapper.vm.panel).toStrictEqual([])
  });

  it("sorts filterbuttons into the correct order", () => {
    $store.state.searchFilters.filters.push({filterName: 'countries', filterLabel: 'countryLabel', 'sortOrder': 2});
    $store.state.searchFilters.filters.push({filterName: 'domains', filterLabel: 'domainLabel', 'sortOrder': 1});
    $store.state.searchFilters.filters.push({filterName: 'subjects', filterLabel: 'subjectLabel', 'sortOrder': 0});
    expect($store.state.searchFilters.filters.length).toEqual(4);
    let sorted = wrapper.vm.getFilters.sort(wrapper.vm.compareLabels);
    expect(sorted[0]['filterName']).toEqual('subjects');
    expect(sorted[1]['filterName']).toEqual('domains');
    expect(sorted[2]['filterName']).toEqual('countries');
    expect(sorted[3]['filterName']).toEqual('filterNameTest');
  });

});
