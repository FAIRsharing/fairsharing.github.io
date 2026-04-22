import { shallowMount } from "@vue/test-utils";
import VueCodeHighlight from "vue-code-highlight";
import { createVuetify } from "vuetify";

import CommunityCuration from "@/views/Static/CommunityCuration/CommunityCuration";

const vuetify = createVuetify();

describe("CommunityCuration.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CommunityCuration, {
      global: {
        plugins: [vuetify],
        components: {
          VueCodeHighlight,
        },
        stubs: {
          PieChart: true,
        },
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("CommunityCuration");
  });
});
