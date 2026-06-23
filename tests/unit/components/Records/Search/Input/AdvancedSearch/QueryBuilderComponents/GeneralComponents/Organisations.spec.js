import { afterEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import Organisations from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Organisations.vue";

describe("Organisations.vue", () => {
  let actions;
  let organisationGetters;
  let advancedGetters;
  let store;

  const createWrapper = (props = {}, customAdvancedGetters = {}) => {
    actions = { fetchSearchOrganisations: vi.fn() };

    organisationGetters = {
      getSearchOrganisations: () => ["Canada", "Mexico"],
      getLoadingStatus: () => false,
    };

    advancedGetters = {
      getEditDialogStatus: () => false,
      ...customAdvancedGetters,
    };

    store = createStore({
      modules: {
        organisationSearch: {
          namespaced: true,
          actions,
          getters: organisationGetters,
          mutations: { setSearchOrganisations: vi.fn() },
        },
        advancedSearch: {
          namespaced: true,
          getters: advancedGetters,
        },
      },
    });

    // Directly spy on the commit method of the generated store
    vi.spyOn(store, "commit");

    return shallowMount(Organisations, {
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
      const defaultFactory = Organisations.props.value.default;
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

      // Asserts against the real active store spy instance
      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith(
        "organisationSearch/setSearchOrganisations",
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

    it("getResults() calls fetchSearchOrganisations action if queryParams exist", () => {
      const wrapper = createWrapper();
      wrapper.vm.getResults("search query");

      expect(actions.fetchSearchOrganisations).toHaveBeenCalledTimes(1);
      expect(actions.fetchSearchOrganisations).toHaveBeenCalledWith(
        expect.anything(),
        "search query",
      );
    });

    it("getResults() does NOT call action if queryParams are empty", () => {
      const wrapper = createWrapper();
      wrapper.vm.getResults("");

      expect(actions.fetchSearchOrganisations).not.toHaveBeenCalled();
    });
  });
});
