import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import AutoCompleteComponent from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/UtilComponents/AutoCompleteComponent.vue";

describe("AutoCompleteComponent.vue", () => {
  const createWrapper = (props = {}) => {
    return shallowMount(AutoCompleteComponent, {
      props: {
        ...props,
      },
      global: {
        stubs: {
          "v-autocomplete": {
            name: "v-autocomplete",
            template: `
              <div class="v-autocomplete-stub">
                <slot name="prepend"></slot>
                <slot name="chip" :props="{}" :item="{ raw: { title: 'Mock Title' } }"></slot>
              </div>
            `,
            props: ["modelValue", "search", "items", "loading", "prefix"],
          },
          "v-chip": true,
          "v-tooltip": true,
          "v-icon": true,
        },
      },
    });
  };

  describe("v-autocomplete Two-Way Bindings (v-model)", () => {
    it("binds v-model correctly to the computed 'model'", async () => {
      const wrapper = createWrapper({ itemValue: ["Initial Data"] });
      const autocomplete = wrapper.findComponent({ name: "v-autocomplete" });
      expect(autocomplete.props("modelValue")).toStrictEqual(["Initial Data"]);
      await autocomplete.vm.$emit("update:modelValue", ["New Selection"]);
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toStrictEqual([["New Selection"]]);
    });

    it("binds v-model:search correctly to the internal 'search' data", async () => {
      const wrapper = createWrapper();
      const autocomplete = wrapper.findComponent({ name: "v-autocomplete" });
      wrapper.vm.search = "query";
      await wrapper.vm.$nextTick();

      expect(autocomplete.props("search")).toBe("query");
      await autocomplete.vm.$emit("update:search", "apple");
      expect(wrapper.vm.search).toBe("apple");
    });
  });

  describe("Computed Property: model", () => {
    it("getter: returns the itemValue prop", () => {
      const wrapper = createWrapper({ itemValue: ["Item 1", "Item 2"] });
      expect(wrapper.vm.model).toStrictEqual(["Item 1", "Item 2"]);
    });

    it("setter: emits 'input' event with the updated value", () => {
      const wrapper = createWrapper();
      const newValue = ["New Item"];
      // Trigger the computed setter
      wrapper.vm.model = newValue;
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toEqual([newValue]);
    });
  });

  describe("Watcher: search", () => {
    it("does NOT emit 'fetchData' if search value is null", async () => {
      const wrapper = createWrapper();
      wrapper.vm.search = null;
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted().fetchData).toBeFalsy();
    });

    it("does NOT emit 'fetchData' if search value length is less than 3", async () => {
      const wrapper = createWrapper();
      wrapper.vm.search = "ab"; // Only 2 characters
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted().fetchData).toBeFalsy();
    });

    it("emits 'fetchData' with trimmed string if search value length is 3 or more", async () => {
      const wrapper = createWrapper();
      // We add spaces to ensure .trim() is working!
      wrapper.vm.search = "  apple  ";
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted().fetchData).toBeTruthy();
      // Notice it expects "apple" without the spaces
      expect(wrapper.emitted().fetchData[0]).toEqual(["apple"]);
    });
  });
});
