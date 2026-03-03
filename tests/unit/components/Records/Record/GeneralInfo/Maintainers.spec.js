import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import Maintainers from "@/components/Records/Record/GeneralInfo/Maintainers.vue";
import Record from "@/store/recordData.js";
import users from "@/store/users";

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      maintainers: "maintainer tooltip.",
    },
  },
};

Record.state.currentRecord["fairsharingRecord"] = {
  doi: "FAIRsharing.wibble",
  subjects: [],
  domains: [],
  taxonomies: [],
  userDefinedTags: [{ label: "a" }],
  maintainers: [],
};
const $store = new Vuex.Store({
  modules: {
    record: Record,
    users,
    editor: editor,
  },
});

describe("Maintainers.vue", function () {
  let wrapper;

  // TODO: Mock properties in options {}.
  beforeEach(() => {
    wrapper = shallowMount(Maintainers, {
      global: {
        plugins: [$store],
        mocks: {
          $vuetify: { display: { smAndDown: false } },
          $route: { params: { id: "123" } },
        },
        stubs: {
          "router-link": true,
          RouterLink: true,
          Icon: true,
        },
      },
    });
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Maintainers");
  });
});
