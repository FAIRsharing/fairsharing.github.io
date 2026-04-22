import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import QueryBuilderView from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderView.vue";

// 1. Hoist our spies so they safely bypass the ES module rules
const { mockCommit, mockUniqueValues } = vi.hoisted(() => {
  return {
    mockCommit: vi.fn(),
    mockUniqueValues: vi.fn((children) => children), // Default mock just returns what it was given
  };
});

// 2. Mock the direct store import
vi.mock("@/store", () => ({
  default: {
    commit: mockCommit,
  },
}));

// 3. Mock the utility function
vi.mock("@/utils/advancedSearchUtils", async (importOriginal) => {
  // 1. Grab all the real exports from the actual file
  const actual = await importOriginal();

  return {
    ...actual, // 2. Spread the real exports (this restores 'recordTypes'!)
    uniqueValues: mockUniqueValues, // 3. Override just this one with our spy
  };
});

// 1. Completely intercept the third-party library
vi.mock("query-builder-vue-3", () => {
  return {
    default: {
      name: "QueryBuilder",
      // 2. Define standard props WITHOUT any custom validators
      props: ["modelValue", "config"],
      // 3. Provide a basic template so scoped slots don't break
      template:
        "<div><slot name='groupOperator'></slot><slot name='groupControl'></slot></div>",
    },
  };
});

// 4. PRO-TIP: Mock the massive component import file using a Proxy!
// This automatically provides a fake string/component for all 50+ imports so Vitest doesn't crash.
vi.mock("./QueryBuilderComponents", () => {
  return new Proxy({}, { get: () => "MockedComponent" });
});

