import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { ref } from "vue";

import AdvancedSearch from "@/components/Records/Search/Input/AdvancedSearch/AdvancedSearch.vue";

// 1. Setup reactive references we can alter dynamically inside individual tests
const mockXl = ref(false);
const mockMdAndDown = ref(false);

// 2. Mock 'useDisplay' from Vuetify directly to control composition API output
vi.mock("vuetify", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useDisplay: () => ({
      xl: mockXl,
      mdAndDown: mockMdAndDown,
    }),
  };
});

// 3. Mock the Vuex store commit tracking via hoisted architecture
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

  const createWrapper = (props = {}) => {
    return shallowMount(AdvancedSearch, {
      props,
      global: {
        mocks: {
          // Keep fallback store binding if component pulls globally outside Vuex plugin mapping
          $store: {
            commit: mockCommit,
          },
        },
        stubs: {
          "v-btn": {
            template: '<button class="v-btn-stub"><slot /></button>',
          },
          "v-icon": true,
          AdvancedSearchDialogBox: true,
        },
      },
    });
  };

  beforeEach(() => {
    mockCommit.mockClear();
    // Reset reactive display behaviors back to default states
    mockXl.value = false;
    mockMdAndDown.value = false;
  });

  describe("Responsive Vuetify Sizes", () => {
    it("applies 'x-large' size when showHomeSearch is false AND xl display is true", async () => {
      mockXl.value = true;
      mockMdAndDown.value = false;

      wrapper = createWrapper({ showHomeSearch: false });
      await wrapper.vm.$nextTick();

      const btn = wrapper.find(".v-btn-stub");

      expect(btn.attributes("size")).toBe("x-large");
      expect(btn.classes()).toContain("advanced-header-btn");
    });

    it("applies 'large' size when showHomeSearch is false AND mdAndDown display is true", async () => {
      mockXl.value = false;
      mockMdAndDown.value = true;

      wrapper = createWrapper({ showHomeSearch: false });

      // Wait for the mounted() hook data mutation (isMounted = true) to re-render the DOM template updates
      await wrapper.vm.$nextTick();

      const btn = wrapper.find(".v-btn-stub");

      expect(btn.attributes("size")).toBe("large");
      expect(btn.classes()).toContain("advanced-header-btn");
    });
  });

  describe("Methods and Store Commits", () => {
    it("triggers openAdvanceSearch when the Home Search button is clicked", async () => {
      wrapper = createWrapper({ showHomeSearch: true });
      const homeBtn = wrapper.find(".v-btn-stub");

      expect(homeBtn.classes()).toContain("home-search-btn");
      await homeBtn.trigger("click");

      expect(mockCommit).toHaveBeenCalledOnce();
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearchDialogStatus",
        true,
      );
    });

    it("commits to the advancedSearch store when openAdvanceSearch is executed manually", () => {
      wrapper = createWrapper();

      wrapper.vm.openAdvanceSearch();

      expect(mockCommit).toHaveBeenCalledOnce();
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearchDialogStatus",
        true,
      );
    });

    it("triggers openAdvanceSearch when the header style button is clicked", async () => {
      wrapper = createWrapper({ showHomeSearch: false });
      const headerBtn = wrapper.find(".v-btn-stub");

      await headerBtn.trigger("click");
      expect(mockCommit).toHaveBeenCalledOnce();
    });
  });
});
