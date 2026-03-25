import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import RadioComponent from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/UtilComponents/RadioComponent.vue";

describe("RadioComponent.vue", () => {
  const createWrapper = (props = {}) => {
    return shallowMount(RadioComponent, {
      props: {
        ...props,
      },
      global: {
        stubs: {
          "v-radio-group": true,
          "v-radio": true,
          "v-tooltip": true,
          "v-icon": true,
        },
      },
    });
  };

  describe("Computed Property: model", () => {
    it("getter: returns the itemValue prop", () => {
      const wrapper = createWrapper({ itemValue: "false" });
      expect(wrapper.vm.model).toBe("false");
    });

    it("setter: emits 'input' event when assigned a new value programmatically", () => {
      const wrapper = createWrapper();
      wrapper.vm.model = "true";
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toEqual(["true"]);
    });
  });

  describe("Template Bindings & Events", () => {
    it("passes the computed model to v-radio-group as modelValue", () => {
      const wrapper = createWrapper({ itemValue: "true" });
      const radioGroup = wrapper.findComponent({ name: "v-radio-group" });
      expect(radioGroup.props("modelValue")).toBe("true");
    });

    it("emits 'update:modelValue' when v-radio-group updates", () => {
      const wrapper = createWrapper();
      const radioGroup = wrapper.findComponent({ name: "v-radio-group" });
      radioGroup.vm.$emit("update:model-value", "false");
      expect(wrapper.emitted()["update:modelValue"]).toBeTruthy();
      expect(wrapper.emitted()["update:modelValue"][0]).toEqual(["false"]);
    });
  });
});
