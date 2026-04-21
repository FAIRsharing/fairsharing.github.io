import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import Keywords from "@/components/Records/Record/GeneralInfo/Keywords.vue";

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
        },
      },
    });
  });

  afterEach(() => {
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

      wrapper = mount(Keywords, {
        global: {
          plugins: [vuetify, store],
          mocks: { $router: mockRouter },
          stubs: { KeywordTooltip: true },
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
});
