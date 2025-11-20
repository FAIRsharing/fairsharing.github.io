import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import Licence from "@/views/Static/Licence/Licence";

const vuetify = new Vuetify();

describe("Licence.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Licence, {
      vuetify,
      stubs: ["router-link"],
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Licence");
  });
});