describe("QueryBuilderView.vue", () => {
  let wrapper;

  // Helper function to mount with custom props and Vuex getters
  const createWrapper = (props = {}, getters = {}) => {
    return shallowMount(QueryBuilderView, {
      props,
      global: {
        mocks: {
          // Mocking this.$store for the mapGetters helper
          $store: {
            getters: {
              "advancedSearch/getEditDialogStatus": false,
              "advancedSearch/getEditAdvancedSearch": {
                operatorIdentifier: "_and",
                children: [],
              },
              ...getters,
            },
            _modulesNamespaceMap: {
              "advancedSearch/": true,
            },
          },
        },
        stubs: {
          "query-builder": true,
          GroupCtrlSlot: true,
          "v-icon": true,
        },
      },
    });
  };

  beforeEach(() => {
    mockCommit.mockClear();
    mockUniqueValues.mockClear();
  });

  it("evaluates rule initialValues correctly (functions return fresh arrays, strings return empty strings)", () => {
    wrapper = createWrapper();
    const rules = wrapper.vm.config.rules;

    // 1. Test a rule that expects an array (e.g., 'registry')
    const registryRule = rules.find((r) => r.identifier === "registry");
    expect(registryRule).toBeDefined();
    expect(typeof registryRule.initialValue).toBe("function");

    // Execute the function twice to prove it returns a FRESH array in memory each time
    const firstArray = registryRule.initialValue();
    const secondArray = registryRule.initialValue();

    expect(firstArray).toStrictEqual([]);
    expect(secondArray).toStrictEqual([]);
    expect(firstArray).not.toBe(secondArray); // Ensures they don't share the same memory reference!

    // 2. Test a rule that expects a string (e.g., 'associatedTools')
    const toolsRule = rules.find((r) => r.identifier === "associatedTools");
    expect(toolsRule).toBeDefined();
    expect(toolsRule.initialValue).toBe("");
  });

  it("verifies all function-based initialValues in the config return empty arrays", () => {
    wrapper = createWrapper();
    const rules = wrapper.vm.config.rules;

    // Filter down to only the rules where initialValue is a function
    const arrayRules = rules.filter(
      (r) => typeof r.initialValue === "function",
    );

    // Loop through every single one to guarantee none of them are broken
    arrayRules.forEach((rule) => {
      expect(rule.initialValue()).toStrictEqual([]);
    });
  });

  describe("v-model binding on QueryBuilder", () => {
    it("passes the query data as modelValue and updates when the component emits", async () => {
      const wrapper = createWrapper();
      const queryBuilder = wrapper.findComponent({ name: "QueryBuilder" });

      expect(queryBuilder.props("modelValue")).toStrictEqual({
        operatorIdentifier: "_and",
        children: [],
      });

      const newQueryPayload = {
        operatorIdentifier: "_or",
        children: [
          {
            operatorIdentifier: "_and",
            children: [],
          },
        ],
      };
      await queryBuilder.vm.$emit("update:modelValue", newQueryPayload);
      expect(wrapper.vm.query).toStrictEqual(newQueryPayload);
    });
  });

  describe("Initial State and Computed Properties", () => {
    it("mounts and sets default query state", () => {
      wrapper = createWrapper();
      expect(wrapper.vm.query).toStrictEqual({
        operatorIdentifier: "_and",
        children: [],
      });
    });

    it("generates the config object correctly with operators and rules", () => {
      wrapper = createWrapper();
      const config = wrapper.vm.config;

      // Verify basic config structure
      expect(config.operators.length).toBe(2);
      expect(config.operators[0].identifier).toBe("_and");

      // Verify rules were populated (checking length based on your component list)
      expect(config.rules.length).toBe(53); // Ensure all 53 rules are registered
      expect(config.colors).toStrictEqual(["#599C0F", "#CB9221", "#A04545"]);
    });

    it("computes uniqueGetEditAdvancedSearch and filters via uniqueValues utility", () => {
      // Setup fake getter data with nested children
      const fakeStoreData = {
        operatorIdentifier: "_or",
        children: [
          {
            operatorIdentifier: "_and",
            children: [
              { id: 1, val: "A" },
              { id: 1, val: "A" },
            ], // Duplicates
          },
        ],
      };

      wrapper = createWrapper(
        {},
        { "advancedSearch/getEditAdvancedSearch": fakeStoreData },
      );

      // Change the mock to actually filter duplicates for this specific test
      mockUniqueValues.mockImplementationOnce(() => [{ id: 1, val: "A" }]);

      const result = wrapper.vm.uniqueGetEditAdvancedSearch;

      // Assertions
      expect(mockUniqueValues).toHaveBeenCalledOnce();
      expect(result.operatorIdentifier).toBe("_or");
      expect(result.children[0].children.length).toBe(1); // Duplicates removed
    });
  });

  describe("Watchers (Immediate and Reactive)", () => {
    it("isDialog watcher: resets query when open is true AND getEditDialogStatus is false", async () => {
      // Because it's immediate: true, we can trigger it during mount
      wrapper = createWrapper(
        { isDialog: true },
        { "advancedSearch/getEditDialogStatus": false },
      );

      // Verify it set the default nested structure
      expect(wrapper.vm.query).toStrictEqual({
        operatorIdentifier: "_and",
        children: [
          {
            operatorIdentifier: "_and",
            children: [],
          },
        ],
      });
    });

    it("getEditDialogStatus watcher: populates query from uniqueGetEditAdvancedSearch when open is true", async () => {
      const fakeStoreData = {
        operatorIdentifier: "_test",
        children: [],
      };

      // Set getter to true and provide fake data
      wrapper = createWrapper(
        {},
        {
          "advancedSearch/getEditDialogStatus": true,
          "advancedSearch/getEditAdvancedSearch": fakeStoreData,
        },
      );

      // Verify the watcher mapped the computed prop straight into `this.query`
      expect(wrapper.vm.query.operatorIdentifier).toBe("_test");
    });

    it("query watcher: commits setAdvancedSearch to store on change", async () => {
      wrapper = createWrapper();

      const newQuery = {
        operatorIdentifier: "_or",
        children: [],
      };

      // Trigger the watcher
      await wrapper.setData({ query: newQuery });

      // Assert it committed the base mutation
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearch",
        newQuery,
      );

      // Since children is empty, setEditAdvancedSearch should NOT be called
      expect(mockCommit).not.toHaveBeenCalledWith(
        "advancedSearch/setEditAdvancedSearch",
        expect.anything(),
      );
    });

    it("query watcher: conditionally commits setEditAdvancedSearch if nested children exist", async () => {
      wrapper = createWrapper();

      const complexQuery = {
        operatorIdentifier: "_and",
        children: [
          {
            operatorIdentifier: "_or",
            children: [{ field: "test" }], // Deep children triggers the inner if-statement
          },
        ],
      };

      await wrapper.setData({ query: complexQuery });

      // Both mutations should have been triggered
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearch",
        complexQuery,
      );
      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setEditAdvancedSearch",
        complexQuery,
      );
    });
  });
});
