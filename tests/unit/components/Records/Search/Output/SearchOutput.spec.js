import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import SearchOutput from "@/components/Records/Search/Output/SearchOutput.vue";
import recordsStore from "@/store/recordSearch.js";
import UIController from "@/store/uiController.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let $route = {
  path: "standards",
  query: {
    publications: "[123, 456]",
  },
  params: ["test"],
};

const $store = new Vuex.Store({
  modules: {
    records: recordsStore,
    uiController: UIController,
  },
});

describe("SearchOutput.vue", function () {
  let wrapper;

  wrapper = shallowMount(SearchOutput, {
    localVue,
    vuetify,
    mocks: { $store, $route },
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SearchOutput");
  });

  it("can check changeListType function", () => {
    wrapper.vm.changeListType(true);
    expect(wrapper.vm.isColumnList).toBe(true);
  });
});
