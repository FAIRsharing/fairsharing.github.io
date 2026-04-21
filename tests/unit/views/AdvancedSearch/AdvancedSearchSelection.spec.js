import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "vuex";
import AdvancedSearchSelection from "@/views/AdvancedSearch/AdvancedSearchSelection.vue";

// 1. Mock the JSON file to control our test mapping predictably
vi.mock("@/data/extraFilterChips.json", () => ({
  default: [{ mockKey: "Mock Display Value" }],
}));

// 2. Mock the mixin so we don't depend on external files
vi.mock("@/utils/stringUtils", () => ({
  default: {
    methods: {
      cleanString: vi.fn((str) => str.trim()), // Simple trim for testing
    },
  },
}));

describe("AdvancedSearchSelection.vue", () => {
  let wrapper;
  let store;

  const createVuexStore = (stateOverrides = {}, getterOverrides = {}) => {
    return createStore({
      modules: {
        uiController: {
          namespaced: true,
          state: {
            UIGeneralStatus: { headerVisibilityState: true, ...stateOverrides },
          },
        },
        advancedSearch: {
          namespaced: true,
          getters: {
            getAdvancedSearchQuery: () =>
              getterOverrides.query || { operator: "_and", fields: [] },
            getAdvancedSearch: () => [], // Mapped but not used in template
            getAdvancedSearchText: () => getterOverrides.searchText || "",
          },
        },
      },
    });
  };

  const mountComponent = (
    displayOverrides = {},
    stateOverrides = {},
    getterOverrides = {},
  ) => {
    store = createVuexStore(stateOverrides, getterOverrides);

    return shallowMount(AdvancedSearchSelection, {
      global: {
        plugins: [store],
        stubs: ["AdvancedSearchButtons", "v-card", "v-chip"],
        mocks: {
          $vuetify: {
            display: {
              mdAndUp: true,
              ...displayOverrides,
            },
          },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("computes responsiveClassObject correctly based on headerVisibilityState", () => {
    // When header is visible
    wrapper = mountComponent({}, { headerVisibilityState: true });
    expect(wrapper.vm.responsiveClassObject).toEqual({
      "filters-holder-default": true,
      "filters-holder-after-scroll": false,
    });

    // When header is NOT visible
    wrapper = mountComponent({}, { headerVisibilityState: false });
    expect(wrapper.vm.responsiveClassObject).toEqual({
      "filters-holder-default": false,
      "filters-holder-after-scroll": true,
    });
  });

  // --- METHOD TESTS ---

  it("formats operators in printOperator", () => {
    wrapper = mountComponent();
    expect(wrapper.vm.printOperator("_and")).toBe("And");
    expect(wrapper.vm.printOperator("_or")).toBe("Or");
    expect(wrapper.vm.printOperator("unknown")).toBeUndefined();
  });

  it("maps keys correctly using extraFilterChips.json in printSelectionKeys", () => {
    wrapper = mountComponent();
    // Maps using our mocked JSON
    expect(wrapper.vm.printSelectionKeys("mockKey")).toBe("Mock Display Value");
    // Returns original key if no match is found
    expect(wrapper.vm.printSelectionKeys("unmappedKey")).toBe("unmappedKey");
  });

  it("formats values correctly in printSelectionValues", () => {
    wrapper = mountComponent();

    // Ignores 'operator' key
    expect(
      wrapper.vm.printSelectionValues("operator", "someValue"),
    ).toBeUndefined();

    // Handles booleans accurately
    expect(wrapper.vm.printSelectionValues("registry", true)).toBe("true");
    expect(wrapper.vm.printSelectionValues("registry", ["false"])).toBe(
      "false",
    );

    // Handles arrays, joins with OR, and applies bold styling
    const result = wrapper.vm.printSelectionValues("domain", [
      " value1 ",
      " value2 ",
    ]);
    // Uses our mocked cleanString (which trims) and the boldString method
    expect(result).toBe(
      "value1 <span class='font-weight-medium'>OR</span> value2",
    );
  });

  it("extracts the first value in printSelectedOperator", () => {
    wrapper = mountComponent();
    const mockItem = { operator: "_or", otherKey: "val" };
    expect(wrapper.vm.printSelectedOperator(mockItem)).toBe("Or");
  });
});
