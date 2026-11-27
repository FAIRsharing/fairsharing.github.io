import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";
import Citations from "@/components/Records/Record/GeneralInfo/Citations.vue";
import Record from "@/store/recordData.js";
import {
  VIconStub,
  VRouterLinkStub,
  VSlotStub,
  VTooltipStub,
} from "../../../../../stubs/index.js";

const vuetify = createVuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      how_to_cite: "citation tooltip.",
    },
  },
};

Record.state.currentRecord["fairsharingRecord"] = {
  subjects: [],
  domains: [],
  taxonomies: [],
  userDefinedTags: [{ label: "a" }],
  metadata: { citations: [] },
  lastEditor: { username: "a user" },
};
const initialRecord = structuredClone(
  Record.state.currentRecord.fairsharingRecord,
);
const $store = new Vuex.Store({
  modules: {
    record: Record,
    editor: editor,
  },
});

describe("Citations.vue", function () {
  let wrapper;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 12, 12, 30));
    vi.stubEnv("VITE_HOSTNAME", "https://fairsharing.org/");
    $store.state.record.currentRecord.fairsharingRecord =
      structuredClone(initialRecord);
    editor.state.recordTooltips.publication_for_citation =
      "publication tooltip.";
    wrapper = shallowMount(Citations, {
      global: {
        plugins: [vuetify, $store],
        stubs: {
          VRow: VSlotStub,
          VCol: VSlotStub,
          VCard: VSlotStub,
          VCardTitle: VSlotStub,
          VCardText: VSlotStub,
          VTooltip: VTooltipStub,
          VIcon: VIconStub,
          "router-link": VRouterLinkStub,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Citations");
  });

  it("renders record citation metadata with an ID when no DOI exists", async () => {
    Object.assign($store.state.record.currentRecord.fairsharingRecord, {
      id: 42,
      name: "Example resource",
      abbreviation: "ER",
      doi: null,
      lastEdited: new Date(2026, 0, 2, 10, 15),
      lastReviewed: new Date(2026, 1, 3, 11, 20),
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toMatch(/FAIRsharing\.org: ER;\s*Example resource/);
    expect(wrapper.find('a[href="42"]').text()).toBe(
      "https://fairsharing.org/42",
    );
    expect(wrapper.text()).toContain("Friday, January 2nd 2026, 10:15");
    expect(wrapper.text()).toContain("Tuesday, February 3rd 2026, 11:20");
    expect(wrapper.text()).toContain("Thursday, November 12th 2026, 12:30");
    expect(wrapper.text()).toMatch(/Last Editor:\s*a user/);
    expect(wrapper.text()).toContain("citation tooltip.");
  });

  it("prefers the DOI to the FAIRsharing ID", async () => {
    Object.assign($store.state.record.currentRecord.fairsharingRecord, {
      id: 42,
      doi: "10.25504/example",
    });
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find('a[href="https://doi.org/10.25504/example"]').text(),
    ).toBe("10.25504/example");
    expect(wrapper.text()).not.toContain("FAIRsharing ID:");
    expect(wrapper.find('a[href="42"]').exists()).toBe(false);
  });

  it.each([null, {}])(
    "omits unavailable optional metadata for lastEditor=%j",
    async (lastEditor) => {
      Object.assign($store.state.record.currentRecord.fairsharingRecord, {
        lastEditor,
        metadata: {},
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).not.toContain("FAIRsharing.org:");
      expect(wrapper.text()).not.toContain("Last Edited:");
      expect(wrapper.text()).not.toContain("Last Reviewed:");
      expect(wrapper.text()).not.toContain("a user");
      expect(wrapper.text().includes("Last Editor:")).toBe(lastEditor !== null);
      expect(wrapper.text()).not.toContain("Publication for citation");
      expect(wrapper.text()).toContain("Last Accessed:");
    },
  );

  it.each([
    [
      {
        doi: "10.1000/paper",
        pubmed_id: "123",
        url: "https://example.org/paper",
      },
      "https://doi.org/10.1000/paper",
    ],
    [
      { pubmed_id: "123", url: "https://example.org/paper" },
      "https://pubmed.ncbi.nlm.nih.gov/123",
    ],
    [{ url: "https://example.org/paper" }, "https://example.org/paper"],
    [{}, null],
  ])(
    "renders a matching publication using the available citation link %j",
    async (citation, href) => {
      Object.assign($store.state.record.currentRecord.fairsharingRecord, {
        metadata: { citations: [{ id: 1, publication_id: 7, ...citation }] },
        publications: [
          {
            id: 6,
            title: "Unrelated publication",
            authors: "Other",
            year: 2020,
          },
          {
            id: 7,
            title: "Matching publication",
            authors: "Alice and Bob",
            year: 2025,
          },
        ],
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("Publication for citation");
      expect(wrapper.text()).toContain("publication tooltip.");
      expect(wrapper.text()).toContain(
        "Matching publication: Alice and Bob (2025)",
      );
      expect(wrapper.text()).not.toContain("Unrelated publication");
      const links = wrapper.findAll("a");
      expect(links).toHaveLength(href ? 1 : 0);
      if (href) {
        expect(links[0].attributes("href")).toBe(href);
        expect(links[0].attributes("target")).toBe("_blank");
      }
    },
  );

  it.each([
    [500, 150],
    [1600, 600],
  ])("truncates authors at viewport width %i", async (width, limit) => {
    vi.stubGlobal("innerWidth", width);
    vuetify.display.update();
    const authors = "A".repeat(700);
    Object.assign($store.state.record.currentRecord.fairsharingRecord, {
      metadata: { citations: [{ id: 1, publication_id: 7 }] },
      publications: [{ id: 7, title: "Long author list", authors, year: 2025 }],
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("A".repeat(limit - 1) + "...");
    expect(wrapper.text()).not.toContain("A".repeat(limit));
  });
});
