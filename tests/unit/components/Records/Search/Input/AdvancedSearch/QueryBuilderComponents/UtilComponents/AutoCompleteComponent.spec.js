import { afterEach, describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import AutoCompleteComponent from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/UtilComponents/AutoCompleteComponent.vue";
import {
  VAutocompleteStub,
  VIconStub,
  VTooltipStub,
} from "../../../../../../../../stubs/index.js";

describe("AutoCompleteComponent.vue", () => {
  const wrappers = [];
  const createWrapper = (props = {}) => {
    const wrapper = shallowMount(AutoCompleteComponent, {
      props: {
        ...props,
      },
      global: {
        stubs: {
          VAutocomplete: VAutocompleteStub,
          VTooltip: VTooltipStub,
          VIcon: VIconStub,
        },
      },
    });
    wrappers.push(wrapper);
    return wrapper;
  };

  afterEach(() => wrappers.splice(0).forEach((wrapper) => wrapper.unmount()));

  describe("v-autocomplete Two-Way Bindings (v-model)", () => {
    it("binds v-model correctly to the computed 'model'", async () => {
      const wrapper = createWrapper({ itemValue: ["Initial Data"] });
      const autocomplete = wrapper.findComponent(VAutocompleteStub);
      expect(autocomplete.props("modelValue")).toStrictEqual(["Initial Data"]);
      await autocomplete.vm.$emit("update:modelValue", ["New Selection"]);
      expect(wrapper.emitted().input).toBeTruthy();
      expect(wrapper.emitted().input[0]).toStrictEqual([["New Selection"]]);
    });

    it("binds v-model:search correctly to the internal 'search' data", async () => {
      const wrapper = createWrapper();
      const autocomplete = wrapper.findComponent(VAutocompleteStub);
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

  it("renders selected chip titles and the tooltip from their slots", () => {
    const selected = { title: "Genomics", value: "genomics" };
    const wrapper = createWrapper({
      itemList: [selected],
      itemValue: [selected],
      toolTipText: "Choose subjects",
      loading: true,
    });
    const input = wrapper.findComponent(VAutocompleteStub);
    expect(input.props("items")).toEqual([selected]);
    expect(input.props("loading")).toBe(true);
    const chip = wrapper.findComponent({ name: "VChip" });
    expect(chip.props("text")).toBe("Genomics");
    expect(chip.props("color")).toBe("blue");
    expect(wrapper.text()).toContain("Choose subjects");
    expect(wrapper.get('[data-test="v-icon"]').text()).toContain(
      "fas fa-question-circle",
    );
  });

  it("updates selections and loading from parent props without emitting input", async () => {
    const wrapper = createWrapper();
    const selected = [{ title: "Biology", value: "biology" }];
    await wrapper.setProps({
      itemValue: selected,
      itemList: selected,
      loading: true,
    });
    expect(
      wrapper.findComponent(VAutocompleteStub).props("modelValue"),
    ).toEqual(selected);
    expect(wrapper.findComponent(VAutocompleteStub).props("loading")).toBe(
      true,
    );
    expect(wrapper.emitted("input")).toBeUndefined();
    await wrapper.setProps({ itemValue: [], loading: false });
    expect(wrapper.findComponent({ name: "VChip" }).exists()).toBe(false);
    expect(wrapper.findComponent(VAutocompleteStub).props("loading")).toBe(
      false,
    );
  });

  it("emits searches at the three-character boundary and ignores clearing a previous query", async () => {
    const wrapper = createWrapper();
    const input = wrapper.findComponent(VAutocompleteStub);
    input.vm.$emit("update:search", "abc");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("fetchData")).toEqual([["abc"]]);
    for (const search of [null, "", "ab"]) {
      input.vm.$emit("update:search", search);
      await wrapper.vm.$nextTick();
    }
    expect(wrapper.emitted("fetchData")).toEqual([["abc"]]);
    input.vm.$emit("update:modelValue", []);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("input")).toEqual([[[]]]);
  });
});
