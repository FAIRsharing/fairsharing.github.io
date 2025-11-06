import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import Stakeholders from "@/views/Static/Stakeholders/Stakeholders";

const vuetify = new Vuetify();

describe("Stakeholders.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Stakeholders, {
      vuetify,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Stakeholders");
  });
});
