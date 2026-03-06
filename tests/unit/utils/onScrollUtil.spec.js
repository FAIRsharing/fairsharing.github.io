import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import onScrollUtil from "@/utils/onScrollUtil"; // Adjust path as necessary

describe("onScrollUtil Mixin", () => {
  let context;

  // Helper to simulate window.top.scrollY
  const mockScrollY = (yValue) => {
    // We mock the 'top' property of window because the code uses window.top.scrollY
    vi.spyOn(window, "top", "get").mockReturnValue({
      scrollY: yValue,
    });
  };

  beforeEach(() => {
    // 1. Setup the Mock Context (simulating 'this')
    context = {
      $store: {
        dispatch: vi.fn(),
      },
      // Mock the methods that would usually be mapped by mapActions
      setStickToTop: vi.fn(),
      setScrollStatus: vi.fn(),
      // Bind the mixin method to our context
      onScroll: onScrollUtil.methods.onScroll,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("onScroll", () => {
    it("activates StickToTop and hides header when scrolled > 100px and data exists", () => {
      // Setup
      mockScrollY(150); // > 100
      const data = ["item1", "item2"]; // Length > 1

      // Execute
      context.onScroll(data);

      // Assert: Sticky Logic
      expect(context.setStickToTop).toHaveBeenCalledWith(true);
      expect(context.$store.dispatch).toHaveBeenCalledWith(
        "uiController/setGeneralUIAttributesAction",
        { headerVisibilityState: false },
      );

      // Assert: Scroll Status Logic (< 500)
      expect(context.setScrollStatus).toHaveBeenCalledWith(false);
    });

    it("deactivates StickToTop and shows header when scrolled <= 100px", () => {
      // Setup
      mockScrollY(50); // <= 100
      const data = ["item1", "item2"];

      // Execute
      context.onScroll(data);

      // Assert
      expect(context.setStickToTop).toHaveBeenCalledWith(false);
      expect(context.$store.dispatch).toHaveBeenCalledWith(
        "uiController/setGeneralUIAttributesAction",
        {
          drawerVisibilityState: false,
          headerVisibilityState: true,
        },
      );
    });

    it("deactivates StickToTop if data length is <= 1, even if scrolled", () => {
      // Setup
      mockScrollY(200); // > 100
      const data = ["singleItem"]; // Length NOT > 1

      // Execute
      context.onScroll(data);

      // Assert: Should hit the 'else' block because data.length is insufficient
      expect(context.setStickToTop).toHaveBeenCalledWith(false);
      expect(context.$store.dispatch).toHaveBeenCalledWith(
        "uiController/setGeneralUIAttributesAction",
        expect.objectContaining({ headerVisibilityState: true }),
      );
    });

    it("activates ScrollStatus when scrolled > 500px", () => {
      // Setup
      mockScrollY(600); // > 500
      const data = ["item1", "item2"];

      // Execute
      context.onScroll(data);

      // Assert
      expect(context.setScrollStatus).toHaveBeenCalledWith(true);

      // Also verify sticky logic still applies
      expect(context.setStickToTop).toHaveBeenCalledWith(true);
    });
  });
});
