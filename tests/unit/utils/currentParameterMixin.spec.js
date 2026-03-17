import { describe, expect, it } from "vitest";
import currentParameterMixin from "@/utils/currentParameterMixin";

describe("currentParameter Computed Property", () => {
  // Extract the function for easier testing
  const { currentParameter } = currentParameterMixin.computed;

  it("returns the parameter value if it exists in the route query", () => {
    const mockContext = {
      $route: {
        query: {
          status: "active", // This matches the filterName below
          other: "ignored",
        },
      },
      item: {
        filterName: "status",
      },
    };

    const result = currentParameter.call(mockContext);

    expect(result).toEqual({ status: "active" });
  });

  it("returns null for the specific key if the query parameter is missing", () => {
    const mockContext = {
      $route: {
        query: {
          page: "1",
        },
      },
      item: {
        filterName: "category", // 'category' is not in query
      },
    };

    const result = currentParameter.call(mockContext);

    // Should return { category: null }
    expect(result).toEqual({ category: null });
  });

  it("handles empty query objects correctly", () => {
    const mockContext = {
      $route: {
        query: {},
      },
      item: {
        filterName: "search",
      },
    };

    const result = currentParameter.call(mockContext);

    expect(result).toEqual({ search: null });
  });

  it("handles complex values (e.g. comma-separated strings) in query", () => {
    const mockContext = {
      $route: {
        query: {
          tags: "vue,javascript,vitest",
        },
      },
      item: {
        filterName: "tags",
      },
    };

    const result = currentParameter.call(mockContext);

    expect(result).toEqual({ tags: "vue,javascript,vitest" });
  });
});
