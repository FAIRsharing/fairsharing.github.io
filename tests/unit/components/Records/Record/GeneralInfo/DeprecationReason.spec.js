import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DeprecationReason from "@/components/Records/Record/GeneralInfo/DeprecationReason.vue";
import Record from "@/store/recordData.js";

const vuetify = createVuetify();

Record.state.currentRecord.fairsharingRecord.metadata = {
  deprecation_reason: "some deprecation reason...",
  deprecation_date: "1912-04-15",
};
const $store = new Vuex.Store({
  modules: {
    record: Record,
  },
});

describe("Citations.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DeprecationReason, {
      vuetify,
      mocks: { $store },
      global: {
        directives: {
          linkified: {},
        },
      },
    });
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("DeprecationReason");
  });

  it("shows deprecation reason", () => {
    let reason =
      wrapper.vm.currentRecord.fairsharingRecord.metadata["deprecation_reason"];
    let date =
      wrapper.vm.currentRecord.fairsharingRecord.metadata["deprecation_date"];
    expect(wrapper.vm.getReason()).toEqual(
      "This record was deprecated on " +
        date +
        " for the following reason(s): " +
        reason,
    );
  });
});
