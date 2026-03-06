import { describe, expect, it, vi } from "vitest";
// import recordTypesStore from "@/store/AdvancedSearchComponents/recordTypes";
import {
  recordTypes,
  removeItem,
  uniqueValues,
} from "@/utils/advancedSearchUtils.js";

let lodash = require("lodash");

describe("advancedSearchUtils.js", function () {
  it("method uniqueValues should result unique array without duplicate values", function () {
    const item = [
      {
        identifier: "registry",
        value: ["database"],
      },
      {
        identifier: "registry",
        value: ["database"],
      },
      {
        identifier: "subjects",
        value: "s1",
      },
      {
        identifier: "subjects",
        value: "s2",
      },
    ];
    const result = [
      {
        identifier: "registry",
        value: ["database"],
      },
      {
        identifier: "subjects",
        value: ["s1", "s2"],
      },
    ];
    const uniqueValuesFn = uniqueValues(item);
    lodash.uniqWith = vi.fn(() => item);

    expect(uniqueValuesFn).toStrictEqual(result);
  });

  it("method removeItem should remove the selected item from the array", function () {
    let inputArr = ["A", "B", "C", "D"];
    let resultArr = ["A", "B", "C"];

    //When item is present in the array -- if condition
    removeItem("D", inputArr);
    expect(inputArr).toStrictEqual(resultArr);

    //When item is not present in the array -- else condition
    removeItem("E", inputArr);
    expect(inputArr).toStrictEqual(inputArr);
  });

  describe("filteredRecordTypes", () => {
    it("returns only record names that match the given registry", () => {
      const mockContext = {
        getRecordTypes: [
          { name: "Dataset", fairsharingRegistry: { name: "RegistryA" } },
          { name: "Collection", fairsharingRegistry: { name: "RegistryA" } },
          { name: "Standard", fairsharingRegistry: { name: "RegistryB" } },
        ],
      };

      const filterMethod = recordTypes.methods.filteredRecordTypes;

      const result = filterMethod.call(mockContext, "RegistryA");

      expect(result).toHaveLength(2);
      expect(result).toContain("Dataset");
      expect(result).toContain("Collection");
      expect(result).not.toContain("Standard");
    });

    it("returns an empty array if no records match", () => {
      const mockContext = {
        getRecordTypes: [
          { name: "Dataset", fairsharingRegistry: { name: "RegistryA" } },
        ],
      };

      const filterMethod = recordTypes.methods.filteredRecordTypes;
      const result = filterMethod.call(mockContext, "NonExistentRegistry");

      expect(result).toEqual([]);
    });
  });
});
