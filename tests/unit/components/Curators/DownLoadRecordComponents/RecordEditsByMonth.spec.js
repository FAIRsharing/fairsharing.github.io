import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import RecordEditsByMonth from "@/components/Curators/DownLoadRecordsComponents/RecordEditsByMonth.vue";

const { mockGetEditByMonth } = vi.hoisted(() => ({
  mockGetEditByMonth: vi.fn(),
}));

// 2. Mock RestClient
vi.mock("@/lib/Client/RESTClient", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getEditByMonth: mockGetEditByMonth,
    })),
  };
});

describe("RecordEditsByMonth.vue", () => {
  let wrapper;
  let store;

  beforeEach(() => {
    vi.clearAllMocks();

    store = new Vuex.Store({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({ credentials: { token: "TEST_TOKEN_123" } }),
          },
        },
      },
    });
  });

  const createWrapper = () => {
    return shallowMount(RecordEditsByMonth, {
      global: {
        plugins: [store],
      },
    });
  };

  it("initializes, sets loading, and fetches data with token on mount", async () => {
    mockGetEditByMonth.mockResolvedValue(["Jan: 1"]);
    wrapper = createWrapper();
    expect(wrapper.vm.loading).toBe(true);
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    expect(mockGetEditByMonth).toHaveBeenCalledWith("TEST_TOKEN_123");
    expect(wrapper.vm.loading).toBe(false);
  });

  it("formats valid data into a newline-separated string correctly", async () => {
    // Input Data: Array of strings
    const apiResponse = ["January 2023: 15 edits", "February 2023: 30 edits"];

    mockGetEditByMonth.mockResolvedValue(apiResponse);

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);

    const expectedRawContent =
      "January 2023: 15 edits\r\nFebruary 2023: 30 edits";
    const expectedURI =
      "data:text/json;charset=utf-8," + encodeURIComponent(expectedRawContent);

    expect(wrapper.vm.downloadEditsByMonth).toBe(expectedURI);
  });

  it("handles a single data item correctly (no commas to replace)", async () => {
    const apiResponse = ["March 2023: 5 edits"];
    mockGetEditByMonth.mockResolvedValue(apiResponse);

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);

    const expectedRawContent = "March 2023: 5 edits";
    const expectedURI =
      "data:text/json;charset=utf-8," + encodeURIComponent(expectedRawContent);

    expect(wrapper.vm.downloadEditsByMonth).toBe(expectedURI);
  });

  it("handles null or missing data gracefully", async () => {
    mockGetEditByMonth.mockResolvedValue(null);
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    const expectedURI = "data:text/json;charset=utf-8,";
    expect(wrapper.vm.downloadEditsByMonth).toBe(expectedURI);
  });
});
