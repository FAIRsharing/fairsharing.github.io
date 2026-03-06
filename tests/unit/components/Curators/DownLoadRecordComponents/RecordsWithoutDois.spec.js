import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import RecordsWithoutDois from "@/components/Curators/DownLoadRecordsComponents/RecordsWithoutDois.vue";

const { mockGetRecordsWoDOIs } = vi.hoisted(() => ({
  mockGetRecordsWoDOIs: vi.fn(),
}));

vi.mock("@/lib/Client/RESTClient", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getRecordsWoDOIs: mockGetRecordsWoDOIs,
    })),
  };
});

describe("RecordsWithoutDois.vue", () => {
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
    return shallowMount(RecordsWithoutDois, {
      global: {
        plugins: [store],
      },
    });
  };

  it("initializes, sets loading, and fetches data with token on mount", async () => {
    mockGetRecordsWoDOIs.mockResolvedValue(["Record A"]);
    wrapper = createWrapper();
    expect(wrapper.vm.loading).toBe(true);
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    expect(mockGetRecordsWoDOIs).toHaveBeenCalledWith("TEST_TOKEN_123");
    expect(wrapper.vm.loading).toBe(false);
  });

  it("formats valid data into a newline-separated string correctly", async () => {
    const apiResponse = ["Record One", "Record Two", "Record Three"];

    mockGetRecordsWoDOIs.mockResolvedValue(apiResponse);

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    const expectedRawContent = "Record One\r\nRecord Two\r\nRecord Three";
    const expectedURI =
      "data:text/json;charset=utf-8," + encodeURIComponent(expectedRawContent);

    expect(wrapper.vm.downloadContent).toBe(expectedURI);
  });

  it("handles a single data item correctly", async () => {
    const apiResponse = ["Single Record"];
    mockGetRecordsWoDOIs.mockResolvedValue(apiResponse);

    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);

    const expectedRawContent = "Single Record";
    const expectedURI =
      "data:text/json;charset=utf-8," + encodeURIComponent(expectedRawContent);

    expect(wrapper.vm.downloadContent).toBe(expectedURI);
  });

  it("handles null or missing data gracefully", async () => {
    mockGetRecordsWoDOIs.mockResolvedValue(null);
    wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await new Promise(process.nextTick);
    const expectedURI = "data:text/json;charset=utf-8,";
    expect(wrapper.vm.downloadContent).toBe(expectedURI);
  });
});
