import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import Carousel from "@/components/Home/Carousel";

const vuetify = new Vuetify();

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
    jest.useFakeTimers();
    expect(wrapper.vm.tabsData.selectedTab).toBe(0);
    wrapper.vm.tabsData.selectedTab = 6;
    wrapper.vm.cycleTabs();
    jest.advanceTimersByTime(5000);
    expect(wrapper.vm.tabsData.selectedTab).toBe(6);
    wrapper.vm.cycleTabs();
    jest.advanceTimersByTime(5000);
    expect(wrapper.vm.tabsData.selectedTab).toBe(0);
    wrapper.vm.tabsData.selectedTab = 3;
    wrapper.vm.cycleTabs();
    expect(wrapper.vm.tabsData.selectedTab).toBe(3);
  });
});
