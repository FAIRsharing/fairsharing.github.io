import { describe, expect, it } from "vitest";
import * as Curators from "@/components/Curators/index.js";

describe("Dynamic Component Imports", () => {
  const expectedComponents = [
    "DownloadRecords",
    "HiddenRecords",
    "IncompleteRecords",
    "MaintenanceRequests",
    "RecentCuratorCreation",
    "CuratorRecordsAwaitingApproval",
    "SystemMessages",
    "UserRecordsAwaitingApproval",
  ];

  it("should export all defined curator components", () => {
    expectedComponents.forEach((componentName) => {
      // Check if the component exists in the export object
      expect(Curators[componentName]).toBeDefined();

      // Ensure it is a valid Vue component (object or function)
      expect(typeof Curators[componentName]).toMatch(/object|function/);
    });
  });

  it("should not have any undefined exports", () => {
    // This catches typos in the index.js file itself
    Object.keys(Curators).forEach((exportName) => {
      expect(Curators[exportName]).not.toBeUndefined();
    });
  });
});
