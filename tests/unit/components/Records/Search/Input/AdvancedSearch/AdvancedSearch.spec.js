import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";

import AdvancedSearch from "@/components/Records/Search/Input/AdvancedSearch/AdvancedSearch.vue";

const { mockCommit } = vi.hoisted(() => {
  return { mockCommit: vi.fn() };
});
vi.mock("@/store", () => ({
  default: {
    commit: mockCommit,
  },
}));

describe("AdvancedSearch.vue", () => {
  let wrapper;
  const createWrapper = (props = {}, displayMock = {}) => {
    return shallowMount(AdvancedSearch, {
      props,
      global: {
        mocks: {
          $vuetify: {
            display: {
              lgAndDown: false,
              xl: false,
              mdAndDown: false,
              ...displayMock, // Override defaults with specific test cases
            },
          },
        },
        stubs: {
          "v-btn": true,
          "v-icon": true,
          AdvancedSearchDialogBox: true,
        },
      },
    });
  };

  beforeEach(() => {
    mockCommit.mockClear();
  });

  describe("Responsive Vuetify Classes and Sizes", () => {
    it("applies 'advancedTextXl' and 'x-large' size when showHomeSearch is false AND xl is true", () => {
      wrapper = createWrapper(
        { showHomeSearch: false },
        { xl: true, mdAndDown: false },
      );
      const btn = wrapper.findComponent({ name: "v-btn" });

      expect(btn.classes()).toContain("advancedTextXl");
      expect(btn.attributes("size")).toBe("x-large");
    });

    it("applies 'advancedTextMd' and 'large' size when showHomeSearch is false AND mdAndDown is true", () => {
      wrapper = createWrapper(
        { showHomeSearch: false },
        { xl: false, mdAndDown: true },
      );
      const btn = wrapper.findComponent({ name: "v-btn" });

      expect(btn.classes()).toContain("advancedTextMd");
      expect(btn.attributes("size")).toBe("large");
    });
  });

  describe("Methods and Store Commits", () => {
    it("triggers openAdvanceSearch when the Home Search (first) button is clicked", async () => {
      const wrapper = createWrapper({ showHomeSearch: true });
      const firstBtn = wrapper.findComponent({ name: "v-btn" });
      expect(firstBtn.classes()).toContain("px-6");
      await firstBtn.trigger("click");

      // 4. Assert our hoisted store mock was called correctly!
      expect(mockCommit).toHaveBeenCalledOnce();
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearchDialogStatus",
        true,
      );
    });
    it("commits to the advancedSearch store when openAdvanceSearch is called", () => {
      wrapper = createWrapper();

      // Trigger the method
      wrapper.vm.openAdvanceSearch();

      // 4. Assert directly against the standalone spy!
      expect(mockCommit).toHaveBeenCalledOnce();
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearchDialogStatus",
        true,
      );
    });

    it("triggers openAdvanceSearch when the button is clicked", async () => {
      wrapper = createWrapper();
      const btn = wrapper.findComponent({ name: "v-btn" });
      await btn.trigger("click");
      expect(mockCommit).toHaveBeenCalledOnce();
    });
  });
});
