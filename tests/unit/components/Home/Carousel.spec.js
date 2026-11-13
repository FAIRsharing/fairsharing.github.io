import { shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";

import Carousel from "@/components/Home/Carousel";

const vuetify = createVuetify();

describe("Carousel", function () {
  let wrapper;

  beforeEach(() => {
    vi.useFakeTimers();
    wrapper = shallowMount(Carousel, {
      vuetify,
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Carousel");
  });

  it("can cycle through tabs", async () => {
    expect(wrapper.vm.tabsData.selectedTab).toBe(0);
    await vi.advanceTimersByTimeAsync(8000);
    expect(wrapper.vm.tabsData.selectedTab).toBe(1);
    wrapper.vm.tabsData.selectedTab = wrapper.vm.tabsData.tabs.length - 1;
    await vi.advanceTimersByTimeAsync(8000);
    expect(wrapper.vm.tabsData.selectedTab).toBe(0);
    wrapper.vm.tabsData.selectedTab = 3;
    await vi.advanceTimersByTimeAsync(7999);
    expect(wrapper.vm.tabsData.selectedTab).toBe(3);
    await vi.advanceTimersByTimeAsync(1);
    expect(wrapper.vm.tabsData.selectedTab).toBe(4);
    wrapper.vm.tabsData.selectedTab = 2;
    wrapper.vm.tabsData.tabs = wrapper.vm.tabsData.tabs.slice(0, 4);
    await vi.advanceTimersByTimeAsync(8000);
    expect(wrapper.vm.tabsData.selectedTab).toBe(3);
    await vi.advanceTimersByTimeAsync(8000);
    expect(wrapper.vm.tabsData.selectedTab).toBe(0);
  });

  it("handles tabsData.selectedTab tabs v-model updates", async () => {
    await wrapper.setData({ tabsData: { selectedTab: 0 } });
    const form = wrapper.findComponent({ name: "v-tabs" });
    expect(form.props("modelValue")).toBe(0);
    await form.vm.$emit("update:modelValue", 2);
    expect(wrapper.vm.tabsData["selectedTab"]).toBe(2);
  });

  it("handles tabsData.selectedTab tabs-window v-model updates", async () => {
    await wrapper.setData({ tabsData: { selectedTab: 0 } });
    const form = wrapper.findComponent({ name: "v-tabs-window" });
    expect(form.props("modelValue")).toBe(0);
    await form.vm.$emit("update:modelValue", 2);
    expect(wrapper.vm.tabsData["selectedTab"]).toBe(2);
  });
});
