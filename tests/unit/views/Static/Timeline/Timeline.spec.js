import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import Home from "@/views/Static/Timeline/Timeline";

const vuetify = createVuetify();

describe("Timeline.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Home, {
      vuetify,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Timeline");
  });
});
