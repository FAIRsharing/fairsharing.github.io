import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import StatisticsBlock from "@/components/Home/StatisticsBlock";
import RestClient from "@/lib/Client/RESTClient.js";

const vuetify = createVuetify();

describe("StatisticsBlock.vue", () => {
  let wrapper;
  let getStatisticsSpy;

  beforeEach(() => {
    getStatisticsSpy = vi.spyOn(RestClient.prototype, "getStatisticsData");

    getStatisticsSpy.mockResolvedValue({
      resources: 33,
      contributors: 3,
      views: 1,
    });

    wrapper = shallowMount(StatisticsBlock, {
      global: {
        plugins: [vuetify],
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    wrapper?.unmount();
    vi.restoreAllMocks();
  });

  // Component initialization
  it("can be instantiated with initial statistics and content", () => {
    expect(wrapper.vm.$options.name).toBe("StatisticsBlock");
  });

  // Successful API response
  it("loads statistics from the REST client and updates counters", async () => {
    const animateSpy = vi
      .spyOn(wrapper.vm, "updateStaticsData")
      .mockImplementation(() => {});
    await wrapper.vm.getStatisticsCount();
    expect(getStatisticsSpy).toHaveBeenCalled();
    expect(wrapper.vm.statsData).toEqual({
      resources: 33,
      contributors: 3,
      views: 1,
    });
    expect(animateSpy).toHaveBeenCalled();
  });

  // Number formatting
  it.each([
    [999, 999],
    [10000, "10K"],
    [15500, "16K"],
    [1000000, "1M"],
    [2500000, "3M"],
    [1000000000, "1B"],
    [2500000000, "3B"],
  ])("formats %s as %s", (input, expected) => {
    expect(wrapper.vm.updateNumbers(input)).toBe(expected);
  });
});
