import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Community from "@/views/Static/Community/Community.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// 1. MOCK IMPORTED DATA AND ICONS
// We mock the JSON file to prevent the test from failing if the file structure changes,
// and to keep the DOM small and fast during testing.
vi.mock("@/data/communityPageData.json", () => ({
  default: {
    contentTabs: [
      { name: "Adopters", icon: "testIcon", description: "Test description" },
    ],
    externalLinks: [],
    governance: {},
    governance_text: [],
    meettheteam: { profiles: [] },
    rda: { subsections: [] },
    tables: {
      adopterTable: { data: [] },
      globalOrganisationTable: { data: [] },
      toolsTable: {
        data: [
          { id: "1", name: "Tool A", homepage: "http://toola.com", logo: "" },
        ],
      },
    },
  },
}));

vi.mock("@/plugins/icons", () => ({
  default: {
    values: {
      testIcon: { icon: "fas fa-test" },
    },
  },
}));

describe("Community.vue", () => {
  let wrapper;
  const vuetify = createVuetify({
    components,
    directives,
  });

  const globalMountOptions = {
    // 🌟 3. Install Vuetify as a plugin
    plugins: [vuetify],
    mocks: {
      $vuetify: {
        display: {
          mdAndUp: true,
          xl: false,
          mdAndDown: false,
          lgAndUp: true,
        },
      },
      $sanitize: (html) => html,
      $route: { path: "/community" },
    },
    stubs: ["ActivitiesStaticTable", "Icon", "router-link"],
    directives: {
      scrollTo: () => {},
    },
  };

  beforeEach(() => {
    // Spy on window and history APIs
    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
    vi.spyOn(history, "pushState");
    vi.spyOn(history, "replaceState");

    wrapper = mount(Community, {
      global: globalMountOptions,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- RENDERING & LIFECYCLE ---

  it("adds and removes the scroll event listener on mount/unmount", () => {
    expect(window.addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );

    wrapper.unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });

  describe("jumpToAnchor", () => {
    it("scrolls into view and updates history when a new anchor is passed", () => {
      const scrollIntoViewMock = vi.fn();
      const documentSpy = vi.spyOn(document, "getElementById").mockReturnValue({
        scrollIntoView: scrollIntoViewMock,
      });

      wrapper.vm.jumpToAnchor("funders");

      // 1. Fetched the element
      expect(documentSpy).toHaveBeenCalledWith("funders");
      // 2. Called smooth scroll
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start",
      });
      // 3. Updated browser history
      expect(history.pushState).toHaveBeenCalledWith(null, null, "#funders");
      // 4. Updated local state
      expect(wrapper.vm.currentAnchor).toBe("funders");
    });
  });

  describe("orgUrl", () => {
    it("returns a local relative path if the organisation has an ID", () => {
      const org = { id: "123", name: "Test Org" };
      expect(wrapper.vm.orgUrl(org)).toBe("/organisations/123");
    });

    it("returns the external url if the organisation lacks an ID", () => {
      const org = { url: "https://external-org.com", name: "External Org" };
      expect(wrapper.vm.orgUrl(org)).toBe("https://external-org.com");
    });
  });

  describe("isArray", () => {
    it("correctly identifies arrays vs objects", () => {
      expect(wrapper.vm.isArray([])).toBe(true);
      expect(wrapper.vm.isArray([1, 2, 3])).toBe(true);
      expect(wrapper.vm.isArray({})).toBe(false);
      expect(wrapper.vm.isArray("string")).toBe(false);
    });
  });

  // --- WATCHERS ---

  describe("watch: $route", () => {
    it("toggles applyCss to reset padding/margins on route change", async () => {
      // Set to true initially
      wrapper.vm.applyCss = true;

      // Trigger the watcher directly by simulating a route change
      wrapper.vm.$options.watch.$route.handler.call(wrapper.vm);

      // It should immediately be false
      expect(wrapper.vm.applyCss).toBe(false);

      // Wait for nextTick
      await wrapper.vm.$nextTick();

      // It should be true again
      expect(wrapper.vm.applyCss).toBe(true);
    });
  });

  // --- STANDALONE FUNCTION (handleScroll) ---

  describe("handleScroll", () => {
    it("replaces history state when scrolled to the top and a hash exists", () => {
      // Mock the global window state
      Object.defineProperty(window, "scrollY", { value: 0, writable: true });
      Object.defineProperty(window, "location", {
        value: { hash: "#funders", pathname: "/community" },
        writable: true,
      });

      // Dispatch the scroll event to trigger the standalone `handleScroll` function
      window.dispatchEvent(new Event("scroll"));

      expect(history.replaceState).toHaveBeenCalledWith(
        history.state,
        null,
        "/community",
      );
    });

    it("does nothing if scrolled down past 2px", () => {
      Object.defineProperty(window, "scrollY", { value: 100, writable: true });
      Object.defineProperty(
        window,
        "location",
        { hash: "#funders" },
        { writable: true },
      );

      window.dispatchEvent(new Event("scroll"));

      expect(history.replaceState).not.toHaveBeenCalled();
    });
  });
});
