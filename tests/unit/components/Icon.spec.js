import { shallowMount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import Icon from "@/components/Icon.vue"; // Adjust path as necessary

// 1. Mock the external icons plugin
// We provide specific test cases: a fallback, an icon type, and an image type.
vi.mock("@/plugins/icons", () => ({
  default: {
    values: {
      undefined: { icon: "mdi-alert", type: "icon" },
      "test-icon": { icon: "mdi-check", type: "icon" },
      "test-img": { icon: "/path/to/image.png", type: "img" },
    },
  },
}));

describe("Icon.vue", () => {
  // Helper to mount the component with stubs
  const createWrapper = (props = {}) => {
    return shallowMount(Icon, {
      props,
      global: {
        stubs: {
          // Create simple stubs to inspect props/attributes passed to them
          "v-icon": {
            template:
              '<span class="v-icon-stub" :color="color" :size="size"><slot /></span>',
            props: ["color", "size", "icon"],
          },
          "v-img": {
            template: '<img class="v-img-stub" :src="src" :height="height" />',
            props: ["src", "height", "width"],
          },
        },
      },
    });
  };

  describe("Rendering Logic", () => {
    it("renders the fallback icon (v-icon) when the item is unknown", () => {
      const wrapper = createWrapper({
        item: "unknown-item",
        fallback: "undefined",
      });

      const iconStub = wrapper.find(".v-icon-stub");
      const imgStub = wrapper.find(".v-img-stub");

      // Assert v-icon is rendered and v-img is not
      expect(iconStub.exists()).toBe(true);
      expect(imgStub.exists()).toBe(false);

      // Assert it uses the fallback icon text (from mock)
      expect(iconStub.text()).toBe("mdi-alert");
    });

    it('renders the correct v-icon when item exists and type is "icon"', () => {
      const wrapper = createWrapper({
        item: "test-icon",
      });

      const iconStub = wrapper.find(".v-icon-stub");

      expect(iconStub.exists()).toBe(true);
      expect(iconStub.text()).toBe("mdi-check");
    });

    it('renders the correct v-img when item exists and type is "img"', () => {
      const wrapper = createWrapper({
        item: "test-img",
      });

      const imgStub = wrapper.find(".v-img-stub");
      const iconStub = wrapper.find(".v-icon-stub");

      // Assert v-img is rendered instead of v-icon
      expect(imgStub.exists()).toBe(true);
      expect(iconStub.exists()).toBe(false);

      // Assert correct source is passed
      expect(imgStub.attributes("src")).toBe("/path/to/image.png");
    });
  });

  describe("Props & Styling", () => {
    it("passes color and size props to v-icon", () => {
      const wrapper = createWrapper({
        item: "test-icon",
        color: "primary",
        size: "24",
      });

      const iconStub = wrapper.find(".v-icon-stub");

      expect(iconStub.attributes("color")).toBe("primary");
      expect(iconStub.attributes("size")).toBe("24");
    });
  });
});
