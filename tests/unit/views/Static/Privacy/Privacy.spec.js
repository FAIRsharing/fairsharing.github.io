import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import Privacy from "@/views/Static/Privacy/Privacy";

const vuetify = new Vuetify();

describe("Privacy.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Privacy, {
      vuetify,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Privacy");
  });
});
