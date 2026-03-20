import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FairassistRule from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GroupCtrlSlot/FairassistRule.vue";

describe("FairassistRule.vue", () => {
  let wrapper;
  let mockGroupCtrl;

  beforeEach(() => {
    mockGroupCtrl = {
      addRule: vi.fn(),
    };

    wrapper = shallowMount(FairassistRule, {
      props: {
        groupCtrl: mockGroupCtrl,
      },
    });
  });

  describe("Initial State & Rendering", () => {
    it("renders with an empty selectedFairassistRule and a disabled button", () => {
      expect(wrapper.vm.selectedFairassistRule).toBe("");

      const button = wrapper.find("button");
      // The button should have the disabled attribute when the selection is empty
      expect(button.attributes("disabled")).toBeDefined();
    });

    it("renders the correct number of options in the select dropdown", () => {
      const options = wrapper.findAll("option");
      const rulesCount = wrapper.vm.fairassistQueryBuilderComponents().length;

      // Expected options: 1 disabled default option + the dynamically generated rules
      expect(options.length).toBe(rulesCount + 1);
      expect(options[0].text()).toBe("Select a FAIRassist rule");
      expect(options[0].attributes("disabled")).toBeDefined();
    });

    it("updates selectedFairassistRule data when a new option is selected in the dropdown", async () => {
      const select = wrapper.find("select");
      expect(wrapper.vm.selectedFairassistRule).toBe("");
      await select.setValue("negativeExamples");
      expect(wrapper.vm.selectedFairassistRule).toBe("negativeExamples");
    });
  });

  describe("Methods: Data Formatting", () => {
    it("sortedArrayList() returns rules sorted alphabetically by name", () => {
      const sortedArray = wrapper.vm.sortedArrayList();

      // Spot check a few alphabetical positions to ensure lodash sortBy worked
      expect(sortedArray[0].name).toBe("Associated Tests");
      expect(sortedArray[1].name).toBe("Associated Tools");
      // "Uses Persistent Identifier" should be at the very bottom
      expect(sortedArray[sortedArray.length - 1].name).toBe(
        "Positive Examples",
      );
    });

    it("fairassistQueryBuilderComponents() prepends Fairassist Type to the sorted array", () => {
      const fullList = wrapper.vm.fairassistQueryBuilderComponents();

      // Ensure the un-sorted "FAIRassist Record Type" is securely pinned to index 0
      expect(fullList[0].identifier).toBe("fairassisttype");
      expect(fullList[0].name).toBe("FAIRassist Record Type");

      // Ensure the rest of the array follows alphabetically
      expect(fullList[1].name).toBe("Associated Tests");
    });
  });

  describe("User Interactions", () => {
    it("enables the button when a rule is selected", async () => {
      const button = wrapper.find("button");
      expect(button.attributes("disabled")).toBeDefined();
      await wrapper.setData({ selectedFairassistRule: "dataCuration" });
      expect(button.attributes("disabled")).toBeUndefined();
    });

    it("addNewRule() triggers groupCtrl.addRule and resets the selection", async () => {
      await wrapper.setData({ selectedFairassistRule: "dataCuration" });
      await wrapper.find("button").trigger("click");
      expect(mockGroupCtrl.addRule).toHaveBeenCalledTimes(1);
      expect(mockGroupCtrl.addRule).toHaveBeenCalledWith("dataCuration");
      expect(wrapper.vm.selectedFairassistRule).toBe("");
    });
  });

  describe("Rule Configurations: initialValue", () => {
    it("ensures function-based initialValues return fresh array references", () => {
      const rules = wrapper.vm.fairassistQueryBuilderComponents();
      const arrayRule = rules.find((r) => r.identifier === "fairassisttype");
      expect(typeof arrayRule.initialValue).toBe("function");
      const firstInstance = arrayRule.initialValue();
      const secondInstance = arrayRule.initialValue();
      expect(firstInstance).toStrictEqual([]);
      expect(secondInstance).toStrictEqual([]);
      expect(firstInstance).not.toBe(secondInstance);
    });

    it("loops through all function-based rules to guarantee none are sharing state", () => {
      const rules = wrapper.vm.fairassistQueryBuilderComponents();
      const functionRules = rules.filter(
        (r) => typeof r.initialValue === "function",
      );
      functionRules.forEach((rule) => {
        expect(rule.initialValue()).toStrictEqual([]);
        expect(rule.initialValue()).not.toBe(rule.initialValue());
      });
    });

    it("verifies string-based initialValues correctly return empty strings", () => {
      const rules = wrapper.vm.fairassistQueryBuilderComponents();
      const stringRule = rules.find((r) => r.identifier === "associatedTools");
      expect(stringRule.initialValue).toBe("");
    });
  });
});
