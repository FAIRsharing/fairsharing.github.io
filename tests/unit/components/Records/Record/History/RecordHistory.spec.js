import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import moment from "moment";
import RecordHistory from "@/components/Records/Record/History/RecordHistory.vue";

// Mock vue-json-pretty to prevent it from trying to render heavily in our unit tests
vi.mock("vue-json-pretty", () => ({
  default: {
    name: "VueJsonPretty",
    template: "<div>Mocked Json Pretty</div>",
  },
}));

describe("RecordHistory.vue", () => {
  let wrapper;

  // Generate some mock data to test pagination and switching tabs
  const mockHistory = [
    [
      "SubTab 1",
      [
        { date: "2023-01-01T10:00:00Z", event: "Created", user: "Alice" },
        { date: "2023-01-02T10:00:00Z", event: "Updated", user: "Bob" },
      ],
    ],
    [
      "SubTab 2",
      {
        0: { date: "2023-03-01T10:00:00Z", event: "Deleted" },
      }, // Testing the Object-to-Array conversion fallback
    ],
  ];

  // Generate 15 items to test pagination (perPage is 12)
  const mockLegacyLogs = Array.from({ length: 15 }, (_, i) => ({
    when: `2020-01-${String(i + 1).padStart(2, "0")}T10:00:00Z`,
    username: `User${i}`,
    diff: { change: i },
  }));

  const globalOptions = {
    stubs: {
      "v-tabs": true,
      "v-tab": true,
      "v-tabs-window": true,
      "v-tabs-window-item": true,
      "v-card": true,
      "v-card-text": true,
      "v-pagination": true,
      "v-switch": true,
      "v-expansion-panels": true,
      "v-expansion-panel": true,
      "v-expansion-panel-title": true,
      "v-expansion-panel-text": true,
      "v-icon": true,
      "vue-json-pretty": true,
    },
  };

  beforeEach(() => {
    wrapper = shallowMount(RecordHistory, {
      props: {
        history: mockHistory,
        legacyLogs: mockLegacyLogs,
      },
      global: globalOptions,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("mounts correctly and sets default data", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.selectedTab).toBe(0);
    expect(wrapper.vm.subTab).toBe(0);
    expect(wrapper.vm.page).toBe(1);
    expect(wrapper.vm.perPage).toBe(12);
  });

  it("handles selectedTab tabs v-model updates", async () => {
    await wrapper.setData({ selectedTab: false });
    const form = wrapper.findComponent({ name: "v-tabs" });
    expect(form.props("modelValue")).toBe(false);
    await form.vm.$emit("update:modelValue", true);
    expect(wrapper.vm.selectedTab).toBe(true);
  });

  it("handles selectedTab tabs-window v-model updates", async () => {
    await wrapper.setData({ selectedTab: false });
    const form = wrapper.findComponent({ name: "v-tabs-window" });
    expect(form.props("modelValue")).toBe(false);
    await form.vm.$emit("update:modelValue", true);
    expect(wrapper.vm.selectedTab).toBe(true);
  });

  describe("Props: history and legacyLogs", () => {
    it("provides an empty array as the default for history", () => {
      const localWrapper = shallowMount(RecordHistory, {
        global: globalOptions,
      });

      expect(localWrapper.vm.history).toStrictEqual([]);
      expect(Array.isArray(localWrapper.vm.history)).toBe(true);
    });

    it("provides an empty array as the default for legacyLogs", () => {
      const localWrapper = shallowMount(RecordHistory, {
        global: globalOptions,
      });
      expect(localWrapper.vm.legacyLogs).toStrictEqual([]);
      expect(Array.isArray(localWrapper.vm.legacyLogs)).toBe(true);
    });
  });

  describe("Computed: activeRawData", () => {
    it("returns correctly formatted array for selectedTab 0 (History)", () => {
      // Subtab 0 is an Array
      expect(wrapper.vm.activeRawData.length).toBe(2);
      expect(wrapper.vm.activeRawData[0].user).toBe("Alice");
    });

    it("converts an Object into an Array for selectedTab 0 if needed", async () => {
      // Switch to subtab 1, which is provided as an Object in our mock
      await wrapper.setData({ subTab: 1 });
      const activeData = wrapper.vm.activeRawData;

      expect(Array.isArray(activeData)).toBe(true);
      expect(activeData.length).toBe(1);
      expect(activeData[0].event).toBe("Deleted");
    });

    it("returns legacyLogs when selectedTab is 1 (Legacy)", async () => {
      await wrapper.setData({ selectedTab: 1 });
      expect(wrapper.vm.activeRawData.length).toBe(15);
      expect(wrapper.vm.activeRawData[0].username).toBe("User0");
    });

    it("returns an empty array if data is missing", async () => {
      await wrapper.setProps({ history: [] });
      expect(wrapper.vm.activeRawData).toStrictEqual([]);
    });
  });

  describe("Computed: maxPage", () => {
    it("calculates 1 page when items are less than perPage", () => {
      // Subtab 0 has 2 items, perPage is 12
      expect(wrapper.vm.maxPage).toBe(1);
    });

    it("calculates multiple pages correctly", async () => {
      // Switch to legacy logs (15 items), perPage is 12 -> Should be 2 pages
      await wrapper.setData({ selectedTab: 1 });
      expect(wrapper.vm.maxPage).toBe(2);
    });
  });

  describe("Computed: paginatedData", () => {
    it("slices data correctly for page 1", async () => {
      await wrapper.setData({ selectedTab: 1, reverseDate: false });
      const page1Data = wrapper.vm.paginatedData;

      expect(page1Data.length).toBe(12); // Should take the first 12 out of 15
      expect(page1Data[0].username).toBe("User0"); // First item
      expect(page1Data[11].username).toBe("User11"); // 12th item
    });

    it("slices data correctly for page 2", async () => {
      await wrapper.setData({ selectedTab: 1, page: 2, reverseDate: false });
      await wrapper.setData({ page: 2 });
      const page2Data = wrapper.vm.paginatedData;

      expect(page2Data.length).toBe(3); // The remaining 3 items
      expect(page2Data[0].username).toBe("User12");
      expect(page2Data[2].username).toBe("User14");
    });

    it("reverses the data when reverseDate is true", async () => {
      await wrapper.setData({ selectedTab: 0, subTab: 0, reverseDate: true });
      const reversedData = wrapper.vm.paginatedData;

      // In mock data: Index 0 is Alice, Index 1 is Bob.
      // Reversed: Index 0 should be Bob.
      expect(reversedData[0].user).toBe("Bob");
      expect(reversedData[1].user).toBe("Alice");
    });
  });

  describe("Watchers", () => {
    it("resets panels when page changes", async () => {
      await wrapper.setData({ currentPanel: [1], legacyPanels: [2] });
      await wrapper.setData({ page: 2 });

      expect(wrapper.vm.currentPanel).toStrictEqual([]);
      expect(wrapper.vm.legacyPanels).toStrictEqual([]);
    });

    it("resets panels and sets page to 1 when selectedTab changes", async () => {
      await wrapper.setData({ currentPanel: [1], legacyPanels: [2], page: 3 });
      await wrapper.setData({ selectedTab: 1 });

      expect(wrapper.vm.currentPanel).toStrictEqual([]);
      expect(wrapper.vm.legacyPanels).toStrictEqual([]);
      expect(wrapper.vm.page).toBe(1);
    });

    it("resets panels and sets page to 1 when subTab changes", async () => {
      await wrapper.setData({ currentPanel: [1], legacyPanels: [2], page: 3 });
      await wrapper.setData({ subTab: 1 });

      expect(wrapper.vm.currentPanel).toStrictEqual([]);
      expect(wrapper.vm.legacyPanels).toStrictEqual([]);
      expect(wrapper.vm.page).toBe(1);
    });

    it("resets panels and sets page to 1 when reverseDate changes", async () => {
      await wrapper.setData({ currentPanel: [1], legacyPanels: [2], page: 2 });
      await wrapper.setData({ reverseDate: false });

      expect(wrapper.vm.currentPanel).toStrictEqual([]);
      expect(wrapper.vm.legacyPanels).toStrictEqual([]);
      expect(wrapper.vm.page).toBe(1);
    });
  });

  describe("Methods: formatDate", () => {
    it("returns an empty string if value is falsy", () => {
      expect(wrapper.vm.formatDate(null)).toBe("");
      expect(wrapper.vm.formatDate(undefined)).toBe("");
      expect(wrapper.vm.formatDate("")).toBe("");
    });

    it("formats the date using moment according to dateFormat", () => {
      const inputDate = "2023-10-05T14:30:00Z";
      const expectedOutput = moment(inputDate).format(wrapper.vm.dateFormat);

      expect(wrapper.vm.formatDate(inputDate)).toBe(expectedOutput);
    });
  });
});
