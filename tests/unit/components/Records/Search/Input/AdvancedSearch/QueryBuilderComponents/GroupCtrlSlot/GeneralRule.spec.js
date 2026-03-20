import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import GeneralRule from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GroupCtrlSlot/GeneralRule.vue";

describe("GeneralRule.vue", () => {
  let wrapper;
  let mockGroupCtrl;

  beforeEach(() => {
    mockGroupCtrl = {
      addRule: vi.fn(),
    };

    wrapper = shallowMount(GeneralRule, {
      props: {
        groupCtrl: mockGroupCtrl,
      },
    });
  });

  describe("Initial State & Rendering", () => {
    it("renders with an empty selectedGeneralRule and a disabled button", () => {
      expect(wrapper.vm.selectedGeneralRule).toBe("");

      const button = wrapper.find("button");
      // The button should have the disabled attribute when the selection is empty
      expect(button.attributes("disabled")).toBeDefined();
    });

    it("renders the correct number of options in the select dropdown", () => {
      const options = wrapper.findAll("option");
      const rulesCount = wrapper.vm.generalQueryBuilderComponents().length;

      // Expected options: 1 disabled default option + the dynamically generated rules
      expect(options.length).toBe(rulesCount + 1);
      expect(options[0].text()).toBe("Select a generic rule");
      expect(options[0].attributes("disabled")).toBeDefined();
    });

    it("updates selectedGeneralRule data when a new option is selected in the dropdown", async () => {
      const select = wrapper.find("select");
      expect(wrapper.vm.selectedGeneralRule).toBe("");
      await select.setValue("hasPublication");
      expect(wrapper.vm.selectedGeneralRule).toBe("hasPublication");
    });
  });

  describe("Methods: Data Formatting", () => {
    it("generalQueryBuilderComponents() prepends general Type to the sorted array", () => {
      const fullList = wrapper.vm.generalQueryBuilderComponents();

      // Ensure the un-sorted "general Record Type" is securely pinned to index 0
      expect(fullList[0].identifier).toBe("registry");
      expect(fullList[0].name).toBe("Registry");

      // Ensure the rest of the array follows alphabetically
      expect(fullList[1].name).toBe("Subject");
    });
  });

  describe("User Interactions", () => {
    it("enables the button when a rule is selected", async () => {
      const button = wrapper.find("button");
      expect(button.attributes("disabled")).toBeDefined();
      await wrapper.setData({ selectedGeneralRule: "dataCuration" });
      expect(button.attributes("disabled")).toBeUndefined();
    });

    it("addNewRule() triggers groupCtrl.addRule and resets the selection", async () => {
      await wrapper.setData({ selectedGeneralRule: "dataCuration" });
      await wrapper.find("button").trigger("click");
      expect(mockGroupCtrl.addRule).toHaveBeenCalledTimes(1);
      expect(mockGroupCtrl.addRule).toHaveBeenCalledWith("dataCuration");
      expect(wrapper.vm.selectedGeneralRule).toBe("");
    });
  });

  describe("Rule Configurations: initialValue", () => {
    it("ensures function-based initialValues return fresh array references", () => {
      const rules = wrapper.vm.generalQueryBuilderComponents();
      const arrayRule = rules.find((r) => r.identifier === "registry");
      expect(typeof arrayRule.initialValue).toBe("function");
      const firstInstance = arrayRule.initialValue();
      const secondInstance = arrayRule.initialValue();
      expect(firstInstance).toStrictEqual([]);
      expect(secondInstance).toStrictEqual([]);
      expect(firstInstance).not.toBe(secondInstance);
    });

    it("loops through all function-based rules to guarantee none are sharing state", () => {
      const rules = wrapper.vm.generalQueryBuilderComponents();
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
