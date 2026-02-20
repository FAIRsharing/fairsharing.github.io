import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import CuratorSummaryStatistics from "@/components/Curators/DownLoadRecordsComponents/CuratorSummaryStatistics.vue";

// vi.hoisted ensures the mock instance is created before vi.mock() runs.
const { mockClientInstance } = vi.hoisted(() => {
  return {
    mockClientInstance: {
      setHeader: vi.fn(),
      executeQuery: vi.fn(),
    },
  };
});

vi.mock("@/lib/GraphClient/GraphClient", () => {
  return {
    default: vi.fn().mockImplementation(() => mockClientInstance),
  };
});

describe("CuratorSummaryStatistics.vue", () => {
  let wrapper;
  let store;

  beforeEach(() => {
    vi.clearAllMocks();
    store = new Vuex.Store({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({ credentials: { token: "TEST_TOKEN" } }),
          },
        },
      },
    });
  });

  const createWrapper = () => {
    return shallowMount(CuratorSummaryStatistics, {
      global: {
        plugins: [store],
      },
    });
  };

  it("initializes, sets header, and fetches data on mount", async () => {
    mockClientInstance.executeQuery.mockResolvedValue({
      curatorSummaryStatistics: ["Stat A", "Stat B"],
    });

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    expect(mockClientInstance.setHeader).toHaveBeenCalledWith("TEST_TOKEN");

    expect(mockClientInstance.executeQuery).toHaveBeenCalled();
    expect(wrapper.vm.loading).toBe(false);
  });

  it("correctly formats and encodes the download content", async () => {
    const mockData = {
      curatorSummaryStatistics: ["Line 1", "Line 2"],
    };
    mockClientInstance.executeQuery.mockResolvedValue(mockData);

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    const expectedContent =
      "data:text/json;charset=utf-8," + encodeURIComponent("Line 1\nLine 2");

    expect(wrapper.vm.downloadCuratorContent).toBe(expectedContent);
  });

  it("handles empty or missing statistics gracefully (Edge Case)", async () => {
    const mockData = {};
    mockClientInstance.executeQuery.mockResolvedValue(mockData);

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    const expectedContent =
      "data:text/json;charset=utf-8," + encodeURIComponent("");

    expect(wrapper.vm.downloadCuratorContent).toBe(expectedContent);
  });
});
