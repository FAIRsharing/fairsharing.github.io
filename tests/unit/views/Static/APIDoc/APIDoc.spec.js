import { shallowMount } from "@vue/test-utils";
import VueCodeHighlight from "vue-code-highlight";
import { createVuetify } from "vuetify";

import APIDoc from "@/views/Static/APIDoc/APIDoc";

const vuetify = createVuetify();

describe("APIDoc.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(APIDoc, {
      vuetify,
      components: { VueCodeHighlight },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("APIDoc");
  });
});
