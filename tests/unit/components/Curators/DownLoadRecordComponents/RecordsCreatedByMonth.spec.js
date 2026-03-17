import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import RecordsCreatedByMonth from "@/components/Curators/DownLoadRecordsComponents/RecordsCreatedByMonth.vue";

const { mockGetRecordCreatedByMonth } = vi.hoisted(() => ({
  mockGetRecordCreatedByMonth: vi.fn(),
}));

vi.mock("@/lib/Client/RESTClient", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getRecordCreatedByMonth: mockGetRecordCreatedByMonth,
    })),
  };
});

describe("RecordsCreatedByMonth.vue", () => {
  let wrapper;
  let store;

  beforeEach(() => {
    vi.clearAllMocks();
    store = new Vuex.Store({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({ credentials: { token: "TEST_TOKEN_XYZ" } }),
          },
        },
      },
    });
  });

  const createWrapper = () => {
    return shallowMount(RecordsCreatedByMonth, {
      global: {
        plugins: [store],
      },
    });
  };

  it("initializes, sets loading, and fetches data with token on mount", async () => {
    mockGetRecordCreatedByMonth.mockResolvedValue(["Jan: 10"]);
    wrapper = createWrapper();
    expect(wrapper.vm.loading).toBe(true);
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    expect(mockGetRecordCreatedByMonth).toHaveBeenCalledWith("TEST_TOKEN_XYZ");
    expect(wrapper.vm.loading).toBe(false);
  });

  it("formats valid data into a newline-separated string correctly", async () => {
    const apiResponse = [
      "January 2024: 10 records",
      "February 2024: 20 records",
    ];

    mockGetRecordCreatedByMonth.mockResolvedValue(apiResponse);

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    const expectedRawContent =
      "January 2024: 10 records\r\nFebruary 2024: 20 records";
    const expectedURI =
      "data:text/json;charset=utf-8," + encodeURIComponent(expectedRawContent);

    expect(wrapper.vm.downloadRecordsByMonth).toBe(expectedURI);
  });

  it("handles a single data item correctly", async () => {
    const apiResponse = ["March 2024: 5 records"];
    mockGetRecordCreatedByMonth.mockResolvedValue(apiResponse);

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    const expectedRawContent = "March 2024: 5 records";
    const expectedURI =
      "data:text/json;charset=utf-8," + encodeURIComponent(expectedRawContent);
    expect(wrapper.vm.downloadRecordsByMonth).toBe(expectedURI);
  });

  it("handles null or missing data gracefully", async () => {
    mockGetRecordCreatedByMonth.mockResolvedValue(null);
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    const expectedURI = "data:text/json;charset=utf-8,";
    expect(wrapper.vm.downloadRecordsByMonth).toBe(expectedURI);
  });
});
