import { afterEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import taxonomiesSearch from "@/store";
import Taxonomies from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Taxonomies.vue";

vi.mock("@/store", () => ({
  default: {
    commit: vi.fn(),
  },
}));

describe("Taxonomies.vue", () => {
  let actions;
  let taxonomiesGetters;
  let advancedGetters;

  const createWrapper = (props = {}, customAdvancedGetters = {}) => {
    // Setup Vuex Modules
    actions = { fetchSearchTaxonomies: vi.fn() };

    taxonomiesGetters = {
      getSearchTaxonomies: () => ["Canada", "Mexico"],
      getLoadingStatus: () => false,
    };

    advancedGetters = {
      getEditDialogStatus: () => false,
      ...customAdvancedGetters, // Allow overriding for specific tests
    };

    const store = createStore({
      modules: {
        taxonomiesSearch: {
          namespaced: true,
          actions,
          getters: taxonomiesGetters,
        },
        advancedSearch: {
          namespaced: true,
          getters: advancedGetters,
        },
      },
    });

    return shallowMount(Taxonomies, {
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
      const defaultFactory = Taxonomies.props.value.default;
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

      expect(taxonomiesSearch.commit).not.toHaveBeenCalled();
    });

    it("does NOT commit to direct store if dialog is closed", () => {
      createWrapper(
        { value: ["France"] },
        { getEditDialogStatus: () => false },
      );

      expect(taxonomiesSearch.commit).not.toHaveBeenCalled();
    });

    it("commits to the direct store if dialog is open AND value has length", () => {
      const mockValue = ["Germany"];
      createWrapper({ value: mockValue }, { getEditDialogStatus: () => true });

      // Asserts the direct import `taxonomiesSearch.commit()` was called correctly
      expect(taxonomiesSearch.commit).toHaveBeenCalledTimes(1);
      expect(taxonomiesSearch.commit).toHaveBeenCalledWith(
        "taxonomiesSearch/setSearchTaxonomies",
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

    it("getResults() calls fetchSearchTaxonomies action if queryParams exist", () => {
      const wrapper = createWrapper();
      wrapper.vm.getResults("search query");

      expect(actions.fetchSearchTaxonomies).toHaveBeenCalledTimes(1);
      expect(actions.fetchSearchTaxonomies).toHaveBeenCalledWith(
        expect.anything(),
        "search query",
      );
    });

    it("getResults() does NOT call action if queryParams are empty", () => {
      const wrapper = createWrapper();
      wrapper.vm.getResults("");

      expect(actions.fetchSearchTaxonomies).not.toHaveBeenCalled();
    });
  });
});
