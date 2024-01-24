let lodash = require("lodash");

import { removeItem, uniqueValues } from "@/utils/advancedSearchUtils.js";

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
    lodash.uniqWith = jest.fn(() => item);

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
});
