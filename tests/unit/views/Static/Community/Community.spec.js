import { flushPromises, mount } from "@vue/test-utils";
import { reactive } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Community from "@/views/Static/Community/Community.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import communityData from "@/data/communityPageData.json";

import { VRouterLinkStub, VTooltipStub } from "../../../../stubs/index.js";

// 1. MOCK IMPORTED DATA AND ICONS
// We mock the JSON file to prevent the test from failing if the file structure changes,
// and to keep the DOM small and fast during testing.
vi.mock("@/data/communityPageData.json", () => ({
  default: {
    contentTabs: [
      { name: "Adopters", icon: "testIcon", description: "Test description" },
    ],
    externalLinks: [
      {
        title: "Funder report",
        titleLink: "https://funders.example.org/report",
        text: "Funding <strong>report</strong>",
      },
    ],
    governance: {
      "Advisory board": [
        {
          title: "Members",
          data: [
            { text: "Board member", link: "https://orcid.org/0000-0001" },
            { text: "Email member", link: "board@example.org" },
            { text: "Member without a link" },
            [
              { text: "Grouped email", link: "group@example.org" },
              { text: "Grouped website", link: "https://group.example.org" },
            ],
          ],
        },
      ],
    },
    governance_text: [{ text: "Governance principles" }],
    meettheteam: {
      title: "Meet the team",
      description: "Community team",
      profiles: [
        {
          name: "Team member",
          role: "Curator",
          profileImg: "assets/Community/team.png",
          social: [
            { icon: "Orcid", link: "team@example.org" },
            { icon: "Web", link: "https://team.example.org" },
          ],
        },
      ],
    },
    rda: {
      title: "RDA working group",
      description: "Working together",
      subsections: [
        {
          title: "Working group",
          data: [
            { text: "Email participant", link: "wg@example.org" },
            { text: "Web participant", link: "https://wg.example.org" },
            { text: "Participant without a link" },
          ],
        },
        { title: "Further information", data: "Working group details" },
      ],
    },
    tables: {
      adopterTable: {
        data: [
          { adopter: "Publisher", image: "assets/Community/publisher.png" },
          { adopter: "No logo" },
        ],
      },
      globalOrganisationTable: {
        data: [
          {
            adopter: "Organisation",
            image: "/assets/Community/organisation.png",
          },
          { adopter: "No logo" },
        ],
      },
      toolsTable: {
        data: [
          {
            id: "1",
            name: "Tool A",
            homepage: "https://toola.example.org",
            logo: "",
            description: "Detailed tool description",
            status: "Active",
            organisations: [
              { id: 123, name: "Local organisation", tooltip: "Local tooltip" },
              {
                name: "External organisation",
                url: "https://external-org.example.org",
              },
            ],
            contacts: [
              {
                id: "contact",
                name: "Contact A",
                url: "mailto:contact@example.org",
              },
            ],
            methods: ["API", "Download"],
            types: ["Database"],
          },
          {
            id: "2",
            name: "Tool B",
            homepage: "https://toolb.example.org",
            logo: "tool-b.png",
            description: "",
            organisations: [],
            contacts: [],
            methods: [],
            types: [],
          },
          { id: "3", name: "Tool C", homepage: "https://toolc.example.org" },
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
  const originalUrl = window.location.href;
  const vuetify = createVuetify({
    components,
    directives,
  });

  const globalMountOptions = {
    plugins: [vuetify],
    mocks: {
      $sanitize: (html) => html,
      $route: reactive({ path: "/community" }),
    },
    stubs: {
      ActivitiesStaticTable: true,
      Icon: true,
      "router-link": VRouterLinkStub,
      VTooltip: VTooltipStub,
      VImg: {
        name: "VImg",
        props: ["src"],
        template: '<div data-test="v-img" :data-src="src"><slot /></div>',
      },
    },
    directives: {
      scrollTo: () => {},
      "safe-html": (element, binding) => {
        element.innerHTML = binding.value || "";
      },
    },
  };

  beforeEach(async () => {
    history.replaceState(null, "", "/community");
    globalMountOptions.mocks.$route.path = "/community";
    vi.stubGlobal("innerWidth", 1280);
    vuetify.display.update();
    // Spy on window and history APIs
    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
    vi.spyOn(history, "pushState");
    vi.spyOn(history, "replaceState");

    wrapper = mount(Community, {
      global: globalMountOptions,
      attachTo: document.body,
      data: () => structuredClone(communityData),
    });
    await flushPromises();
  });

  afterEach(async () => {
    await flushPromises();
    if (wrapper.exists()) wrapper.unmount();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    history.replaceState(null, "", originalUrl);
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

  describe("assetPath", () => {
    it("path is not available", () => {
      expect(wrapper.vm.assetPath()).toBe("");
    });
    it("path is available", () => {
      const path = "assets/images/test.jpg";
      expect(wrapper.vm.assetPath(path)).toBe("/assets/images/test.jpg");
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
      vi.stubGlobal("scrollY", 0);
      history.replaceState(history.state, "", "/community#funders");
      history.replaceState.mockClear();

      // Dispatch the scroll event to trigger the standalone `handleScroll` function
      window.dispatchEvent(new Event("scroll"));

      expect(history.replaceState).toHaveBeenCalledWith(
        history.state,
        null,
        "/community",
      );
    });

    it("does nothing if scrolled down past 2px", () => {
      vi.stubGlobal("scrollY", 100);
      history.replaceState(history.state, "", "/community#funders");
      history.replaceState.mockClear();

      window.dispatchEvent(new Event("scroll"));

      expect(history.replaceState).not.toHaveBeenCalled();
    });
  });

  describe("subtitle scrolling", () => {
    describe("checkOverflow", () => {
      it("sets overflowingSubtitles to true when content exceeds the visible height", () => {
        const toolId = "tool-1";

        const event = {
          currentTarget: {
            scrollHeight: 300,
            clientHeight: 260,
            scrollTop: 0,
          },
        };

        wrapper.vm.checkOverflow(event, toolId);

        expect(wrapper.vm.overflowingSubtitles[toolId]).toBe(true);
      });

      it("sets overflowingSubtitles to false when content fits", () => {
        const toolId = "tool-1";

        const event = {
          currentTarget: {
            scrollHeight: 200,
            clientHeight: 260,
            scrollTop: 0,
          },
        };

        wrapper.vm.checkOverflow(event, toolId);

        expect(wrapper.vm.overflowingSubtitles[toolId]).toBe(false);
      });

      it("calls checkScrollPosition", () => {
        const toolId = "tool-1";

        const event = {
          currentTarget: {
            scrollHeight: 300,
            clientHeight: 260,
            scrollTop: 0,
          },
        };

        wrapper.vm.checkScrollPosition(event, toolId);

        expect(wrapper.vm.subtitleAtBottom[toolId]).toBe(false);
      });
    });

    describe("checkScrollPosition", () => {
      it("sets subtitleAtBottom to false when not at the bottom", () => {
        const toolId = "tool-1";

        const event = {
          currentTarget: {
            scrollHeight: 500,
            clientHeight: 260,
            scrollTop: 100,
          },
        };

        wrapper.vm.checkScrollPosition(event, toolId);

        expect(wrapper.vm.subtitleAtBottom[toolId]).toBe(false);
      });

      it("sets subtitleAtBottom to true when scrolled to the bottom", () => {
        const toolId = "tool-1";

        const event = {
          currentTarget: {
            scrollHeight: 500,
            clientHeight: 260,
            scrollTop: 240,
          },
        };

        wrapper.vm.checkScrollPosition(event, toolId);

        expect(wrapper.vm.subtitleAtBottom[toolId]).toBe(true);
      });

      it("allows a 1px rounding difference when determining the bottom", () => {
        const toolId = "tool-1";

        const event = {
          currentTarget: {
            scrollHeight: 500,
            clientHeight: 260,
            scrollTop: 239,
          },
        };

        wrapper.vm.checkScrollPosition(event, toolId);

        expect(wrapper.vm.subtitleAtBottom[toolId]).toBe(true);
      });
    });
  });

  it("renders tool metadata, optional fields and image fallbacks", () => {
    const tool = wrapper.find('a[id="1"]');
    expect(tool.text()).toBe("Tool A");
    expect(tool.attributes("href")).toBe("https://toola.example.org");
    expect(wrapper.text()).toContain("Status: Active");
    expect(wrapper.text()).toContain("Contact A");
    expect(wrapper.text()).toContain("Methods of using FAIRsharing:");
    expect(wrapper.text()).toContain("Database");
    expect(wrapper.find('a[href="mailto:contact@example.org"]').exists()).toBe(
      true,
    );
    const images = wrapper
      .findAllComponents({ name: "VImg" })
      .map((item) => item.props("src"));
    expect(images).toContain("/assets/Community/tools/toolplaceholder.png");
    expect(images).toContain("/assets/Community/tools/tool-b.png");
    expect(images).toContain("/assets/Community/publisher.png");
    expect(images).toContain("/assets/Community/organisation.png");
    expect(wrapper.findAll(".tool-subtitle")).toHaveLength(1);
  });

  it("renders team, governance and working-group links", () => {
    expect(wrapper.text()).toContain("Governance principles");
    expect(wrapper.text()).toContain("Team member");
    expect(wrapper.text()).toContain("Working group details");
    for (const href of [
      "mailto:team@example.org",
      "https://team.example.org",
      "mailto:board@example.org",
      "mailto:group@example.org",
      "https://group.example.org",
      "mailto:wg@example.org",
      "https://wg.example.org",
    ]) {
      expect(wrapper.find(`a[href="${href}"]`).exists()).toBe(true);
    }
    expect(
      wrapper.find('a[href="https://funders.example.org/report"]').text(),
    ).toBe("Funder report");
    expect(wrapper.find('a[href="#tools"]').exists()).toBe(true);
  });

  it("navigates local and external organisation links through the mixin", async () => {
    const assign = vi
      .spyOn(window.location, "assign")
      .mockImplementation(() => {});
    await wrapper.find('a[href="/organisations/123"]').trigger("click");
    expect(assign).toHaveBeenLastCalledWith("/organisations/123");
    await wrapper
      .find('a[href="https://external-org.example.org"]')
      .trigger("click");
    expect(assign).toHaveBeenLastCalledWith("https://external-org.example.org");
    expect(assign).toHaveBeenCalledTimes(2);
    expect(wrapper.text()).toContain("Local tooltip");
  });

  it("hides tool content when the tool list is empty", async () => {
    await wrapper.setData({ tables: { toolsTable: { data: [] } } });
    expect(wrapper.find("#tools").exists()).toBe(false);
    expect(wrapper.find('a[id="1"]').exists()).toBe(false);
    expect(wrapper.find("#governance").exists()).toBe(true);
  });

  it("scrolls from a content card and avoids adding the same anchor twice", async () => {
    const scroll = vi
      .spyOn(wrapper.find("#adopters").element, "scrollIntoView")
      .mockImplementation(() => {});
    const card = wrapper.find(".block-category__card");
    await card.trigger("click");
    expect(scroll).toHaveBeenCalledExactlyOnceWith({
      behavior: "smooth",
      block: "start",
    });
    expect(history.pushState).toHaveBeenCalledExactlyOnceWith(
      null,
      null,
      "#adopters",
    );
    expect(window.location.hash).toBe("#adopters");
    await card.trigger("click");
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(history.pushState).toHaveBeenCalledTimes(1);
  });

  it("updates subtitle classes through mouseenter and scroll events", async () => {
    const subtitle = wrapper.find(".tool-subtitle");
    Object.defineProperties(subtitle.element, {
      scrollHeight: { value: 500 },
      clientHeight: { value: 260 },
      scrollTop: { value: 100, writable: true },
    });
    await subtitle.trigger("mouseenter");
    expect(wrapper.vm.overflowingSubtitles["1"]).toBe(true);
    expect(subtitle.classes()).toContain("is-overflowing");
    await subtitle.trigger("scroll");
    expect(subtitle.classes()).not.toContain("is-at-bottom");
    subtitle.element.scrollTop = 239;
    await subtitle.trigger("scroll");
    expect(wrapper.vm.subtitleAtBottom["1"]).toBe(true);
    expect(subtitle.classes()).toContain("is-at-bottom");
  });

  it("reacts to a real route change and restores page spacing on the next tick", async () => {
    await wrapper.vm.$nextTick();
    const changes = [];
    const stop = wrapper.vm.$watch("applyCss", (value) => changes.push(value), {
      flush: "sync",
    });
    globalMountOptions.mocks.$route.path = "/community/tools";
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await flushPromises();
    expect(changes).toEqual([false, true]);
    expect(wrapper.find("main").classes()).toContain("pa-15");
    stop();
  });

  it("updates responsive classes when display breakpoints change", async () => {
    vi.stubGlobal("innerWidth", 500);
    vuetify.display.update();
    await flushPromises();
    expect(wrapper.find(".links").classes()).not.toContain(
      "max-width-32-percent",
    );
    expect(wrapper.find("li.width-250").classes()).toContain("mx-auto");
    vi.stubGlobal("innerWidth", 2000);
    vuetify.display.update();
    await flushPromises();
    expect(wrapper.find("#funders").classes()).toContain("lato-text-md");
    expect(wrapper.find(".links").classes()).toContain("max-width-32-percent");
    expect(wrapper.find("li.width-250").classes()).not.toContain("mx-auto");
  });

  it.each([
    [0, ""],
    [2, "#funders"],
  ])("does not change history for scroll=%s and hash=%s", (scrollY, hash) => {
    vi.stubGlobal("scrollY", scrollY);
    history.replaceState(null, "", `/community${hash}`);
    history.replaceState.mockClear();
    window.dispatchEvent(new Event("scroll"));
    expect(history.replaceState).not.toHaveBeenCalled();
  });

  it("stops handling scroll events after unmount", () => {
    wrapper.unmount();
    vi.stubGlobal("scrollY", 0);
    history.replaceState(null, "", "/community#funders");
    history.replaceState.mockClear();
    window.dispatchEvent(new Event("scroll"));
    expect(history.replaceState).not.toHaveBeenCalled();
  });

  it.each(["/assets/image.png", "./assets/image.png", "assets/image.png"])(
    "normalises image path %s",
    (path) => {
      expect(wrapper.vm.assetPath(path)).toBe("/assets/image.png");
    },
  );
});
