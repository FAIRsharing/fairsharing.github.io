import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SelectComponent from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/UtilComponents/SelectComponent.vue";

// Intercept the mixin import to provide a safe, predictable mock
vi.mock("@/utils/stringUtils", () => ({
  default: {
    methods: {
      // Provide a dummy implementation so we can test the formatting flow
      cleanString: (str) => (str ? str.trim().toLowerCase() : ""),
    },
  },
}));

describe("SelectComponent.vue", () => {
  const createWrapper = (props = {}) => {
    return shallowMount(SelectComponent, {
      props: {
        ...props,
      },
      global: {
        stubs: {
          "v-combobox": {
            name: "v-combobox",
            template: `
              <div class="v-combobox-stub">
                <slot name="prepend"></slot>
                <slot name="chip" :props="{}" :item="{ raw: { title: 'Mock Chip' } }"></slot>
              </div>
            `,
            props: ["modelValue", "items", "multiple", "chips"],
          },
          "v-tooltip": {
            name: "v-tooltip",
            template: `
              <div class="v-tooltip-stub">
                <slot name="activator" :props="{}"></slot>
                <slot></slot>
              </div>
            `,
          },
          "v-chip": true,
          "v-icon": true,
        },
      },
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Computed Property: model", () => {
    it("getter: returns the itemValue prop", () => {
      const wrapper = createWrapper({
        itemValue: ["Selected 1", "Selected 2"],
      });
      expect(wrapper.vm.model).toStrictEqual(["Selected 1", "Selected 2"]);
    });

    it("setter: emits 'input' event with the updated array", () => {
      const wrapper = createWrapper();
      const newSelection = ["New Option"];
      wrapper.vm.model = newSelection;

      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toEqual([newSelection]);
    });
  });

  describe("Computed Property: cleanTextList", () => {
    it("cleans and capitalizes the itemList prop", () => {
      const wrapper = createWrapper({
        itemList: ["   APPLES   ", "baNAna", " cherries"],
      });
      expect(wrapper.vm.cleanTextList).toStrictEqual([
        "Apples",
        "Banana",
        "Cherries",
      ]);
    });

    it("returns an empty array if itemList is empty", () => {
      const wrapper = createWrapper();
      expect(wrapper.vm.cleanTextList).toStrictEqual([]);
    });
  });

  describe("Template Bindings & Two-Way Data Flow", () => {
    it("emits 'input' up to the parent when v-combobox updates", async () => {
      const wrapper = createWrapper();
      const combobox = wrapper.findComponent({ name: "v-combobox" });
      await combobox.vm.$emit("update:modelValue", ["Grapes"]);
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toStrictEqual([["Grapes"]]);
    });
  });
});
