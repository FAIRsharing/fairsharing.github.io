import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import ReferenceURL from "@/components/Records/Record/GeneralInfo/ReferenceURL.vue";
import Record from "@/store/recordData.js";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      reference_url: "description tooltip.",
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
  userDefinedTags: [{ label: "a" }],
};
const $store = new Vuex.Store({
  modules: {
    record: Record,
    editor: editor,
  },
});

describe("ReferenceURL.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ReferenceURL, {
      localVue,
      vuetify,
      mocks: { $store },
    });
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ReferenceURL");
  });
});
