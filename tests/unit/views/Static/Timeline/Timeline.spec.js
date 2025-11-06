import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import Home from "@/views/Static/Timeline/Timeline";

const vuetify = new Vuetify();

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
