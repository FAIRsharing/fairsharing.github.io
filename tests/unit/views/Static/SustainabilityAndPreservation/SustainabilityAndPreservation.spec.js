import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import PreservationPolicy from "@/views/Static/SustainabilityAndPreservation/SustainabilityAndPreservation.vue";

const vuetify = createVuetify();

describe("SustainabilityAndPreservation.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PreservationPolicy, {
      vuetify,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SustainabilityAndPreservation");
  });
});
