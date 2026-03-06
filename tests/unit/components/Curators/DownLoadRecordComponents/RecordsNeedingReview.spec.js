import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import RecordsNeedingReview from "@/components/Curators/DownLoadRecordsComponents/RecordsNeedingReview.vue";

// We hoist the mock instance so it's available before the module import
const { mockClientInstance } = vi.hoisted(() => ({
  mockClientInstance: {
    setHeader: vi.fn(),
    executeQuery: vi.fn(),
  },
}));

vi.mock("@/lib/GraphClient/GraphClient", () => {
  return {
    default: vi.fn().mockImplementation(() => mockClientInstance),
  };
});

describe("RecordsNeedingReview.vue", () => {
  let wrapper;
  let store;

  beforeEach(() => {
    vi.clearAllMocks();
    store = new Vuex.Store({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({ credentials: { token: "TEST_TOKEN_ABC" } }),
          },
        },
      },
    });
  });

  const createWrapper = () => {
    return shallowMount(RecordsNeedingReview, {
      global: {
        plugins: [store],
      },
    });
  };

  it("initializes, sets header, and fetches data on mount", async () => {
    mockClientInstance.executeQuery.mockResolvedValue({
      needsReview: ["Record 1", "Record 2"],
    });

    wrapper = createWrapper();
    expect(wrapper.vm.loading).toBe(true);
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    expect(mockClientInstance.setHeader).toHaveBeenCalledWith("TEST_TOKEN_ABC");
    expect(mockClientInstance.executeQuery).toHaveBeenCalled();
    expect(wrapper.vm.loading).toBe(false);
  });

  it("formats valid data into a newline-separated string correctly", async () => {
    const mockData = {
      needsReview: ["Record One", "Record Two", "Record Three"],
    };
    mockClientInstance.executeQuery.mockResolvedValue(mockData);

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    const rawContent = "Record One\nRecord Two\nRecord Three";
    const expectedURI =
      "data:text/json;charset=utf-8," + encodeURIComponent(rawContent);

    expect(wrapper.vm.downloadReviewContent).toBe(expectedURI);
  });

  it("handles empty or missing data gracefully", async () => {
    mockClientInstance.executeQuery.mockResolvedValue({});

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    const expectedURI =
      "data:text/json;charset=utf-8," + encodeURIComponent("");
    expect(wrapper.vm.downloadReviewContent).toBe(expectedURI);
  });
});
