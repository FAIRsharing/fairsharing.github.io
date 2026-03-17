/* eslint-env jest */

import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import CommunityCarousel from "@/components/Home/CommunityCarousel";

const vuetify = createVuetify();

describe("CommunityCarousel", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CommunityCarousel, {
      vuetify,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("CommunityCarousel");
    const computed = wrapper.vm.$options.computed.responsiveSlideData;
    expect(
      computed.call({
        $vuetify: { display: { smAndUp: true } },
        logos: wrapper.vm.logos,
      }),
    ).toEqual(wrapper.vm.logos.multipleImageSlider);
    expect(
      computed.call({
        $vuetify: { display: { smAndUp: false } },
        logos: wrapper.vm.logos,
      }),
    ).toEqual(wrapper.vm.logos.singleImageSlider);
  });
});
