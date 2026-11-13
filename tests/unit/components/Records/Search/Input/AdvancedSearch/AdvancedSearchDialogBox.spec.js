import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import AdvancedSearchDialogBox from "@/components/Records/Search/Input/AdvancedSearch/AdvancedSearchDialogBox.vue";
import { createStore } from "vuex";
import { reactive } from "vue";
import {
  VSlotStub,
  VDialogStub,
  VBtnStub,
  VIconStub,
  VTextFieldStub,
  VRouterLinkStub,
} from "../../../../../../stubs/index.js";

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
  let wrappers;

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
          state: () => ({
            query: getters["advancedSearch/getAdvancedSearch"] ?? {
              operatorIdentifier: "_and",
              children: [],
            },
            text: getters["advancedSearch/getAdvancedSearchText"] ?? "",
            editStatus: getters["advancedSearch/getEditDialogStatus"] ?? false,
            dialogStatus:
              getters["advancedSearch/getAdvancedSearchDialogStatus"] ?? false,
          }),
          getters: {
            getAdvancedSearch: (state) => state.query,
            getAdvancedSearchText: (state) => state.text,
            getEditDialogStatus: (state) => state.editStatus,
            getAdvancedSearchDialogStatus: (state) => state.dialogStatus,
          },
          // Add spy routing directly to mutations so this.$store.commit captures calls cleanly
          mutations: {
            setAdvancedSearchDialogStatus(state, payload) {
              state.dialogStatus = payload;
              mockCommit(
                "advancedSearch/setAdvancedSearchDialogStatus",
                payload,
              );
            },
            setEditDialogStatus(state, payload) {
              state.editStatus = payload;
              mockCommit("advancedSearch/setEditDialogStatus", payload);
            },
          },
          actions: {
            fetchAdvancedSearchResults: mockFetchSearchResults,
          },
        },
      },
    });

    const mountedWrapper = shallowMount(AdvancedSearchDialogBox, {
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
            display: reactive({ smAndDown: false }),
          },
        },
        stubs: {
          QueryBuilderView: true,
          TooltipComponent: true,
          "router-link": VRouterLinkStub,
          VRow: VSlotStub,
          VDialog: VDialogStub,
          VCard: VSlotStub,
          VBtn: VBtnStub,
          VIcon: VIconStub,
          VTextField: VTextFieldStub,
          VCardTitle: VSlotStub,
          VCardText: VSlotStub,
          VCardActions: VSlotStub,
        },
      },
    });
    wrappers.push(mountedWrapper);
    return mountedWrapper;
  };

  afterEach(async () => {
    await flushPromises();
    wrappers.forEach((w) => w.unmount());
  });

  beforeEach(() => {
    vi.clearAllMocks();
    wrappers = [];
    mockUniqueValues.mockReset().mockImplementation((arr) => arr);
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

  it.each([
    [{}, true],
    [{ children: [{}] }, true],
    [{ children: [{ children: [] }] }, true],
    [{ children: [{ children: [{ value: "" }] }] }, true],
    [{ children: [{ children: [{ value: [] }] }] }, true],
    [{ children: [{ children: [{ value: false }] }] }, false],
    [
      { children: [{ children: [{ value: ["science"] }, { value: true }] }] },
      false,
    ],
    [
      {
        children: [
          { children: [{ value: "valid" }] },
          { children: [{ value: "" }] },
        ],
      },
      true,
    ],
  ])(
    "validates all query groups before enabling Proceed: %j",
    (query, disabled) => {
      wrapper = createWrapper({ "advancedSearch/getAdvancedSearch": query });
      expect(wrapper.vm.isContinue).toBe(disabled);
    },
  );

  it("reacts to Vuex edit status and binds the existing search text", async () => {
    wrapper = createWrapper({
      "advancedSearch/getAdvancedSearchText": "Existing text",
    });
    wrapper.vm.$store.commit("advancedSearch/setEditDialogStatus", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dialog).toBe(true);
    expect(wrapper.findComponent(VTextFieldStub).props("modelValue")).toBe(
      "Existing text",
    );
    await wrapper
      .find('[aria-label="Add Search text"]')
      .setValue("Revised text");
    expect(wrapper.vm.updatedAdvancedSearchText).toBe("Revised text");
    wrapper.vm.$store.commit("advancedSearch/setEditDialogStatus", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dialog).toBe(false);
  });

  it("resets an existing input when the Vuex dialog status opens", async () => {
    wrapper = createWrapper();
    await wrapper.setData({ dialog: true });
    await wrapper.find('[aria-label="Add Search text"]').setValue("Draft");
    wrapper.vm.$store.commit(
      "advancedSearch/setAdvancedSearchDialogStatus",
      true,
    );
    await wrapper.vm.$nextTick();
    expect(VTextFieldStub.methods.reset).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.updatedAdvancedSearchText).toBe("");
    wrapper.vm.$store.commit(
      "advancedSearch/setAdvancedSearchDialogStatus",
      false,
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dialog).toBe(false);
  });

  it.each(["Close", "escape", "logo"])(
    "closes the rendered dialog through %s",
    async (action) => {
      wrapper = createWrapper();
      wrapper.vm.$store.commit(
        "advancedSearch/setAdvancedSearchDialogStatus",
        true,
      );
      await wrapper.vm.$nextTick();
      if (action === "Close")
        await wrapper
          .findAll("button")
          .find((b) => b.text() === "Close")
          .trigger("click");
      else if (action === "escape")
        await wrapper
          .find('[data-test="v-dialog"]')
          .trigger("keydown", { key: "Escape" });
      else await wrapper.find('img[alt="FAIRsharing logo"]').trigger("click");
      expect(wrapper.vm.dialog).toBe(false);
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setEditDialogStatus",
        false,
      );
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearchDialogStatus",
        false,
      );
      expect(mockRouterPush).not.toHaveBeenCalled();
    },
  );

  it("submits a valid query from Proceed using the fallback search term", async () => {
    const query = {
      operatorIdentifier: "AND",
      children: [
        {
          operatorIdentifier: "OR",
          children: [
            { identifier: "registry", value: ["database", "standard"] },
          ],
        },
      ],
    };
    wrapper = createWrapper(
      { "advancedSearch/getAdvancedSearch": query },
      { path: "/search", fullPath: "/search" },
      { advancedSearchTerm: "Fallback term" },
    );
    await wrapper.setData({ dialog: true });
    expect(
      wrapper
        .findAll("button")
        .find((b) => b.text() === "Proceed")
        .attributes("disabled"),
    ).toBeUndefined();
    await wrapper
      .findAll("button")
      .find((b) => b.text() === "Proceed")
      .trigger("click");
    expect(mockFetchSearchResults).toHaveBeenCalledWith(
      expect.anything(),
      "Fallback term",
    );
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: "AdvancedSearchResult",
      query: {
        operator: "AND",
        fields: "(operator=OR&registry=database+standard)",
      },
    });
    expect(wrapper.emitted("clearSearchField")).toEqual([[true]]);
    expect(wrapper.vm.dialog).toBe(false);
  });

  it("serializes array objects, primitive arrays and scalar query values", () => {
    wrapper = createWrapper({
      "advancedSearch/getAdvancedSearch": {
        operatorIdentifier: "AND",
        children: [
          {
            operatorIdentifier: "OR",
            children: [
              {
                identifier: "domain",
                value: [{ value: "Biology" }, "Chemistry"],
              },
              { identifier: "status", value: "ready" },
              { identifier: "enabled", value: true },
              { identifier: "empty", value: false },
            ],
          },
        ],
      },
    });
    wrapper.vm.advancedSearchQueryString();
    expect(wrapper.vm.queryString).toBe(
      "(operator=OR&domain=Biology+Chemistry&status=ready&enabled=true&empty=)",
    );
    expect(mockUniqueValues).toHaveBeenCalledWith(
      wrapper.vm.getAdvancedSearch.children[0].children,
    );
  });

  it.each(["term", ""])(
    "updates the current advanced-search URL with text=%s",
    (text) => {
      wrapper = createWrapper(
        { "advancedSearch/getAdvancedSearchText": text },
        { path: "/advancedsearch", fullPath: "/advancedsearch" },
      );
      mockRouterPush.mockClear();
      wrapper.vm.advancedSearchNavigation("(registry=database)");
      expect(mockRouterPush).toHaveBeenCalledWith({
        query: {
          ...(text ? { q: text } : {}),
          operator: "_and",
          fields: "(registry=database)",
        },
      });
    },
  );

  it("uses the mobile dialog layout and disables Proceed for an empty query", async () => {
    wrapper = createWrapper();
    wrapper.vm.$vuetify.display.smAndDown = true;
    await wrapper.setData({ dialog: true });
    const proceed = wrapper
      .findAll("button")
      .find((b) => b.text() === "Proceed");
    expect(proceed.attributes("disabled")).toBeDefined();
    expect(proceed.attributes("width")).toBe("100%");
    expect(proceed.classes()).toContain("mb-3");
    expect(wrapper.find('a[href="/"]').classes()).toContain("mx-auto");
  });
});
