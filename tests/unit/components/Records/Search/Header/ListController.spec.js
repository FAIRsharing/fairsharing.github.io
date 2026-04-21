import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import ListController from "@/components/Records/Search/Header/ListController.vue";
import recordsStore from "@/store/recordSearch.js";

const vuetify = createVuetify();

const $store = new Vuex.Store({
  modules: {
    records: recordsStore,
  },
});

describe("ListController.vue", function () {
  let wrapper;

  wrapper = shallowMount(ListController, {
    vuetify,
    props: {
      options: {
        type: Object,
        default: null,
      },
    },
    mocks: { $store },
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ListController");
  });

  it("can check changeListType function", () => {
    wrapper.vm.changeListType("stackList");
    expect(wrapper.vm.isColumnList).toBe(false);
    wrapper.vm.changeListType("columnList");
    expect(wrapper.vm.isColumnList).toBe(true);
  });
});
