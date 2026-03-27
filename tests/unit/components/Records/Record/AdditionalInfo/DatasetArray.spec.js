import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import DatasetArray from "@/components/Records/Record/AdditionalInfo/DatasetArray";

// 1. MOCK THE MIXIN
// We mock stringUtils so we don't need the actual file, but provide
// the methods the template relies on to render correctly.
vi.mock("@/utils/stringUtils", () => ({
  default: {
    methods: {
      cleanString: vi.fn((str) => str),
      toHyperLink: vi.fn((str) => `<a href="${str}">${str}</a>`),
    },
  },
}));

// Mock visualViewport for Vuetify 3 + JSDOM
Object.defineProperty(window, "visualViewport", {
  writable: true,
  configurable: true,
  value: { width: 1024, height: 768, scale: 1, offsetLeft: 0, offsetTop: 0 },
});

describe("DatasetArray.vue", () => {
  let wrapper;

  const vuetify = createVuetify({
    components,
    directives,
  });

  const defaultProps = {
    title: "cos top guidelines",
    currentKey: "default_key",
    currentField: [{ url: "https://example.com" }],
    currentTooltips: {
      description: "Main Header Tooltip",
      properties: {
        "https://example.com": { description: "Item Tooltip" },
      },
    },
  };

  beforeEach(() => {
    wrapper = mount(DatasetArray, {
      props: defaultProps,
      global: {
        plugins: [vuetify],
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // --- METHOD TESTS ---

  describe("setTitle", () => {
    it("returns the strictly mapped title if it exists in the dictionary", () => {
      expect(wrapper.vm.setTitle("cos top guidelines")).toBe(
        "COS TOP Guidelines",
      );
      expect(wrapper.vm.setTitle("dmp development")).toBe("DMP Development");
      expect(wrapper.vm.setTitle("updating of dmp")).toBe("Updating of DMP");
      expect(wrapper.vm.setTitle("mandated dmp creation")).toBe(
        "Mandated DMP creation",
      );
      expect(wrapper.vm.setTitle("url")).toBe("URL");
    });

    it("returns the raw string if it is not in the dictionary", () => {
      expect(wrapper.vm.setTitle("unmapped random title")).toBe(
        "unmapped random title",
      );
    });
  });

  describe("getUpdatedTypeTitle", () => {
    it('returns "Steps" when key is data_curation', async () => {
      await wrapper.setProps({ currentKey: "data_curation" });
      expect(wrapper.vm.getUpdatedTypeTitle()).toBe("Steps");
    });

    it('returns "Restrictions" when key is data_deposition_condition', async () => {
      await wrapper.setProps({ currentKey: "data_deposition_condition" });
      expect(wrapper.vm.getUpdatedTypeTitle()).toBe("Restrictions");
    });

    it('returns "Type" by default', () => {
      expect(wrapper.vm.getUpdatedTypeTitle()).toBe("Type");
    });
  });

  describe("getUpdatedNameTitle", () => {
    it('returns "Plan" when key is resource_sustainability', async () => {
      await wrapper.setProps({ currentKey: "resource_sustainability" });
      expect(wrapper.vm.getUpdatedNameTitle()).toBe("Plan");
    });

    it('returns "Name" by default', () => {
      expect(wrapper.vm.getUpdatedNameTitle()).toBe("Name");
    });
  });

  describe("getDescription", () => {
    it('returns the main description when field is "head"', () => {
      expect(wrapper.vm.getDescription("head")).toBe("Main Header Tooltip");
    });

    it("returns the specific property description if it exists", () => {
      expect(wrapper.vm.getDescription("https://example.com")).toBe(
        "Item Tooltip",
      );
    });

    it("returns false if the tooltips object is missing properties or description", async () => {
      await wrapper.setProps({ currentTooltips: {} });
      expect(wrapper.vm.getDescription("head")).toBe(false);
      expect(wrapper.vm.getDescription("https://example.com")).toBe(false);
    });
  });

  describe("checkRegex", () => {
    it("returns a match array if a valid URL is provided", () => {
      const result = wrapper.vm.checkRegex(
        "Please visit https://www.google.com for info",
      );
      expect(result).toBeTruthy();
      expect(result[0]).toBe("https://www.google.com");
    });

    it("returns null if no valid URL is found", () => {
      const result = wrapper.vm.checkRegex(
        "Just some random text with no links",
      );
      expect(result).toBeNull();
    });
  });

  describe("checkCurrentfield", () => {
    it("returns true if no values in the field objects are empty strings", () => {
      const validField = [{ name: "Test", value: "Data" }];
      expect(wrapper.vm.checkCurrentfield(validField)).toBe(true);
    });

    // Note: Due to `(key, value)` used in `forEach` on Object.keys(), `value` is actually the index.
    // If the object has a property where the index maps to an empty string, it returns false.
    it("returns false if a mapped value evaluates to an empty string", () => {
      // Because Object.keys returns ['0'], the index is 0. item[0] evaluates to ""
      const invalidField = [{ 0: "" }];
      expect(wrapper.vm.checkCurrentfield(invalidField)).toBe(false);
    });
  });
});
