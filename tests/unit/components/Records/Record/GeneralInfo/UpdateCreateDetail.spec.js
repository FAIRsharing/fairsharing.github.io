import { shallowMount  } from "@vue/test-utils";
import VueMoment from "vue-moment";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import UpdateCreateDetail from "@/components/Records/Record/GeneralInfo/UpdateCreateDetail.vue";
import Record from "@/store/recordData.js";

const vuetify = createVuetify();

Record.state.currentRecord["fairsharingRecord"] = {
  doi: "FAIRsharing.wibble",
  subjects: [],
  domains: [],
  taxonomies: [],
  userDefinedTags: [{ label: "a" }],
};
const $store = new Vuex.Store({
  modules: {
    record: Record,
  },
});

describe("UpdateCreateDetail.vue", function () {
  let wrapper;

  // TODO: Mock properties in options {}.
  beforeEach(() => {
    wrapper = shallowMount(UpdateCreateDetail, {
      vuetify,
      mocks: { $store },
    });
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("UpdateCreateDetail");
  });
});
