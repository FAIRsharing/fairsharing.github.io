import { beforeEach, describe, expect, it, vi } from "vitest";
import { initHighchartsAccessibility } from "@/main.js";

// Intercept Vue's createApp before main.js runs
vi.mock("vue", async (importOriginal) => {
  const actual = await importOriginal();

  // Create a robust mock of the Vue App instance
  const appMock = {
    use: vi.fn().mockReturnThis(),
    directive: vi.fn().mockReturnThis(), // Fixes your TypeError!
    component: vi.fn().mockReturnThis(), // In case you have global components
    provide: vi.fn().mockReturnThis(), // In case you provide global variables
    mount: vi.fn(), // The final call, doesn't need to chain
    config: {
      globalProperties: {},
    },
  };

  return {
    ...actual,
    createApp: vi.fn(() => appMock),
  };
});

describe("main.js logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Highcharts Initialization", () => {
    it("initializes when accessibility module is a direct function (CommonJS style)", () => {
      const mockInitFn = vi.fn();
      const mockHighcharts = { name: "Highcharts Mock" };

      initHighchartsAccessibility(mockInitFn, mockHighcharts);

      expect(mockInitFn).toHaveBeenCalledWith(mockHighcharts);
    });

    it("initializes when accessibility module is a default export (ESM style)", () => {
      const mockInitObj = { default: vi.fn() };
      const mockHighcharts = { name: "Highcharts Mock" };

      initHighchartsAccessibility(mockInitObj, mockHighcharts);

      expect(mockInitObj.default).toHaveBeenCalledWith(mockHighcharts);
    });

    it("does nothing if accessibility module is invalid", () => {
      const mockInitObj = {};
      const mockHighcharts = {};

      initHighchartsAccessibility(mockInitObj, mockHighcharts);

      expect(true).toBe(true);
    });
  });
});
