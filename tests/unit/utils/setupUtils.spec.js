import { bootstrapApp, globalFilters } from "@/utils/setupUtils.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import store from "@/store";
import router from "@/router";

// Mock the Store
vi.mock("@/store", () => ({
  default: {
    dispatch: vi.fn(),
    commit: vi.fn(),
  },
}));

// Mock the Router
vi.mock("@/router", () => ({
  default: {
    replace: vi.fn(),
  },
}));

describe("Bootstrap & Filters Logic", () => {
  // Clear mock history before every test to ensure clean assertions
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("bootstrapApp()", () => {
    it("dispatches the 4 required initialization actions on success", async () => {
      // Setup: Mock dispatch to resolve successfully
      store.dispatch.mockResolvedValue(true);

      // Execute
      await bootstrapApp();

      // Assert: Check all 4 calls
      expect(store.dispatch).toHaveBeenCalledTimes(4);
      expect(store.dispatch).toHaveBeenCalledWith("users/login");
      expect(store.dispatch).toHaveBeenCalledWith(
        "introspection/fetchParameters",
      );
      expect(store.dispatch).toHaveBeenCalledWith(
        "searchFilters/assembleFilters",
      );
      expect(store.dispatch).toHaveBeenCalledWith("messages/setMessages");
    });

    it("commits maintenance mode if API returns 503 Service Unavailable", async () => {
      // Setup: specific 503 error structure
      const error503 = { response: { status: 503 } };
      store.dispatch.mockRejectedValueOnce(error503);

      // Execute
      await bootstrapApp();

      // Assert
      expect(store.commit).toHaveBeenCalledWith(
        "introspection/setMaintenanceMode",
      );
      // Should NOT redirect to 500
      expect(router.replace).not.toHaveBeenCalled();
    });

    it("redirects to /error/500 for generic errors", async () => {
      // Setup: Generic error
      const errorGeneric = new Error("Random API Failure");
      store.dispatch.mockRejectedValueOnce(errorGeneric);

      // Execute
      await bootstrapApp();

      //Assert;
      expect(store.commit).not.toHaveBeenCalledWith(
        "introspection/setMaintenanceMode",
      );
      expect(router.replace).toHaveBeenCalledWith("/error/500");
    });
  });

  describe("Global Filters", () => {
    describe("capitalize", () => {
      it("capitalizes the first letter of a string", () => {
        expect(globalFilters.capitalize("hello")).toBe("Hello");
      });

      it("returns empty string if input is null/undefined", () => {
        expect(globalFilters.capitalize(null)).toBe("");
      });
    });

    describe("cleanString", () => {
      it("replaces underscores with spaces", () => {
        expect(globalFilters.cleanString("hello_world")).toContain(
          "Hello world",
        );
      });

      it("capitalizes the first letter", () => {
        expect(globalFilters.cleanString("test_string")).toMatch(/^Test/);
      });

      // Note: Based on your current regex logic `replace(/([A-Z])/g, "$1")`,
      // "camelCase" remains "camelCase". If you intend to split it, update logic in main.js.
      it("handles camelCase based on current logic", () => {
        const result = globalFilters.cleanString("camelCase");
        // Logic check: "camelCase" -> "CamelCase" (capitalizes first char, keeps rest)
        expect(result).toBe("CamelCase");
      });
    });
  });
});
