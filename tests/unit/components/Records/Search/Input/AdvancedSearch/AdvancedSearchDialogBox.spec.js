import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import AdvancedSearchDialogBox from "@/components/Records/Search/Input/AdvancedSearch/AdvancedSearchDialogBox.vue";
import { createStore } from "vuex";

// 1. Hoist our spies so they safely bypass the ES module rules
const { mockCommit, mockUniqueValues, mockRouterPush, mockFetchSearchResults } =
  vi.hoisted(() => {
    return {
      mockCommit: vi.fn(),
      mockUniqueValues: vi.fn((arr) => arr), // Pass-through by default
      mockRouterPush: vi.fn(),
      mockFetchSearchResults: vi.fn(), // For mapActions
    };
  });

// 2. Mock direct store imports (fallback safety)
vi.mock("@/store", () => ({
  default: {
    commit: mockCommit,
  },
}));

// 3. Mock utility functions
vi.mock("@/utils/advancedSearchUtils", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    uniqueValues: mockUniqueValues,
  };
});

describe("AdvancedSearchDialogBox.vue", () => {
  let wrapper;

  // 4. Helper function to mount with custom props, getters, and route state
  const createWrapper = (
    getters = {},
    routeData = { fullPath: "/", path: "/" },
    props = {},
  ) => {
    //Build a REAL Vuex store for the test!
    const mockStore = createStore({
      modules: {
        advancedSearch: {
          namespaced: true,
          getters: {
            getAdvancedSearch: () =>
              getters["advancedSearch/getAdvancedSearch"] ?? {
                operatorIdentifier: "_and",
                children: [],
              },
            getAdvancedSearchText: () =>
              getters["advancedSearch/getAdvancedSearchText"] ?? "",
            getEditDialogStatus: () =>
              getters["advancedSearch/getEditDialogStatus"] ?? false,
            getAdvancedSearchDialogStatus: () =>
              getters["advancedSearch/getAdvancedSearchDialogStatus"] ?? false,
          },
          // Add spy routing directly to mutations so this.$store.commit captures calls cleanly
          mutations: {
            setAdvancedSearchDialogStatus(state, payload) {
              mockCommit(
                "advancedSearch/setAdvancedSearchDialogStatus",
                payload,
              );
            },
            setEditDialogStatus(state, payload) {
              mockCommit("advancedSearch/setEditDialogStatus", payload);
            },
          },
          actions: {
            fetchAdvancedSearchResults: mockFetchSearchResults,
          },
        },
      },
    });

    return shallowMount(AdvancedSearchDialogBox, {
      props: {
        advancedSearchTerm: "default-term",
        ...props,
      },
      global: {
        plugins: [mockStore],
        mocks: {
          $route: routeData,
          $router: {
            push: mockRouterPush,
          },
          $vuetify: {
            display: {
              smAndDown: false,
            },
          },
        },
        stubs: {
          QueryBuilderView: true,
          TooltipComponent: true,
          "router-link": true,
          "v-row": true,
          "v-dialog": true,
          "v-card": true,
          "v-btn": true,
          "v-icon": true,
          "v-text-field": true,
          "v-card-title": true,
          "v-card-text": true,
          "v-card-actions": true,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Lifecycle Hooks (mounted)", () => {
    it("commits to open the dialog if the user navigates directly to /advancedsearch", () => {
      wrapper = createWrapper(
        {},
        { fullPath: "/advancedsearch", path: "/advancedsearch" },
      );

      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearchDialogStatus",
        true,
      );
    });

    it("does NOT commit to open the dialog on normal routes", () => {
      wrapper = createWrapper({}, { fullPath: "/", path: "/" });

      expect(mockCommit).not.toHaveBeenCalled();
    });
  });

  describe("Computed Properties", () => {
    it("isContinue disables the Proceed button (returns true) when fields are empty", () => {
      wrapper = createWrapper();
      expect(wrapper.vm.isContinue).toBe(true);
    });

    it("isContinue enables the Proceed button (returns false) when a valid field exists", () => {
      const populatedStoreData = {
        children: [
          {
            children: [{ value: "test-value" }],
          },
        ],
      };

      wrapper = createWrapper({
        "advancedSearch/getAdvancedSearch": populatedStoreData,
      });

      expect(wrapper.vm.isContinue).toBe(false);
    });
  });

  describe("Methods", () => {
    it("closeDialog() resets statuses and handles routing correctly", () => {
      wrapper = createWrapper(
        {},
        { fullPath: "/advancedsearch", path: "/advancedsearch" },
      );

      wrapper.vm.closeDialog();

      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setEditDialogStatus",
        false,
      );
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearchDialogStatus",
        false,
      );

      expect(mockRouterPush).toHaveBeenCalledWith("/");
      expect(wrapper.vm.dialog).toBe(false);
    });

    it("updateSearchText() successfully sets the updated text", () => {
      wrapper = createWrapper();
      wrapper.vm.updateSearchText("New search value");
      expect(wrapper.vm.updatedAdvancedSearchText).toBe("New search value");
    });

    it("goToAdvancedSearch() dispatches action, emits event, and navigates", () => {
      const mockQueryBuilderState = {
        operatorIdentifier: "_and",
        children: [
          {
            operatorIdentifier: "_or",
            children: [{ identifier: "domain", value: "Science" }],
          },
        ],
      };

      wrapper = createWrapper({
        "advancedSearch/getAdvancedSearchText": "my-search",
        "advancedSearch/getAdvancedSearch": mockQueryBuilderState,
      });

      mockUniqueValues.mockReturnValueOnce([
        { identifier: "domain", value: "Science" },
      ]);

      wrapper.vm.updatedAdvancedSearchText = "my-search";
      wrapper.vm.goToAdvancedSearch();

      expect(mockFetchSearchResults).toHaveBeenCalledWith(
        expect.anything(),
        "my-search",
      );

      expect(wrapper.emitted().clearSearchField).toBeTruthy();
      expect(wrapper.emitted().clearSearchField[0]).toEqual([true]);

      expect(mockRouterPush).toHaveBeenCalledWith({
        name: "AdvancedSearchResult",
        query: {
          q: "my-search",
          operator: "_and",
          fields: "(operator=_or&domain=Science)",
        },
      });

      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setEditDialogStatus",
        false,
      );
    });

    describe("Query Parameter Formatters", () => {
      it("noAdvancedSearchTerm() constructs the correct object using the store's operator", () => {
        const wrapper = createWrapper({
          "advancedSearch/getAdvancedSearch": {
            operatorIdentifier: "_OR",
            children: [],
          },
        });

        const mockQueryString = "(domain=Science+Nature)";
        const result = wrapper.vm.noAdvancedSearchTerm(mockQueryString);

        expect(result).toStrictEqual({
          operator: "_OR",
          fields: "(domain=Science+Nature)",
        });
      });

      it("isAdvancedSearchTerm() constructs the correct object including the search term", () => {
        const wrapper = createWrapper({
          "advancedSearch/getAdvancedSearch": {
            operatorIdentifier: "_AND",
            children: [],
          },
          "advancedSearch/getAdvancedSearchText": "Genetics",
        });

        const mockQueryString = "(country=UK)";
        const result = wrapper.vm.isAdvancedSearchTerm(mockQueryString);

        expect(result).toStrictEqual({
          q: "Genetics",
          operator: "_AND",
          fields: "(country=UK)",
        });
      });
    });
  });

  describe("Watchers", () => {
    it("syncs dialog status and text when getEditDialogStatus changes", async () => {
      wrapper = createWrapper({
        "advancedSearch/getAdvancedSearchText": "Watched Text",
      });

      wrapper.vm.$options.watch.getEditDialogStatus.call(wrapper.vm, true);

      expect(wrapper.vm.dialog).toBe(true);
      expect(wrapper.vm.updatedAdvancedSearchText).toBe("Watched Text");
    });

    describe("Watcher: getAdvancedSearchDialogStatus", () => {
      it("sets dialog to true and calls reset() on inputRef when newValue is true", () => {
        const wrapper = createWrapper();
        const mockReset = vi.fn();

        const fakeContext = {
          dialog: false,
          $refs: {
            inputRef: { reset: mockReset },
          },
        };

        wrapper.vm.$options.watch.getAdvancedSearchDialogStatus.call(
          fakeContext,
          true,
        );

        expect(fakeContext.dialog).toBe(true);
        expect(mockReset).toHaveBeenCalledOnce();
      });

      it("sets dialog to false but does NOT call reset() when newValue is false", () => {
        const wrapper = createWrapper();
        const mockReset = vi.fn();

        const fakeContext = {
          dialog: true,
          $refs: {
            inputRef: { reset: mockReset },
          },
        };

        wrapper.vm.$options.watch.getAdvancedSearchDialogStatus.call(
          fakeContext,
          false,
        );

        expect(fakeContext.dialog).toBe(false);
        expect(mockReset).not.toHaveBeenCalled();
      });

      it("safely updates dialog and does not crash if inputRef is undefined", () => {
        const wrapper = createWrapper();

        const fakeContext = {
          dialog: false,
          $refs: {},
        };

        expect(() => {
          wrapper.vm.$options.watch.getAdvancedSearchDialogStatus.call(
            fakeContext,
            true,
          );
        }).not.toThrow();

        expect(fakeContext.dialog).toBe(true);
      });
    });
  });
});
