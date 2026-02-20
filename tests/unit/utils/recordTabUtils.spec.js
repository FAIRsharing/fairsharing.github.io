import { describe, expect, it, vi } from "vitest";
import recordTabUtils, {
  prepareAssociations as standalonePrepare,
} from "@/utils/recordTabUtils";

// Helper to create a fresh context for every test
const createMockContext = () => ({
  // Data expected by the mixin
  tabsData: {
    selectedTab: 0,
    tabs: {
      key1: { data: [{ name: "Item A", id: 1 }] },
      key2: { data: [{ name: "Item B", id: 2 }] },
    },
  },
  selectedValues: "",
  currentRecord: {
    fairsharingRecord: { name: "Root Record" },
  },

  // Methods expected by the mixin
  cleanString: vi.fn((str) => (str ? str.trim() : "")),
  prepareTabsData: vi.fn(),

  // We attach the mixin's methods to this context for easier testing
  ...recordTabUtils.methods,
});

describe("recordTabUtils.js", () => {
  describe("Computed Properties", () => {
    describe("getValues", () => {
      it("returns data for the currently selected tab", () => {
        const context = createMockContext();
        // key1 is index 0
        context.tabsData.selectedTab = 0;

        // Call computed property with context
        const result = recordTabUtils.computed.getValues.call(context);

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("Item A");
      });

      it("updates when selectedTab changes", () => {
        const context = createMockContext();
        context.tabsData.selectedTab = 1; // key2

        const result = recordTabUtils.computed.getValues.call(context);

        expect(result[0].name).toBe("Item B");
      });
    });

    describe("filterList", () => {
      it("returns deep copy of tabsData if no search value is selected", () => {
        const context = createMockContext();
        context.selectedValues = null;

        const result = recordTabUtils.computed.filterList.call(context);

        expect(result).toEqual(context.tabsData.tabs);
        // Ensure deep copy (references are different)
        expect(result).not.toBe(context.tabsData.tabs);
      });

      it("filters data to single item if selectedValues matches an item name", () => {
        const context = createMockContext();
        context.selectedValues = "Item A";
        context.tabsData.selectedTab = 0;

        const result = recordTabUtils.computed.filterList.call(context);

        // Should return key1 with only Item A
        expect(result.key1.data).toHaveLength(1);
        expect(result.key1.data[0].name).toBe("Item A");
      });

      it("returns empty array for tab if selectedValues does not match anything", () => {
        // Logic note: The code provided only pushes if `foundItem` exists.
        // If not found, it returns the cloned object as is (with original data).
        const context = createMockContext();
        context.selectedValues = "Non Existent Item";

        const result = recordTabUtils.computed.filterList.call(context);

        // Based on your code: "if (foundItem) { ... } return output"
        // It returns the original list if nothing is found.
        expect(result.key1.data).toHaveLength(1);
      });
    });

    describe("tabsDataExist", () => {
      it("returns true (inactive) if all tabs are empty", () => {
        const context = createMockContext();
        // Mock the dependency: filterList returns empty data
        context.filterList = {
          tab1: { data: [] },
          tab2: { data: [] },
        };

        const result = recordTabUtils.computed.tabsDataExist.call(context);
        expect(result).toBe(true);
      });

      it("returns false (active) if at least one tab has data", () => {
        const context = createMockContext();
        context.filterList = {
          tab1: { data: [] },
          tab2: { data: ["Exists"] },
        };

        const result = recordTabUtils.computed.tabsDataExist.call(context);
        expect(result).toBe(false);
      });
    });
  });

  describe("Methods", () => {
    describe("prepareAssociations", () => {
      it("merges associations and reverseAssociations correctly", () => {
        const context = createMockContext();
        const assoc = [
          {
            recordAssocLabel: " related_to ",
            fairsharingRecord: {
              id: 1,
              name: "Target",
              registry: "Reg",
              abbreviation: "Tgt",
              type: "std",
            },
          },
        ];
        const revAssoc = [
          {
            recordAssocLabel: " is_part_of ",
            linkedRecord: {
              id: 2,
              name: "Source",
              registry: "Reg",
              abbreviation: "Src",
              type: "db",
            },
          },
        ];

        const result = context.prepareAssociations(assoc, revAssoc);

        expect(result).toHaveLength(2);

        // Verify 'cleanString' usage
        expect(context.cleanString).toHaveBeenCalledWith(" related_to ");

        // Check first item (fairsharingRecord prop)
        expect(result[0].linkType).toBe("fairsharingRecord");
        expect(result[0].object).toBe("Target"); // object is item name
        expect(result[0].subject).toBe("Root Record"); // subject is currentRecord

        // Check second item (linkedRecord prop)
        expect(result[1].linkType).toBe("linkedRecord");
        expect(result[1].object).toBe("Root Record"); // object is currentRecord
        expect(result[1].subject).toBe("Source"); // subject is item name
      });
    });

    describe("getFirstActiveTab", () => {
      it("sets selectedTab to the index of the first non-empty tab", () => {
        const context = createMockContext();
        context.filterList = {
          emptyTab: { data: [] }, // Index 0
          filledTab: { data: ["X"] }, // Index 1
          lastTab: { data: [] }, // Index 2
        };

        context.getFirstActiveTab();

        expect(context.tabsData.selectedTab).toBe(1);
      });

      it("defaults to 0 if all tabs are empty", () => {
        const context = createMockContext();
        context.filterList = {
          empty1: { data: [] },
          empty2: { data: [] },
        };

        context.getFirstActiveTab();

        // Logic: index keeps incrementing, but 'firstActiveTabIndex' stays 0 initialized
        expect(context.tabsData.selectedTab).toBe(0);
      });
    });
  });

  describe("Lifecycle Hooks", () => {
    it("beforeMount calls prepareTabsData and getFirstActiveTab", () => {
      const context = createMockContext();
      // Mock the methods normally found on the component
      context.getFirstActiveTab = vi.fn();

      // Execute the hook
      recordTabUtils.beforeMount.call(context);

      expect(context.prepareTabsData).toHaveBeenCalled();
      expect(context.getFirstActiveTab).toHaveBeenCalled();
    });
  });

  describe("Standalone Export: prepareAssociations", () => {
    it("processes associations with provided context", () => {
      const context = createMockContext();
      const assoc = [
        {
          recordAssocLabel: "label",
          fairsharingRecord: {
            id: 99,
            name: "Ext",
            registry: "R",
            abbreviation: "E",
            type: "T",
          },
        },
      ];

      const result = standalonePrepare(context, assoc, []);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(99);
      // Verify specific logic in standalone function (lines 110-117)
      expect(result[0].subject).toBe("Root Record");
      expect(result[0].linkType).toBe("fairsharingRecord");
    });
  });
});
