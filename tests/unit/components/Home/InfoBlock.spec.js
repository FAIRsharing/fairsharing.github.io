import { RouterLinkStub, shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { createVuetify } from "vuetify";

import InfoBlock from "@/components/Home/InfoBlock";
import icons from "@/plugins/icons";
import Vuex from "vuex";

import searchFiltersStore from "@/store/searchFilters.js";

const vuetify = createVuetify({ icons: icons });

const $store = new Vuex.Store({
  modules: {
    searchFilters: searchFiltersStore,
  },
});

searchFiltersStore.state.filtersStatistic = {
  fairsharing_registry: {
    buckets: [
      { key: "standard", doc_count: 5 },
      { key: "database", doc_count: 10 },
      { key: "policy", doc_count: 15 },
    ],
  },
  record_type: {
    buckets: [
      { key: "terminology_artefact", doc_count: 5 },
      { key: "model_and_format", doc_count: 10 },
      { key: "reporting_guideline", doc_count: 15 },
      { key: "identifier_schema", doc_count: 15 },
      { key: "funder", doc_count: 15 },
      { key: "journal", doc_count: 15 },
      { key: "society", doc_count: 15 },
      { key: "repository", doc_count: 10 },
      { key: "knowledgebase", doc_count: 11 },
      { key: "knowledgebase_and_repository", doc_count: 12 },
      { key: "project", doc_count: 6 },
      { key: "institution", doc_count: 5 },
      { key: "journal_publisher", doc_count: 4 },
    ],
  },
  subjects: {
    buckets: [
      { key: "natural science", doc_count: 5 },
      { key: "engineering science", doc_count: 10 },
      { key: "humanities", doc_count: 15 },
      { key: "social science", doc_count: 15 },
    ],
  },
  user_defined_tags: {
    buckets: [{ key: "institutional repository", doc_count: 70 }],
  },
};

describe("InfoBlock.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(InfoBlock, {
      vuetify,
      mocks: { $store },
      stubs: {
        RouterLink: RouterLinkStub,
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("InfoBlock");
  });

  it("populates blockInfo with counts from the Vuex store", () => {
    // Access the computed property directly from the wrapper's ViewModel (vm)
    const blockInfo = wrapper.vm.populatedBlockInfo;

    // 1. Check that the base nodes exist
    expect(blockInfo.standard).toBeDefined();
    expect(blockInfo.database).toBeDefined();
    expect(blockInfo.policy).toBeDefined();

    // 2. Verify that total counts are applied as numbers (mapped from the getter)
    expect(typeof blockInfo.standard.total.count).toBe("number");
    expect(typeof blockInfo.database.total.count).toBe("number");
    expect(typeof blockInfo.policy.total.count).toBe("number");

    // Note: If you know the exact expected count based on your mock store and JSON,
    // you can be more specific, e.g., expect(blockInfo.standard.total.count).toBe(5);
  });

  it("sorts the items within each category by count in descending order", () => {
    const blockInfo = wrapper.vm.populatedBlockInfo;

    // Helper function to verify an array is sorted descending by the 'count' property
    const isSortedDescending = (items) => {
      for (let i = 0; i < items.length - 1; i++) {
        if (items[i].count < items[i + 1].count) {
          return false;
        }
      }
      return true;
    };

    // Assert that the sort function in your computed property worked
    expect(isSortedDescending(blockInfo.standard.items)).toBe(true);
    expect(isSortedDescending(blockInfo.database.items)).toBe(true);
    expect(isSortedDescending(blockInfo.policy.items)).toBe(true);
  });

  it("gracefully falls back to 0 for missing or loading data", () => {
    // Arrange: Wipe out the mock store data to simulate an empty/loading state
    wrapper.vm.$store.state.searchFilters.filtersStatistic = {};

    // Act: Re-evaluate the computed property
    const blockInfo = wrapper.vm.populatedBlockInfo;

    // Assert: The '|| 0' fallback should catch undefined values and set them to 0
    expect(blockInfo.standard.total.count).toBe(0);
    expect(blockInfo.database.total.count).toBe(0);
    expect(blockInfo.policy.total.count).toBe(0);

    // Ensure the fallback also applied to the nested items array
    if (blockInfo.standard.items.length > 0) {
      expect(blockInfo.standard.items[0].count).toBe(0);
    }
  });
});
