import { afterEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import Countries from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Countries.vue";

describe("Countries.vue", () => {
  let actions;
  let mutations;
  let countriesGetters;
  let advancedGetters;
  let store;

  const createWrapper = (props = {}, customAdvancedGetters = {}) => {
    // Setup Vuex Modules
    actions = { fetchSearchCountries: vi.fn() };
    mutations = { setSearchCountries: vi.fn() };

    countriesGetters = {
      getSearchCountries: () => ["Canada", "Mexico"],
      getLoadingStatus: () => false,
    };

    advancedGetters = {
      getEditDialogStatus: () => false,
      ...customAdvancedGetters,
    };

    store = createStore({
      modules: {
        countriesSearch: {
          namespaced: true,
          actions,
          mutations,
          getters: countriesGetters,
        },
        advancedSearch: {
          namespaced: true,
          getters: advancedGetters,
        },
      },
    });

    vi.spyOn(store, "commit");

    return shallowMount(Countries, {
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
      const defaultFactory = Countries.props.value.default;
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

      // Checking both Vue 2 'input' or Vue 3 'update:modelValue' depending on your project settings
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

      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith(
        "countriesSearch/setSearchCountries",
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

    it("computed model setter emits updated model value event", () => {
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

    it("getResults() calls fetchSearchCountries action if queryParams exist", () => {
      const wrapper = createWrapper();
      wrapper.vm.getResults("search query");

      expect(actions.fetchSearchCountries).toHaveBeenCalledTimes(1);
      expect(actions.fetchSearchCountries).toHaveBeenCalledWith(
        expect.anything(),
        "search query",
      );
    });

    it("getResults() does NOT call action if queryParams are empty", () => {
      const wrapper = createWrapper();
      wrapper.vm.getResults("");

      expect(actions.fetchSearchCountries).not.toHaveBeenCalled();
    });
  });
});
