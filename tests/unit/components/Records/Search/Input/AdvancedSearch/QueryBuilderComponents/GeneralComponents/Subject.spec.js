import { afterEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import subjectSearch from "@/store";
import Subject from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Subject.vue";

vi.mock("@/store", () => ({
  default: {
    commit: vi.fn(),
  },
}));

describe("Subject.vue", () => {
  let actions;
  let subjectGetters;
  let advancedGetters;

  const createWrapper = (props = {}, customAdvancedGetters = {}) => {
    // Setup Vuex Modules
    actions = { fetchSearchSubjects: vi.fn() };

    subjectGetters = {
      getSearchSubjects: () => ["Canada", "Mexico"],
      getLoadingStatus: () => false,
    };

    advancedGetters = {
      getEditDialogStatus: () => false,
      ...customAdvancedGetters, // Allow overriding for specific tests
    };

    const store = createStore({
      modules: {
        subjectSearch: {
          namespaced: true,
          actions,
          getters: subjectGetters,
        },
        advancedSearch: {
          namespaced: true,
          getters: advancedGetters,
        },
      },
    });

    return shallowMount(Subject, {
      global: {
        plugins: [store],
        stubs: { AutoCompleteComponent: true },
      },
      props: {
        value: [],
        ...props,
      },
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Props & Defaults", () => {
    it("should default 'value' to an empty array using a factory function", () => {
      const defaultFactory = Subject.props.value.default;
      expect(typeof defaultFactory).toBe("function");

      const instance1 = defaultFactory();
      const instance2 = defaultFactory();

      expect(instance1).toStrictEqual([]);
      expect(instance1).not.toBe(instance2);
    });

    it("can check v-model integration with AutoCompleteComponent", async () => {
      const wrapper = createWrapper();
      const selectStub = wrapper.findComponent({
        name: "AutoCompleteComponent",
      });
      await selectStub.vm.$emit("update:modelValue", ["FTP", "SPARQL"]);
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toStrictEqual([["FTP", "SPARQL"]]);
    });
  });

  describe("Watcher: getEditDialogStatus (Immediate)", () => {
    it("does NOT commit to direct store if dialog is open but value is empty", () => {
      createWrapper({ value: [] }, { getEditDialogStatus: () => true });

      expect(subjectSearch.commit).not.toHaveBeenCalled();
    });

    it("does NOT commit to direct store if dialog is closed", () => {
      createWrapper(
        { value: ["France"] },
        { getEditDialogStatus: () => false },
      );

      expect(subjectSearch.commit).not.toHaveBeenCalled();
    });

    it("commits to the direct store if dialog is open AND value has length", () => {
      const mockValue = ["Germany"];
      createWrapper({ value: mockValue }, { getEditDialogStatus: () => true });

      // Asserts the direct import `subjectSearch.commit()` was called correctly
      expect(subjectSearch.commit).toHaveBeenCalledTimes(1);
      expect(subjectSearch.commit).toHaveBeenCalledWith(
        "subjectSearch/setSearchSubjects",
        mockValue,
      );
    });
  });

  describe("Computed & Methods", () => {
    it("computed model getter returns itemSelected", () => {
      const wrapper = createWrapper();
      wrapper.vm.itemSelected = ["Spain"];
      expect(wrapper.vm.model).toStrictEqual(["Spain"]);
    });

    it("computed model setter emits 'input' event", () => {
      const wrapper = createWrapper();
      wrapper.vm.model = ["Italy"];

      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toStrictEqual([["Italy"]]);
    });

    it("selectedValue() sets itemSelected", () => {
      const wrapper = createWrapper();
      wrapper.vm.selectedValue(["Egypt"]);
      expect(wrapper.vm.itemSelected).toStrictEqual(["Egypt"]);
    });

    it("getResults() calls fetchSearchSubjects action if queryParams exist", () => {
      const wrapper = createWrapper();
      wrapper.vm.getResults("search query");

      expect(actions.fetchSearchSubjects).toHaveBeenCalledTimes(1);
      expect(actions.fetchSearchSubjects).toHaveBeenCalledWith(
        expect.anything(),
        "search query",
      );
    });

    it("getResults() does NOT call action if queryParams are empty", () => {
      const wrapper = createWrapper();
      wrapper.vm.getResults("");

      expect(actions.fetchSearchSubjects).not.toHaveBeenCalled();
    });
  });
});
