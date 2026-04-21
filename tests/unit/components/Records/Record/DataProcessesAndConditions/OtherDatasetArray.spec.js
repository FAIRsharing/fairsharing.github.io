import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import OtherDatasetArray from "@/components/Records/Record/DataProcessesAndConditions/OtherDatasetArray";

const vuetify = createVuetify();

describe("OtherDatasetArray.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(OtherDatasetArray, {
      vuetify,
    });
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("OtherDatasetArray");
  });
});
