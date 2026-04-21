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

// 2. Mock direct store imports
vi.mock("@/store", () => ({
  default: {
    commit: mockCommit,
  },
}));

// 3. Mock utility functions
vi.mock("@/utils/advancedSearchUtils", async (importOriginal) => {
  // 1. Grab all the real exports from the actual file
  const actual = await importOriginal();

  return {
    ...actual, // 2. Spread the real exports (this restores 'recordTypes'!)
    uniqueValues: mockUniqueValues, // 3. Override just this one with our spy
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
    // 🚀 3. Build a REAL Vuex store for the test!
    const mockStore = createStore({
      modules: {
        advancedSearch: {
          namespaced: true,
          getters: {
            // Map our dynamic test getters, or fall back to defaults
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
          actions: {
            // Inject our spy directly into the real Vuex action slot
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
        // 🚀 4. Use `plugins` to install the store naturally, just like in main.js!
        plugins: [mockStore],
        mocks: {
          // (We removed $store and _modulesNamespaceMap from here completely)
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
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Lifecycle Hooks (mounted)", () => {
    it("commits to open the dialog if the user navigates directly to /advancedsearch", () => {
      // Mount with a specific route
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
      // Default mock has no children, so it should be disabled
      expect(wrapper.vm.isContinue).toBe(true);
    });

    it("isContinue enables the Proceed button (returns false) when a valid field exists", () => {
      // Create a fake populated store state
      const populatedStoreData = {
        children: [
          {
            children: [{ value: "test-value" }], // Simulating a filled out query builder rule
          },
        ],
      };

      wrapper = createWrapper({
        "advancedSearch/getAdvancedSearch": populatedStoreData,
      });

      // Should now be enabled (false)
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

      // Should close both dialog flags
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setEditDialogStatus",
        false,
      );
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearchDialogStatus",
        false,
      );

      // Because we mounted it on /advancedsearch, it should route back to home
      expect(mockRouterPush).toHaveBeenCalledWith("/");

      // Local dialog state should be false
      expect(wrapper.vm.dialog).toBe(false);
    });

    it("updateSearchText() successfully sets the updated text", () => {
      wrapper = createWrapper();
      wrapper.vm.updateSearchText("New search value");
      expect(wrapper.vm.updatedAdvancedSearchText).toBe("New search value");
    });

    it("goToAdvancedSearch() dispatches action, emits event, and navigates", () => {
      // 1. Setup mock query builder data
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

      // Override the uniqueValues mock to return the child array exactly as-is for this test
      mockUniqueValues.mockReturnValueOnce([
        { identifier: "domain", value: "Science" },
      ]);

      // 2. Set the local data so it triggers the `if (this.updatedAdvancedSearchText)` block
      wrapper.vm.updatedAdvancedSearchText = "my-search";

      // 3. Fire the method
      wrapper.vm.goToAdvancedSearch();

      // 4. Assertions
      // Did it fetch results via mapActions?
      // expect(mockDispatch).toHaveBeenCalledWith(
      //   "advancedSearch/fetchAdvancedSearchResults",
      //   "my-search",
      // );

      expect(mockFetchSearchResults).toHaveBeenCalledWith(
        expect.anything(),
        "my-search",
      );

      // Did it emit the clear event?
      expect(wrapper.emitted().clearSearchField).toBeTruthy();
      expect(wrapper.emitted().clearSearchField[0]).toEqual([true]);

      // Did it format the query string correctly and push to router?
      expect(mockRouterPush).toHaveBeenCalledWith({
        name: "AdvancedSearchResult",
        query: {
          q: "my-search",
          operator: "_and",
          fields: "(operator=_or&domain=Science)",
        },
      });

      // Did it close the dialog afterwards?
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setEditDialogStatus",
        false,
      );
    });

    describe("Query Parameter Formatters", () => {
      it("noAdvancedSearchTerm() constructs the correct object using the store's operator", () => {
        // 1. Mount the wrapper and inject a specific operator into our fake Vuex getter
        const wrapper = createWrapper({
          "advancedSearch/getAdvancedSearch": {
            operatorIdentifier: "_OR", // Let's test with _OR to make sure it's reading the store
            children: [],
          },
        });

        const mockQueryString = "(domain=Science+Nature)";

        // 2. Call the method
        const result = wrapper.vm.noAdvancedSearchTerm(mockQueryString);

        // 3. Assert it returns the exact expected object signature
        expect(result).toStrictEqual({
          operator: "_OR",
          fields: "(domain=Science+Nature)",
        });
      });

      // Bonus: Let's knock out isAdvancedSearchTerm while we are right here!
      it("isAdvancedSearchTerm() constructs the correct object including the search term", () => {
        const wrapper = createWrapper({
          "advancedSearch/getAdvancedSearch": {
            operatorIdentifier: "_AND",
            children: [],
          },
          "advancedSearch/getAdvancedSearchText": "Genetics", // Inject the search text
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

      // Trigger the watcher by manually changing the simulated getter and forcing an update
      // Alternatively, we can just call the watcher function directly since it's a unit test:
      wrapper.vm.$options.watch.getEditDialogStatus.call(wrapper.vm, true);

      expect(wrapper.vm.dialog).toBe(true);
      expect(wrapper.vm.updatedAdvancedSearchText).toBe("Watched Text");
    });

    describe("Watcher: getAdvancedSearchDialogStatus", () => {
      it("sets dialog to true and calls reset() on inputRef when newValue is true", () => {
        const wrapper = createWrapper();
        const mockReset = vi.fn();

        // 1. Create a fake "this" context that mimics the component's state
        const fakeContext = {
          dialog: false,
          $refs: {
            inputRef: { reset: mockReset },
          },
        };

        // 2. Call the watcher, but bind it to our fakeContext instead of wrapper.vm!
        wrapper.vm.$options.watch.getAdvancedSearchDialogStatus.call(
          fakeContext,
          true,
        );

        // 3. Run assertions against the fakeContext
        expect(fakeContext.dialog).toBe(true);
        expect(mockReset).toHaveBeenCalledOnce();
      });

      it("sets dialog to false but does NOT call reset() when newValue is false", () => {
        const wrapper = createWrapper();
        const mockReset = vi.fn();

        const fakeContext = {
          dialog: true, // Start true so we can watch it change to false
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

        // Provide an empty $refs object to simulate the DOM not rendering the text field yet
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
