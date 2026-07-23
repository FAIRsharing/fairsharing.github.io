import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import Documentation from "@/views/Static/Documentation/Documentation";

const vuetify = createVuetify();

describe("Documentation.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Documentation, {
      vuetify,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Documentation");
  });
});
