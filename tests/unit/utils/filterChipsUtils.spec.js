import { describe, expect, it } from "vitest";
import filterChipsUtils from "@/utils/filterChipsUtils";

describe("filterChipsUtils", () => {
  // Extract the function for easier access
  const getChips = filterChipsUtils.computed.getChips;

  it("generates a chip for a simple query parameter", () => {
    const mockContext = {
      $route: {
        query: {
          subject: "biology",
        },
      },
    };

    const result = getChips.call(mockContext);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      paramName: "subject",
      paramVal: "biology",
    });
  });

  it("ignores specific fields (page, orderBy, searchAnd, perPage)", () => {
    const mockContext = {
      $route: {
        query: {
          page: "1",
          orderBy: "date",
          searchAnd: "true",
          perPage: "10",
          validParam: "keepMe",
        },
      },
    };

    const result = getChips.call(mockContext);

    // Should ignore the first 4, keep only 'validParam'
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      paramName: "validParam",
      paramVal: "keepMe",
    });
  });

  it("splits comma-separated strings into multiple chips", () => {
    const mockContext = {
      $route: {
        query: {
          taxonomies: "plant,animal,fungi",
        },
      },
    };

    const result = getChips.call(mockContext);

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { paramName: "taxonomies", paramVal: "plant" },
      { paramName: "taxonomies", paramVal: "animal" },
      { paramName: "taxonomies", paramVal: "fungi" },
    ]);
  });

  it("handles mixed content: standard params, csv strings, and ignored fields", () => {
    const mockContext = {
      $route: {
        query: {
          page: "5",
          country: "UK,USA",
          status: "active",
        },
      },
    };

    const result = getChips.call(mockContext);

    // Expected: 2 for country + 1 for status = 3 total. 'page' is ignored.
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        { paramName: "country", paramVal: "UK" },
        { paramName: "country", paramVal: "USA" },
        { paramName: "status", paramVal: "active" },
      ]),
    );
  });

  it("returns an empty array if query is empty", () => {
    const mockContext = {
      $route: {
        query: {},
      },
    };

    const result = getChips.call(mockContext);
    expect(result).toEqual([]);
  });

  it("handles non-string values by wrapping them in an array", () => {
    // The code block: "else { param = [param]; }" handles this case.
    // This happens if the router returns a number or boolean,
    // or (depending on implementation) an actual array.
    const mockContext = {
      $route: {
        query: {
          id: 12345,
        },
      },
    };

    const result = getChips.call(mockContext);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      paramName: "id",
      paramVal: 12345,
    });
  });
});
