import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import Carousel from "@/components/Home/Carousel";

const vuetify = createVuetify();

describe("Carousel", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Carousel, {
      vuetify,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Carousel");
  });

  it("can cycle through tabs", () => {
    vi.useFakeTimers();
    expect(wrapper.vm.tabsData.selectedTab).toBe(0);
    wrapper.vm.tabsData.selectedTab = 6;
    wrapper.vm.cycleTabs();
    vi.advanceTimersByTime(5000);
    expect(wrapper.vm.tabsData.selectedTab).toBe(6);
    wrapper.vm.cycleTabs();
    vi.advanceTimersByTime(5000);
    expect(wrapper.vm.tabsData.selectedTab).toBe(0);
    wrapper.vm.tabsData.selectedTab = 3;
    wrapper.vm.cycleTabs();
    expect(wrapper.vm.tabsData.selectedTab).toBe(3);
  });
});
