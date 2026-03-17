import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import CertificationsAndCommunityBadges from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/CertificationsAndCommunityBadges.vue";


let vuetify = createVuetify();

describe("CertificationsAndCommunityBadges", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(CertificationsAndCommunityBadges, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("CertificationsAndCommunityBadges");
  });
});
