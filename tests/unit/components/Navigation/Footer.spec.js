import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FooterComp from "@/components/Navigation/Footer.vue";

// 1. Mock the imported JSON data so our tests are predictable and isolated
vi.mock("@/data/footerData.json", () => ({
  default: [
    {
      header: "Test Block",
      content: [
        {
          title: "Internal Link",
          url: "/internal-route",
          urlType: "internal",
          icon: "fas fa-home",
        },
        {
          title: "External Link",
          url: "https://external.com",
          urlType: "external",
          // No icon provided to test conditional rendering
        },
      ],
    },
  ],
}));

describe("FooterComp.vue", () => {
  let wrapper;

  const globalOptions = {
    directives: {
      "scroll-to": () => {},
      scroll: () => {},
    },
  };

  beforeEach(() => {
    wrapper = shallowMount(FooterComp, {
      global: globalOptions,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("FooterComp");
  });

  describe("onScroll method", () => {
    it("sets fab to true when scrolling past 700px via event target", () => {
      expect(wrapper.vm.fab).toBe(false);

      // Simulate scrolling down via event target
      wrapper.vm.onScroll({ target: { scrollTop: 750 } });
      expect(wrapper.vm.fab).toBe(true);

      // Simulate scrolling back up
      wrapper.vm.onScroll({ target: { scrollTop: 500 } });
      expect(wrapper.vm.fab).toBe(false);
    });

    it("sets fab to true when scrolling past 700px via window.scrollY", () => {
      // Mock window.scrollY
      const originalScrollY = window.scrollY;

      window.scrollY = 800;
      wrapper.vm.onScroll({});
      expect(wrapper.vm.fab).toBe(true);

      window.scrollY = 200;
      wrapper.vm.onScroll({});
      expect(wrapper.vm.fab).toBe(false);

      // Restore original value
      window.scrollY = originalScrollY;
    });

    it("falls back to 0 when both window.scrollY and e.target.scrollTop are falsy", () => {
      wrapper.vm.fab = true;
      const originalScrollY = window.scrollY;
      window.scrollY = 0;
      const mockEvent = {
        target: {
          scrollTop: undefined,
        },
      };
      wrapper.vm.onScroll(mockEvent);
      expect(wrapper.vm.fab).toBe(false);
      window.scrollY = originalScrollY;
    });

    it("handles undefined window safely", () => {
      const originalWindow = global.window;
      delete global.window;
      expect(() => wrapper.vm.onScroll({})).not.toThrow();
      global.window = originalWindow;
    });
  });
});
