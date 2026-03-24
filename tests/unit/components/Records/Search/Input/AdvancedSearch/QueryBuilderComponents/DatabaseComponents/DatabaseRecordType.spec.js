import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import DatabaseRecordType from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DatabaseRecordType.vue";

vi.mock("@/utils/advancedSearchUtils", () => ({
  recordTypes: {
    methods: {
      filteredRecordTypes: vi.fn(() => ["Database Type A", "Database Type B"]),
    },
    computed: {
      getRecordTypes: () => [],
    },
  },
}));

describe("DatabaseRecordType.vue", () => {
  let wrapper;
  let actions;
  let store;

  const mockFilteredList = ["Database Type A", "Database Type B"];

  beforeEach(() => {
    actions = {
      fetchAllRecordTypes: vi.fn(),
    };

    store = createStore({
      modules: {
        recordTypes: {
          namespaced: true,
          actions,
        },
      },
    });

    // 2. Mount Component
    wrapper = shallowMount(DatabaseRecordType, {
      global: {
        plugins: [store],
        stubs: { SelectComponent: true },
        mocks: {
          filteredRecordTypes: vi.fn(() => mockFilteredList),
        },
      },
      props: {
        value: ["Initial Value"],
      },
    });
  });

  describe("Initialization", () => {
    it("calls the fetchAllRecordTypes Vuex action on mount", () => {
      expect(actions.fetchAllRecordTypes).toHaveBeenCalled();
    });

    it("syncs itemValue with the value prop in the mounted hook", () => {
      expect(wrapper.vm.itemValue).toStrictEqual(["Initial Value"]);
    });

    it("passes the correct item-list to SelectComponent via the mixin method", () => {
      const select = wrapper.findComponent({ name: "SelectComponent" });
      expect(select.props("itemList")).toStrictEqual(mockFilteredList);
    });

    it("can check v-model integration with SelectComponent", async () => {
      const selectStub = wrapper.findComponent({ name: "SelectComponent" });
      await selectStub.vm.$emit("update:modelValue", ["FTP", "SPARQL"]);
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toStrictEqual([["FTP", "SPARQL"]]);
    });
  });

  describe("Reactivity & Watchers", () => {
    it("updates itemValue when itemSelected changes (Watcher test)", async () => {
      wrapper.vm.itemSelected = ["New Selection"];
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.itemValue).toStrictEqual(["New Selection"]);
    });
  });

  describe("Computed Property: model", () => {
    it("getter: returns the current itemSelected value", () => {
      wrapper.vm.itemSelected = ["Option 1"];
      expect(wrapper.vm.model).toStrictEqual(["Option 1"]);
    });
    it('setter: emits "input" event when model is modified', async () => {
      const newValue = ["Option 2"];
      wrapper.vm.model = newValue;
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toEqual([newValue]);
    });
  });

  describe("Methods", () => {
    it("selectedValue() correctly updates itemSelected", () => {
      const selection = ["Selected via UI"];
      wrapper.vm.selectedValue(selection);
      expect(wrapper.vm.itemSelected).toStrictEqual(selection);
    });
  });
});
