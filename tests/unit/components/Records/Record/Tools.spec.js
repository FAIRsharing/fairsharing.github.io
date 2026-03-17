import { shallowMount  } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Tools from "@/components/Records/Record/Tools.vue";
import Record from "@/store/recordData.js";

const vuetify = createVuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      tools: "tools tooltip.",
    },
  },
};

Record.state.currentRecord["fairsharingRecord"] = {
  metadata: {
    associated_tools: [{ url: "http://url.com", name: "name" }],
  },
  taxonomies: [{ label: "Turdus turdus" }],
  subjects: [{ label: "Javascript Fun" }],
  domains: [{ label: "Deneb" }],
  userDefinedTags: [{ label: "a" }],
};
const $store = new Vuex.Store({
  modules: {
    record: Record,
    editor: editor,
  },
});

describe("Tools.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Tools, {
      vuetify,
      mocks: { $store },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Tools");
  });

  it("doesn't display if there are no tools to display", () => {
    expect(wrapper.vm.showTools()).toBe(true);
    Record.state.currentRecord.fairsharingRecord.metadata.associated_tools = [];
    expect(wrapper.vm.showTools()).toBe(false);
  });
});
