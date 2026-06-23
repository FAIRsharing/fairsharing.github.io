import { bootstrapApp, globalFilters } from "@/utils/setupUtils.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("setupUtils.js", () => {
  describe("bootstrapApp()", () => {
    let mockStore;
    let mockRouter;

    beforeEach(() => {
      // Create fresh mock objects for dependency injection before each test
      mockStore = {
        dispatch: vi.fn().mockResolvedValue(true),
        commit: vi.fn(),
      };

      mockRouter = {
        replace: vi.fn(),
      };

      // Suppress console.error in tests to keep the terminal output clean
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("dispatches the 4 required initialization actions on success", async () => {
      // Pass the mock instances directly as arguments
      await bootstrapApp(mockStore, mockRouter);

      expect(mockStore.dispatch).toHaveBeenCalledTimes(4);
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(1, "users/login");
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        2,
        "introspection/fetchParameters",
      );
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        3,
        "searchFilters/assembleFilters",
      );
      expect(mockStore.dispatch).toHaveBeenNthCalledWith(
        4,
        "messages/setMessages",
      );
    });

    it("commits maintenance mode if API returns 503 Service Unavailable", async () => {
      const error503 = { response: { status: 503 } };
      mockStore.dispatch.mockRejectedValueOnce(error503);

      await bootstrapApp(mockStore, mockRouter);

      expect(mockStore.commit).toHaveBeenCalledWith(
        "introspection/setMaintenanceMode",
      );
      expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it("redirects to /error/500 for generic errors", async () => {
      const errorGeneric = new Error("Random API Failure");
      mockStore.dispatch.mockRejectedValueOnce(errorGeneric);

      await bootstrapApp(mockStore, mockRouter);

      expect(mockStore.commit).not.toHaveBeenCalled();
      expect(mockRouter.replace).toHaveBeenCalledWith("/error/500");
    });

    it("logs a console error if bootstrap fails and router is unavailable", async () => {
      const errorGeneric = new Error("No Router Exists");
      mockStore.dispatch.mockRejectedValueOnce(errorGeneric);

      // Pass null for the router to trigger the final catch block
      await bootstrapApp(mockStore, null);

      expect(mockStore.commit).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        "Bootstrap failed and router instance was unavailable:",
        errorGeneric,
      );
    });
  });

  describe("Global Filters", () => {
    describe("capitalize()", () => {
      it("capitalizes the first letter of a string", () => {
        expect(globalFilters.capitalize("hello")).toBe("Hello");
      });

      it("returns an empty string if input is falsy", () => {
        expect(globalFilters.capitalize(null)).toBe("");
        expect(globalFilters.capitalize("")).toBe("");
      });
    });

    describe("cleanString()", () => {
      it("replaces underscores with spaces and capitalizes the first letter", () => {
        expect(globalFilters.cleanString("hello_world")).toBe("Hello world");
      });

      it("adds spaces before uppercase letters (camelCase splitting)", () => {
        // The regex replaces ([A-Z]) with " $1" and capitalizes the first char
        expect(globalFilters.cleanString("camelCase")).toBe("Camel Case");
      });

      it("returns an empty string if input is falsy", () => {
        expect(globalFilters.cleanString(null)).toBe("");
        expect(globalFilters.cleanString("")).toBe("");
      });
    });
  });
});
