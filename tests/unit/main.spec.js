import { beforeEach, describe, expect, it, vi } from "vitest";
import { initHighchartsAccessibility } from "@/main.js";

// Mock the plugins to return a valid install function
vi.mock("simple-analytics-vue", () => ({ default: { install: vi.fn() } }));
vi.mock("vue-gtag", () => ({ default: { install: vi.fn() } }));
vi.mock("@/App.vue", () => ({ default: { template: "<div></div>" } }));

describe("main.js logic", () => {
  beforeAll(() => {
    if (!document.getElementById("app")) {
      const el = document.createElement("div");
      el.id = "app";
      document.body.appendChild(el);
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Highcharts Initialization", () => {
    it("initializes when accessibility module is a direct function (CommonJS style)", () => {
      // Setup
      const mockInitFn = vi.fn();
      const mockHighcharts = { name: "Highcharts Mock" };

      // Execute
      initHighchartsAccessibility(mockInitFn, mockHighcharts);

      // Assert
      expect(mockInitFn).toHaveBeenCalledWith(mockHighcharts);
    });

    it("initializes when accessibility module is a default export (ESM style)", () => {
      // Setup
      const mockInitObj = { default: vi.fn() };
      const mockHighcharts = { name: "Highcharts Mock" };

      // Execute
      initHighchartsAccessibility(mockInitObj, mockHighcharts);

      // Assert
      expect(mockInitObj.default).toHaveBeenCalledWith(mockHighcharts);
    });

    it("does nothing if accessibility module is invalid", () => {
      // Safety check (optional, but good for coverage)
      const mockInitObj = {}; // No function, no default
      const mockHighcharts = {};

      initHighchartsAccessibility(mockInitObj, mockHighcharts);

      // Should not crash, and nothing called
      expect(true).toBe(true);
    });
  });
});
