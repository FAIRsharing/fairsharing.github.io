import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import DataVersioning from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataVersioning.vue";

describe("DataVersioning.vue", () => {
  let wrapper;

  const createWrapper = (props = {}) => {
    return shallowMount(DataVersioning, {
      props: {
        ...props,
      },
      global: {
        stubs: {
          SelectComponent: true,
        },
      },
    });
  };

  describe("v-model integration with SelectComponent", () => {
    it("can check v-model integration with SelectComponent", async () => {
      const wrapper = createWrapper();
      const selectStub = wrapper.findComponent({ name: "SelectComponent" });
      await selectStub.vm.$emit("update:modelValue", ["FTP", "SPARQL"]);
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toStrictEqual([["FTP", "SPARQL"]]);
    });
  });

  describe("Methods & Watchers", () => {
    it("selectedValue() updates itemSelected", () => {
      wrapper = createWrapper();
      wrapper.vm.selectedValue(["SOAP"]);
      expect(wrapper.vm.itemSelected).toStrictEqual(["SOAP"]);
    });

    it("watches itemSelected and updates itemValue when it changes", async () => {
      wrapper = createWrapper();
      wrapper.vm.itemSelected = ["Bioschemas"];
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.itemValue).toStrictEqual(["Bioschemas"]);
    });
  });

  describe("Computed Properties", () => {
    it("model getter returns itemSelected", () => {
      wrapper = createWrapper();
      // Set the backing data
      wrapper.vm.itemSelected = ["SPARQL"];
      // The computed property should return exactly what we just set
      expect(wrapper.vm.model).toStrictEqual(["SPARQL"]);
    });

    it("model setter emits an 'input' event with the new value", () => {
      wrapper = createWrapper();
      // Trigger the computed setter
      wrapper.vm.model = ["OAI-PMH"];
      // Assert that this.$emit("input", value) was fired
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toEqual([["OAI-PMH"]]);
    });
  });
});
