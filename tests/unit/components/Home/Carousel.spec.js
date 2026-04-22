import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
    wrapper.vm.tabsData.selectedTab = 2;
    wrapper.vm.tabsData.tabs = ["A", "B", "C", "D"];
    wrapper.vm.cycleTabs();
    vi.advanceTimersByTime(5000);
    expect(wrapper.vm.tabsData.selectedTab).toBe(3);
  });

  it("handles tabsData.selectedTab tabs v-model updates", async () => {
    await wrapper.setData({ tabsData: { selectedTab: false } });
    const form = wrapper.findComponent({ name: "v-tabs" });
    expect(form.props("modelValue")).toBe(false);
    await form.vm.$emit("update:modelValue", true);
    expect(wrapper.vm.tabsData["selectedTab"]).toBe(true);
  });

  it("handles tabsData.selectedTab tabs-window v-model updates", async () => {
    await wrapper.setData({ tabsData: { selectedTab: false } });
    const form = wrapper.findComponent({ name: "v-tabs-window" });
    expect(form.props("modelValue")).toBe(false);
    await form.vm.$emit("update:modelValue", true);
    expect(wrapper.vm.tabsData["selectedTab"]).toBe(true);
  });
});
