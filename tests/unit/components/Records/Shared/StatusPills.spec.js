import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import StatusPills from "@/components/Records/Shared/StatusPills.vue";
import light from "@/plugins/theme";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "fairSharingTheme",
    themes: { fairSharingTheme: light },
  },
});
let wrapper;

describe("StatusPills.vue", () => {
  beforeAll(() => {
    wrapper = shallowMount(StatusPills, {
      vuetify,
      props: {
        status: "ready",
      },
    });
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("StatusPills");
  });
});
