import { afterEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SelectComponent from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/UtilComponents/SelectComponent.vue";
import {
  VAutocompleteStub,
  VIconStub,
  VTooltipStub,
} from "../../../../../../../../stubs/index.js";

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
  const wrappers = [];
  const createWrapper = (props = {}) => {
    const wrapper = shallowMount(SelectComponent, {
      props: {
        ...props,
      },
      global: {
        stubs: {
          VCombobox: VAutocompleteStub,
          VTooltip: VTooltipStub,
          VIcon: VIconStub,
        },
      },
    });
    wrappers.push(wrapper);
    return wrapper;
  };

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    vi.restoreAllMocks();
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

  describe("Computed Property: formattedItems", () => {
    it("cleans and capitalizes the itemList prop", () => {
      const wrapper = createWrapper({
        itemList: ["   APPLES   ", "baNAna", " cherries"],
      });
      expect(wrapper.vm.formattedItems).toStrictEqual([
        {
          title: "Apples",
          value: "   APPLES   ",
        },
        {
          title: "Banana",
          value: "baNAna",
        },
        {
          title: "Cherries",
          value: " cherries",
        },
      ]);
    });

    it("returns an empty array if itemList is empty", () => {
      const wrapper = createWrapper();
      expect(wrapper.vm.formattedItems).toStrictEqual([]);
    });
  });

  describe("Template Bindings & Two-Way Data Flow", () => {
    it("emits 'input' up to the parent when v-combobox updates", async () => {
      const wrapper = createWrapper();
      const combobox = wrapper.findComponent(VAutocompleteStub);
      await combobox.vm.$emit("update:modelValue", ["Grapes"]);
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toStrictEqual([["Grapes"]]);
    });
  });

  it("renders selected chips, formatted options and tooltip content", () => {
    const selected = { title: "Apples", value: "APPLES" };
    const wrapper = createWrapper({
      itemList: ["APPLES", "bananas"],
      itemValue: [selected],
      toolTipText: "Select fruit",
    });
    const input = wrapper.findComponent(VAutocompleteStub);
    expect(input.props("items")).toEqual([
      { title: "Apples", value: "APPLES" },
      { title: "Bananas", value: "bananas" },
    ]);
    expect(wrapper.findComponent({ name: "VChip" }).props("text")).toBe(
      "Apples",
    );
    expect(wrapper.text()).toContain("Select fruit");
    expect(wrapper.get('[data-test="v-icon"]').text()).toContain(
      "fas fa-question-circle",
    );
  });

  it("reflects parent updates to options and selected values without emitting input", async () => {
    const wrapper = createWrapper();
    await wrapper.setProps({ itemList: ["PEARS"], itemValue: ["PEARS"] });
    const input = wrapper.findComponent(VAutocompleteStub);
    expect(input.props("items")).toEqual([{ title: "Pears", value: "PEARS" }]);
    expect(input.props("modelValue")).toEqual(["PEARS"]);
    expect(wrapper.emitted("input")).toBeUndefined();
    input.vm.$emit("update:modelValue", []);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("input")).toEqual([[[]]]);
    expect(wrapper.props("itemValue")).toEqual(["PEARS"]);
  });

  it("uses the real string utility to format underscore-separated options", async () => {
    const { default: stringUtils } = await vi.importActual(
      "@/utils/stringUtils",
    );
    const wrapper = createWrapper({ itemList: ["read_and_write"] });
    vi.spyOn(wrapper.vm, "cleanString").mockImplementation(
      stringUtils.methods.cleanString,
    );
    await wrapper.setProps({ itemList: ["read_and_write", "READ_ONLY"] });
    expect(wrapper.vm.formattedItems).toEqual([
      { title: "Read and write", value: "read_and_write" },
      { title: "Read only", value: "READ_ONLY" },
    ]);
  });
});
