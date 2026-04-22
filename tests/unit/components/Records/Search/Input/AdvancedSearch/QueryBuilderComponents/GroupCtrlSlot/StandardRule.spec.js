import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import StandardRule from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GroupCtrlSlot/StandardRule.vue";

describe("StandardRule.vue", () => {
  let wrapper;
  let mockGroupCtrl;

  beforeEach(() => {
    mockGroupCtrl = {
      addRule: vi.fn(),
    };

    wrapper = shallowMount(StandardRule, {
      props: {
        groupCtrl: mockGroupCtrl,
      },
    });
  });

  describe("Initial State & Rendering", () => {
    it("renders with an empty selectedStandardRule and a disabled button", () => {
      expect(wrapper.vm.selectedStandardRule).toBe("");

      const button = wrapper.find("button");
      // The button should have the disabled attribute when the selection is empty
      expect(button.attributes("disabled")).toBeDefined();
    });

    it("renders the correct number of options in the select dropdown", () => {
      const options = wrapper.findAll("option");
      const rulesCount = wrapper.vm.standardQueryBuilderComponents().length;

      // Expected options: 1 disabled default option + the dynamically generated rules
      expect(options.length).toBe(rulesCount + 1);
      expect(options[0].text()).toBe("Select a standards rule");
      expect(options[0].attributes("disabled")).toBeDefined();
    });

    it("updates selectedStandardRule data when a new option is selected in the dropdown", async () => {
      const select = wrapper.find("select");
      expect(wrapper.vm.selectedStandardRule).toBe("");
      await select.setValue("resolvable");
      expect(wrapper.vm.selectedStandardRule).toBe("resolvable");
    });
  });

  describe("Methods: Data Formatting", () => {
    it("standardQueryBuilderComponents() prepends general Type to the sorted array", () => {
      const fullList = wrapper.vm.standardQueryBuilderComponents();

      // Ensure the un-sorted "general Record Type" is securely pinned to index 0
      expect(fullList[0].identifier).toBe("standardtype");
      expect(fullList[0].name).toBe("Standard Record Type");

      // Ensure the rest of the array follows alphabetically
      expect(fullList[1].name).toBe("Is Implemented");
    });
  });

  describe("User Interactions", () => {
    it("enables the button when a rule is selected", async () => {
      const button = wrapper.find("button");
      expect(button.attributes("disabled")).toBeDefined();
      await wrapper.setData({ selectedStandardRule: "dataCuration" });
      expect(button.attributes("disabled")).toBeUndefined();
    });

    it("addNewRule() triggers groupCtrl.addRule and resets the selection", async () => {
      await wrapper.setData({ selectedStandardRule: "dataCuration" });
      await wrapper.find("button").trigger("click");
      expect(mockGroupCtrl.addRule).toHaveBeenCalledTimes(1);
      expect(mockGroupCtrl.addRule).toHaveBeenCalledWith("dataCuration");
      expect(wrapper.vm.selectedStandardRule).toBe("");
    });
  });

  describe("Rule Configurations: initialValue", () => {
    it("ensures function-based initialValues return fresh array references", () => {
      const rules = wrapper.vm.standardQueryBuilderComponents();
      const arrayRule = rules.find((r) => r.identifier === "standardtype");
      expect(typeof arrayRule.initialValue).toBe("function");
      const firstInstance = arrayRule.initialValue();
      const secondInstance = arrayRule.initialValue();
      expect(firstInstance).toStrictEqual([]);
      expect(secondInstance).toStrictEqual([]);
      expect(firstInstance).not.toBe(secondInstance);
    });

    it("loops through all function-based rules to guarantee none are sharing state", () => {
      const rules = wrapper.vm.standardQueryBuilderComponents();
      const functionRules = rules.filter(
        (r) => typeof r.initialValue === "function",
      );
      functionRules.forEach((rule) => {
        expect(rule.initialValue()).toStrictEqual([]);
        expect(rule.initialValue()).not.toBe(rule.initialValue());
      });
    });
  });
});
