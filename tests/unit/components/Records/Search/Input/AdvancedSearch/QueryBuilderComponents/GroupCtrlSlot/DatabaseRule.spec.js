import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import DatabaseRule from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/GroupCtrlSlot/DatabaseRule.vue";

describe("DatabaseRule.vue", () => {
  let wrapper;
  let mockGroupCtrl;

  beforeEach(() => {
    // 1. Create a fake groupCtrl prop with a spy on the addRule method
    mockGroupCtrl = {
      addRule: vi.fn(),
    };

    // 2. Mount the component fresh before each test
    wrapper = shallowMount(DatabaseRule, {
      props: {
        groupCtrl: mockGroupCtrl,
      },
    });
  });

  describe("Initial State & Rendering", () => {
    it("renders with an empty selectedDatabaseRule and a disabled button", () => {
      expect(wrapper.vm.selectedDatabaseRule).toBe("");

      const button = wrapper.find("button");
      // The button should have the disabled attribute when the selection is empty
      expect(button.attributes("disabled")).toBeDefined();
    });

    it("renders the correct number of options in the select dropdown", () => {
      const options = wrapper.findAll("option");
      const rulesCount = wrapper.vm.databaseQueryBuilderComponents().length;

      // Expected options: 1 disabled default option + the dynamically generated rules
      expect(options.length).toBe(rulesCount + 1);
      expect(options[0].text()).toBe("Select a database rule");
      expect(options[0].attributes("disabled")).toBeDefined();
    });

    it("updates selectedDatabaseRule data when a new option is selected in the dropdown", async () => {
      const select = wrapper.find("select");
      expect(wrapper.vm.selectedDatabaseRule).toBe("");
      await select.setValue("dataCuration");
      expect(wrapper.vm.selectedDatabaseRule).toBe("dataCuration");
    });
  });

  describe("Methods: Data Formatting", () => {
    it("sortedArrayList() returns rules sorted alphabetically by name", () => {
      const sortedArray = wrapper.vm.sortedArrayList();

      // Spot check a few alphabetical positions to ensure lodash sortBy worked
      expect(sortedArray[0].name).toBe("Access Methods");
      expect(sortedArray[1].name).toBe("Associated Tools");
      // "Uses Persistent Identifier" should be at the very bottom
      expect(sortedArray[sortedArray.length - 1].name).toBe(
        "Uses Persistent Identifier",
      );
    });

    it("databaseQueryBuilderComponents() prepends Database Record Type to the sorted array", () => {
      const fullList = wrapper.vm.databaseQueryBuilderComponents();

      // Ensure the un-sorted "Database Record Type" is securely pinned to index 0
      expect(fullList[0].identifier).toBe("databasetype");
      expect(fullList[0].name).toBe("Database Record Type");

      // Ensure the rest of the array follows alphabetically
      expect(fullList[1].name).toBe("Access Methods");
    });
  });

  describe("User Interactions", () => {
    it("enables the button when a rule is selected", async () => {
      const button = wrapper.find("button");
      expect(button.attributes("disabled")).toBeDefined();

      // Simulate the user selecting a rule from the dropdown
      await wrapper.setData({ selectedDatabaseRule: "dataCuration" });

      // The button should no longer be disabled
      expect(button.attributes("disabled")).toBeUndefined();
    });

    it("addNewRule() triggers groupCtrl.addRule and resets the selection", async () => {
      // 1. Set a selection
      await wrapper.setData({ selectedDatabaseRule: "dataCuration" });

      // 2. Click the button
      await wrapper.find("button").trigger("click");

      // 3. Verify the injected prop method was called with the correct identifier
      expect(mockGroupCtrl.addRule).toHaveBeenCalledTimes(1);
      expect(mockGroupCtrl.addRule).toHaveBeenCalledWith("dataCuration");

      // 4. Verify the component cleaned up its local state (reset dropdown)
      expect(wrapper.vm.selectedDatabaseRule).toBe("");
    });
  });

  describe("Rule Configurations: initialValue", () => {
    it("ensures function-based initialValues return fresh array references", () => {
      // 1. Get the full list of generated rules
      const rules = wrapper.vm.databaseQueryBuilderComponents();

      // 2. Find a rule we know uses an array (e.g., 'databasetype')
      const arrayRule = rules.find((r) => r.identifier === "databasetype");

      // Prove it is actually a factory function
      expect(typeof arrayRule.initialValue).toBe("function");

      // 3. Execute the function twice to simulate the user adding two of the same rule
      const firstInstance = arrayRule.initialValue();
      const secondInstance = arrayRule.initialValue();

      // Prove they both output empty arrays
      expect(firstInstance).toStrictEqual([]);
      expect(secondInstance).toStrictEqual([]);

      // 🚀 CRITICAL CHECK: Prove they do NOT share the same memory reference!
      expect(firstInstance).not.toBe(secondInstance);
    });

    it("loops through all function-based rules to guarantee none are sharing state", () => {
      const rules = wrapper.vm.databaseQueryBuilderComponents();

      // Filter down to only the rules where initialValue is a function
      const functionRules = rules.filter(
        (r) => typeof r.initialValue === "function",
      );

      // Loop through every single one to guarantee they all return isolated arrays
      functionRules.forEach((rule) => {
        expect(rule.initialValue()).toStrictEqual([]);
        expect(rule.initialValue()).not.toBe(rule.initialValue());
      });
    });

    it("verifies string-based initialValues correctly return empty strings", () => {
      const rules = wrapper.vm.databaseQueryBuilderComponents();

      // Find a rule we know uses a string (e.g., 'associatedTools')
      const stringRule = rules.find((r) => r.identifier === "associatedTools");

      // Prove it is a strict empty string, not a function or null
      expect(stringRule.initialValue).toBe("");
    });
  });
});
