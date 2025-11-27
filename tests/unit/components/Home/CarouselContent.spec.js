import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import CarouselContent from "@/components/Home/CarouselContent";

const vuetify = new Vuetify();

describe("TabContent.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CarouselContent, {
      vuetify,
      stubs: ["router-link"],
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("CarouselContent");
  });
});
