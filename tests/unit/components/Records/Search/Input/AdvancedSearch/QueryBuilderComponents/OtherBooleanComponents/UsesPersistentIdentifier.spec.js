import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import UsesPersistentIdentifier from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/OtherBooleanComponents/UsesPersistentIdentifier.vue";

describe("UsesPersistentIdentifier.vue", () => {
  let wrapper;

  const createWrapper = (props = {}) => {
    return shallowMount(UsesPersistentIdentifier, {
      props: {
        ...props,
      },
      global: {
        stubs: {
          RadioComponent: true,
        },
      },
    });
  };

  describe("v-model integration with RadioComponent", () => {
    it("can check v-model integration with RadioComponent", async () => {
      const wrapper = createWrapper();
      const selectStub = wrapper.findComponent({ name: "RadioComponent" });
      await selectStub.vm.$emit("update:modelValue", ["FTP", "SPARQL"]);
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toStrictEqual([["FTP", "SPARQL"]]);
    });
  });

  describe("Methods & Watchers", () => {
    it("selectedValue() updates itemSelected", () => {
      wrapper = createWrapper();
      wrapper.vm.selectedValue("cool_library");

      expect(wrapper.vm.itemSelected).toBe("cool_library");
    });

    it("watches itemSelected and updates itemValue when it changes", async () => {
      wrapper = createWrapper();
      wrapper.vm.itemSelected = "another_library";
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.itemValue).toBe("another_library");
    });
  });

  describe("Computed Properties", () => {
    it("model getter returns the value prop", () => {
      const wrapper = createWrapper({ value: "custom_tool" });
      expect(wrapper.vm.model).toBe("custom_tool");
    });

    it("model setter emits an 'input' event with the new value", () => {
      const wrapper = createWrapper();
      wrapper.vm.model = "new_tool_selected";
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toEqual(["new_tool_selected"]);
    });
  });
});
