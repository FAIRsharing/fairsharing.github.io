import { afterEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import UserDefinedTag from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/UserDefinedTag.vue";

describe("UserDefinedTag.vue", () => {
  let actions;
  let userDefinedTagsGetters;
  let advancedGetters;
  let store; // Track the active Vuex store instance locally

  const createWrapper = (props = {}, customAdvancedGetters = {}) => {
    // Setup Vuex Modules
    actions = { fetchSearchUserDefinedTags: vi.fn() };

    userDefinedTagsGetters = {
      getSearchUserDefinedTags: () => ["Canada", "Mexico"],
      getLoadingStatus: () => false,
    };

    advancedGetters = {
      getEditDialogStatus: () => false,
      ...customAdvancedGetters, // Allow overriding for specific tests
    };

    store = createStore({
      modules: {
        userDefinedTagsSearch: {
          namespaced: true,
          actions,
          getters: userDefinedTagsGetters,
          mutations: { setSearchUserDefinedTags: vi.fn() }, // Safe mock placeholder for watcher commits
        },
        advancedSearch: {
          namespaced: true,
          getters: advancedGetters,
        },
      },
    });

    // Directly spy on the commit method of the newly created store instance
    vi.spyOn(store, "commit");

    return shallowMount(UserDefinedTag, {
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
      const defaultFactory = UserDefinedTag.props.value.default;
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

      const emittedEvent =
        wrapper.emitted()["update:modelValue"] || wrapper.emitted().input;
      expect(emittedEvent).toBeTruthy();
      expect(emittedEvent[0]).toStrictEqual([["FTP", "SPARQL"]]);
    });
  });

  describe("Watcher: getEditDialogStatus (Immediate)", () => {
    it("does NOT commit to direct store if dialog is open but value is empty", () => {
      createWrapper({ value: [] }, { getEditDialogStatus: () => true });

      expect(store.commit).not.toHaveBeenCalled();
    });

    it("does NOT commit to direct store if dialog is closed", () => {
      createWrapper(
        { value: ["France"] },
        { getEditDialogStatus: () => false },
      );

      expect(store.commit).not.toHaveBeenCalled();
    });

    it("commits to the direct store if dialog is open AND value has length", () => {
      const mockValue = ["Germany"];
      createWrapper({ value: mockValue }, { getEditDialogStatus: () => true });

      // Asserts against the actual store instance spy instead of the removed global import mock
      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith(
        "userDefinedTagsSearch/setSearchUserDefinedTags",
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

    it("computed model setter emits expected event", () => {
      const wrapper = createWrapper();
      wrapper.vm.model = ["Italy"];

      const emittedEvent =
        wrapper.emitted()["update:modelValue"] || wrapper.emitted().input;
      expect(emittedEvent).toBeTruthy();
      expect(emittedEvent[0]).toStrictEqual([["Italy"]]);
    });

    it("selectedValue() sets itemSelected", () => {
      const wrapper = createWrapper();
      wrapper.vm.selectedValue(["Egypt"]);
      expect(wrapper.vm.itemSelected).toStrictEqual(["Egypt"]);
    });

    it("getResults() calls fetchSearchUserDefinedTags action if queryParams exist", () => {
      const wrapper = createWrapper();
      wrapper.vm.getResults("search query");

      expect(actions.fetchSearchUserDefinedTags).toHaveBeenCalledTimes(1);
      expect(actions.fetchSearchUserDefinedTags).toHaveBeenCalledWith(
        expect.anything(),
        "search query",
      );
    });

    it("getResults() does NOT call action if queryParams are empty", () => {
      const wrapper = createWrapper();
      wrapper.vm.getResults("");

      expect(actions.fetchSearchUserDefinedTags).not.toHaveBeenCalled();
    });
  });
});
