import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import Countries from "@/components/Records/Record/GeneralInfo/Countries.vue";
import Record from "@/store/recordData.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      countries: "Country tooltip.",
    },
  },
};

Record.state.currentRecord["fairsharingRecord"] = {
  doi: "FAIRsharing.wibble",
  metadata: {
    year_creation: 1912,
  },
  subjects: [],
  domains: [],
  taxonomies: [],
  countries: [],
  userDefinedTags: [{ label: "a" }],
};
const $store = new Vuex.Store({
  modules: {
    record: Record,
    editor: editor,
  },
});

describe("Countries.vue", function () {
  let wrapper;

  // TODO: Mock properties in options {}.
  beforeEach(() => {
    wrapper = shallowMount(Countries, {
      localVue,
      vuetify,
      mocks: { $store },
      stubs: ["router-link"],
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Countries");
  });

  it("can sort countries", () => {
    Record.state.currentRecord["fairsharingRecord"]["countries"] = [
      { name: "Nantierre", id: 2, code: "NT" },
      { name: "Welfland", id: 1, code: "WL" },
    ];
    expect(wrapper.vm.sortCountries()).toStrictEqual([
      { name: "Welfland", id: 1, code: "WL" },
      { name: "Nantierre", id: 2, code: "NT" },
    ]);
  });
});
