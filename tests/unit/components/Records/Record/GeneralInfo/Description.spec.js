import { shallowMount  } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Description from "@/components/Records/Record/GeneralInfo/Description.vue";
import Record from "@/store/recordData.js";

const vuetify = createVuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      description: "description tooltip.",
    },
  },
};

Record.state.currentRecord["fairsharingRecord"] = {
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

describe("Registry.vue", function () {
  let wrapper;

  // TODO: Mock properties in options {}.
  beforeEach(() => {
    wrapper = shallowMount(Description, {
      vuetify,
      mocks: { $store },
    });
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Description");
  });
});
