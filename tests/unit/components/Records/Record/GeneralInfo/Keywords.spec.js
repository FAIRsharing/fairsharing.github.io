import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import Keywords from "@/components/Records/Record/GeneralInfo/Keywords.vue";
import { VIconStub, VTooltipStub } from "../../../../../stubs/index.js";

vi.mock("@/utils/recordsCardUtils", () => ({
  default: {
    methods: {
      getChipColor: vi.fn(() => "primary-color"),
    },
  },
}));

describe("Keywords.vue", () => {
  let wrapper;
  let store;
  let mockRouter;
  let mockGetField;

  // 2. SETUP VUETIFY
  const vuetify = createVuetify({
    components,
    directives,
  });

  beforeEach(() => {
    // 3. SETUP VUE ROUTER MOCK
    mockRouter = {
      push: vi.fn(),
    };

    // 4. SETUP VUEX STORE MOCK
    // We make getField a mock function so we can change its return value in different tests
    mockGetField = vi.fn(() => []);

    store = createStore({
      modules: {
        record: {
          namespaced: true,
          getters: {
            getField: () => mockGetField,
          },
        },
        editor: {
          namespaced: true,
          state: {
            recordTooltips: {
              object_types: "Tooltip for Object Types",
              subjects: "Tooltip for Subjects",
              domains: "Tooltip for Domains",
              taxonomies: "Tooltip for Taxonomies",
              user_defined_tags: "Tooltip for User Defined Tags",
            },
          },
        },
      },
    });

    // 5. MOUNT THE COMPONENT
    wrapper = mount(Keywords, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
        },
        stubs: {
          // Stub the custom tooltip to keep the DOM light
          KeywordTooltip: true,
          VTooltip: VTooltipStub,
          VIcon: VIconStub,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  describe("returnToSearch", () => {
    it("constructs the correct query and pushes to the router", () => {
      wrapper.vm.returnToSearch("subjects", "Life Sciences");

      expect(mockRouter.push).toHaveBeenCalledWith({
        name: "search",
        query: {
          subjects: "Life%20Sciences",
        },
      });
    });

    it("triggers returnToSearch when a chip is clicked", async () => {
      mockGetField.mockImplementation((field) => {
        if (field === "domains") return [{ label: "Genomics" }];
        return [];
      });

      wrapper.unmount();
      wrapper = mount(Keywords, {
        global: {
          plugins: [vuetify, store],
          mocks: { $router: mockRouter },
          stubs: {
            KeywordTooltip: true,
            VTooltip: VTooltipStub,
            VIcon: VIconStub,
          },
        },
      });

      const chip = wrapper.findComponent({ name: "VChip" });
      await chip.trigger("click");

      expect(mockRouter.push).toHaveBeenCalledWith({
        name: "search",
        query: {
          domains: "Genomics",
        },
      });
    });
  });

  it("shows an empty state and tooltip for every keyword category", () => {
    expect(wrapper.findAllComponents({ name: "VChip" })).toHaveLength(0);
    expect(
      wrapper.findAll("span").filter((span) => span.text() === "N/A"),
    ).toHaveLength(5);
    for (const tooltip of Object.values(store.state.editor.recordTooltips)) {
      expect(wrapper.text()).toContain(tooltip);
    }
    expect(wrapper.findAll('[data-test="v-icon"]')).toHaveLength(5);
  });

  it.each([
    "objectTypes",
    "subjects",
    "domains",
    "taxonomies",
    "userDefinedTags",
  ])(
    "renders %s chips and searches with the encoded label when clicked",
    async (field) => {
      const item = { label: "Genetics & Health/é", type: field };
      mockGetField.mockImplementation((key) => (key === field ? [item] : []));
      wrapper.vm.$forceUpdate();
      await wrapper.vm.$nextTick();
      const chips = wrapper.findAllComponents({ name: "VChip" });
      expect(chips).toHaveLength(1);
      expect(chips[0].props("color")).toBe("primary-color");
      const tooltip = chips[0].findComponent({ name: "KeywordTooltip" });
      expect(tooltip.props("keyword")).toEqual(item);
      expect(tooltip.props("fullWidth")).toBe(true);
      await chips[0].trigger("click");
      expect(mockRouter.push).toHaveBeenCalledExactlyOnceWith({
        name: "search",
        query: { [field]: encodeURIComponent(item.label) },
      });
    },
  );

  it("renders multiple keywords and returns to the empty state when they are removed", async () => {
    const subjects = [{ label: "Genomics" }, { label: "Biology" }];
    mockGetField.mockImplementation((field) =>
      field === "subjects" ? subjects : [],
    );
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();
    expect(
      wrapper
        .findAllComponents({ name: "KeywordTooltip" })
        .map((tooltip) => tooltip.props("keyword")),
    ).toEqual(subjects);
    expect(
      wrapper.findAll("span").filter((span) => span.text() === "N/A"),
    ).toHaveLength(4);
    mockGetField.mockReturnValue([]);
    wrapper.vm.$forceUpdate();
    await wrapper.vm.$nextTick();
    expect(wrapper.findAllComponents({ name: "VChip" })).toHaveLength(0);
    expect(
      wrapper.findAll("span").filter((span) => span.text() === "N/A"),
    ).toHaveLength(5);
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
