import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import CommunityCarousel from "@/components/Home/CommunityCarousel";

const vuetify = createVuetify();
let breakpoint = {
  init: jest.fn(),
  framework: {},
  smAndUp: true,
};
vuetify.framework.breakpoint = breakpoint;

describe("CommunityCarousel", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CommunityCarousel, {
      vuetify,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("CommunityCarousel");
    breakpoint = {
      init: jest.fn(),
      framework: {},
      smAndUp: false,
    };
    vuetify.framework.breakpoint = breakpoint;
    const wrapper2 = shallowMount(CommunityCarousel, {
      vuetify,
    });
    expect(wrapper2.vm.$options.name).toMatch("CommunityCarousel");
  });
});
