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

// 2. Mock the direct store import (if anything imports it directly)
vi.mock("@/store", () => ({
  default: {
    commit: mockCommit,
  },
}));

// 3. Mock the utility function
vi.mock("@/utils/advancedSearchUtils", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    uniqueValues: mockUniqueValues,
  };
});

// 4. Completely intercept the third-party library
vi.mock("query-builder-vue-3", () => {
  return {
    default: {
      name: "QueryBuilder",
      props: ["modelValue", "config"],
      template:
        "<div><slot name='groupOperator'></slot><slot name='groupControl'></slot></div>",
    },
  };
});

// 5. Proxy-mock the component file to bypass massive multi-import loads
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
          // FIX: Pass the hoisted mockCommit spy straight into the global mock config block
          $store: {
            commit: mockCommit,
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

    const registryRule = rules.find((r) => r.identifier === "registry");
    expect(registryRule).toBeDefined();
    expect(typeof registryRule.initialValue).toBe("function");

    const firstArray = registryRule.initialValue();
    const secondArray = registryRule.initialValue();

    expect(firstArray).toStrictEqual([]);
    expect(secondArray).toStrictEqual([]);
    expect(firstArray).not.toBe(secondArray);

    const toolsRule = rules.find((r) => r.identifier === "associatedTools");
    expect(toolsRule).toBeDefined();
    expect(toolsRule.initialValue).toBe("");
  });

  it("verifies all function-based initialValues in the config return empty arrays", () => {
    wrapper = createWrapper();
    const rules = wrapper.vm.config.rules;

    const arrayRules = rules.filter(
      (r) => typeof r.initialValue === "function",
    );

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

      expect(config.operators.length).toBe(2);
      expect(config.operators[0].identifier).toBe("_and");

      expect(config.rules.length).toBe(53);
      expect(config.colors).toStrictEqual(["#599C0F", "#CB9221", "#A04545"]);
    });

    it("computes uniqueGetEditAdvancedSearch and filters via uniqueValues utility", () => {
      const fakeStoreData = {
        operatorIdentifier: "_or",
        children: [
          {
            operatorIdentifier: "_and",
            children: [
              { id: 1, val: "A" },
              { id: 1, val: "A" },
            ],
          },
        ],
      };

      wrapper = createWrapper(
        {},
        { "advancedSearch/getEditAdvancedSearch": fakeStoreData },
      );

      mockUniqueValues.mockImplementationOnce(() => [{ id: 1, val: "A" }]);

      const result = wrapper.vm.uniqueGetEditAdvancedSearch;

      expect(mockUniqueValues).toHaveBeenCalledOnce();
      expect(result.operatorIdentifier).toBe("_or");
      expect(result.children[0].children.length).toBe(1);
    });
  });

  describe("Watchers (Immediate and Reactive)", () => {
    it("isDialog watcher: resets query when open is true AND getEditDialogStatus is false", async () => {
      wrapper = createWrapper(
        { isDialog: true },
        { "advancedSearch/getEditDialogStatus": false },
      );

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

      wrapper = createWrapper(
        {},
        {
          "advancedSearch/getEditDialogStatus": true,
          "advancedSearch/getEditAdvancedSearch": fakeStoreData,
        },
      );

      expect(wrapper.vm.query.operatorIdentifier).toBe("_test");
    });

    it("query watcher: commits setAdvancedSearch to store on change", async () => {
      wrapper = createWrapper();

      const newQuery = {
        operatorIdentifier: "_or",
        children: [],
      };

      await wrapper.setData({ query: newQuery });

      expect(mockCommit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearch",
        newQuery,
      );

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
            children: [{ field: "test" }],
          },
        ],
      };

      await wrapper.setData({ query: complexQuery });

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
