import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import PolicyRule from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GroupCtrlSlot/PolicyRule.vue";

describe("PolicyRule.vue", () => {
  let wrapper;
  let mockGroupCtrl;

  beforeEach(() => {
    mockGroupCtrl = {
      addRule: vi.fn(),
    };

    wrapper = shallowMount(PolicyRule, {
      props: {
        groupCtrl: mockGroupCtrl,
      },
    });
  });

  describe("Initial State & Rendering", () => {
    it("renders with an empty selectedPolicyRule and a disabled button", () => {
      expect(wrapper.vm.selectedPolicyRule).toBe("");

      const button = wrapper.find("button");
      // The button should have the disabled attribute when the selection is empty
      expect(button.attributes("disabled")).toBeDefined();
    });

    it("renders the correct number of options in the select dropdown", () => {
      const options = wrapper.findAll("option");
      const rulesCount = wrapper.vm.policyQueryBuilderComponents().length;

      // Expected options: 1 disabled default option + the dynamically generated rules
      expect(options.length).toBe(rulesCount + 1);
      expect(options[0].text()).toBe("Select a policy rule");
      expect(options[0].attributes("disabled")).toBeDefined();
    });

    it("updates selectedPolicyRule data when a new option is selected in the dropdown", async () => {
      const select = wrapper.find("select");
      expect(wrapper.vm.selectedPolicyRule).toBe("");
      await select.setValue("timingOfDmp");
      expect(wrapper.vm.selectedPolicyRule).toBe("timingOfDmp");
    });
  });

  describe("Methods: Data Formatting", () => {
    it("policyQueryBuilderComponents() prepends general Type to the sorted array", () => {
      const fullList = wrapper.vm.policyQueryBuilderComponents();

      // Ensure the un-sorted "general Record Type" is securely pinned to index 0
      expect(fullList[0].identifier).toBe("policytype");
      expect(fullList[0].name).toBe("Policy Record Type");

      // Ensure the rest of the array follows alphabetically
      expect(fullList[1].name).toBe("Data Availability Statement");
    });
  });

  describe("User Interactions", () => {
    it("enables the button when a rule is selected", async () => {
      const button = wrapper.find("button");
      expect(button.attributes("disabled")).toBeDefined();
      await wrapper.setData({ selectedPolicyRule: "dataCuration" });
      expect(button.attributes("disabled")).toBeUndefined();
    });

    it("addNewRule() triggers groupCtrl.addRule and resets the selection", async () => {
      await wrapper.setData({ selectedPolicyRule: "dataCuration" });
      await wrapper.find("button").trigger("click");
      expect(mockGroupCtrl.addRule).toHaveBeenCalledTimes(1);
      expect(mockGroupCtrl.addRule).toHaveBeenCalledWith("dataCuration");
      expect(wrapper.vm.selectedPolicyRule).toBe("");
    });
  });

  describe("Rule Configurations: initialValue", () => {
    it("ensures function-based initialValues return fresh array references", () => {
      const rules = wrapper.vm.policyQueryBuilderComponents();
      const arrayRule = rules.find((r) => r.identifier === "policytype");
      expect(typeof arrayRule.initialValue).toBe("function");
      const firstInstance = arrayRule.initialValue();
      const secondInstance = arrayRule.initialValue();
      expect(firstInstance).toStrictEqual([]);
      expect(secondInstance).toStrictEqual([]);
      expect(firstInstance).not.toBe(secondInstance);
    });

    it("loops through all function-based rules to guarantee none are sharing state", () => {
      const rules = wrapper.vm.policyQueryBuilderComponents();
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
