let lodash = require("lodash");

import { uniqueValues } from "@/utils/advancedSearchUtils.js";

describe("advancedSearchUtils.js", function () {
  it("resulted array should be unique without duplicate values", function () {
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
});
