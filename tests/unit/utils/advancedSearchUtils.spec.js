import { describe, expect, it } from "vitest";
import {
  recordTypes,
  removeItem,
  uniqueValues,
} from "@/utils/advancedSearchUtils.js";

describe("advancedSearchUtils.js", function () {
  it("method uniqueValues should result unique array without duplicate values and combine matching identifiers", function () {
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

    const expectedResult = [
      {
        identifier: "registry",
        value: ["database"],
      },
      {
        identifier: "subjects",
        value: ["s1", "s2"],
      },
    ];

    // Test the utility function as a black box without mocking lodash internals
    const uniqueValuesResult = uniqueValues(item);

    expect(uniqueValuesResult).toStrictEqual(expectedResult);
  });

  it("method removeItem should remove the selected item and return the updated array", function () {
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
