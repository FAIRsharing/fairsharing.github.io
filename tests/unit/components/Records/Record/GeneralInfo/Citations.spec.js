import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueMoment from "vue-moment";
import Vuetify from "vuetify";
import Vuex from "vuex";

import Citations from "@/components/Records/Record/GeneralInfo/Citations.vue";
import Record from "@/store/recordData.js";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueMoment);
const vuetify = new Vuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      how_to_cite: "citation tooltip.",
    },
  },
};

Record.state.currentRecord["fairsharingRecord"] = {
  subjects: [],
  domains: [],
  taxonomies: [],
  userDefinedTags: [{ label: "a" }],
  metadata: { citations: [] },
  lastEditor: { username: "a user" },
};
const $store = new Vuex.Store({
  modules: {
    record: Record,
    editor: editor,
  },
});

describe("Citations.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Citations, {
      localVue,
      vuetify,
      mocks: { $store },
    });
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Citations");
  });
});
