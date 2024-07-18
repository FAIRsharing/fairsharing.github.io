import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import CertificationsAndCommunityBadges from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/CertificationsAndCommunityBadges.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("CertificationsAndCommunityBadges", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(CertificationsAndCommunityBadges, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("CertificationsAndCommunityBadges");
  });
});
