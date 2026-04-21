import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Registry from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GeneralComponents/Registry.vue";
import { createStore } from "vuex";

describe("Registry.vue", () => {
  let wrapper;
  let actions, getters;
  let store;

  beforeEach(() => {
    getters = {
      getRecordTypes: () => [],
    };
    actions = {
      fetchAllRecordTypes: vi.fn(),
    };
    store = createStore({
      modules: {
        recordTypes: {
          namespaced: true,
          actions,
          getters,
        },
      },
    });

    wrapper = shallowMount(Registry, {
      global: {
        plugins: [store],
        stubs: { SelectComponent: true },
      },
      props: {
        value: ["Initial Value"],
      },
    });
  });

  describe("v-model integration with SelectComponent", () => {
    it("can check v-model integration with SelectComponent", async () => {
      const selectStub = wrapper.findComponent({ name: "SelectComponent" });
      await selectStub.vm.$emit("update:modelValue", ["FTP", "SPARQL"]);
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toStrictEqual([["FTP", "SPARQL"]]);
    });
  });

  describe("Methods & Watchers", () => {
    it("selectedValue() updates itemSelected", () => {
      wrapper.vm.selectedValue(["SOAP"]);
      expect(wrapper.vm.itemSelected).toStrictEqual(["SOAP"]);
    });

    it("watches itemSelected and updates itemValue when it changes", async () => {
      wrapper.vm.itemSelected = ["Bioschemas"];
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.itemValue).toStrictEqual(["Bioschemas"]);
    });
  });

  describe("Computed Properties", () => {
    it("model getter returns itemSelected", () => {
      // Set the backing data
      wrapper.vm.itemSelected = ["SPARQL"];
      // The computed property should return exactly what we just set
      expect(wrapper.vm.model).toStrictEqual(["SPARQL"]);
    });

    it("model setter emits an 'input' event with the new value", () => {
      // Trigger the computed setter
      wrapper.vm.model = ["OAI-PMH"];
      // Assert that this.$emit("input", value) was fired
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toEqual([["OAI-PMH"]]);
    });
  });
});
