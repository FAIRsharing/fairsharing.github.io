import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import SavedSearches from "@/components/Records/Record/GeneralInfo/SavedSearches.vue";
import saveSearchStore from "@/store";

// Mock visualViewport because JSDOM doesn't implement it
Object.defineProperty(window, "visualViewport", {
  writable: true,
  configurable: true,
  value: {
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 1,
    offsetLeft: 0,
    offsetTop: 0,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  },
});

const { mockUpdateSaveSearch } = vi.hoisted(() => {
  return {
    mockUpdateSaveSearch: vi
      .fn()
      .mockResolvedValue({ id: "updated_search_123" }),
  };
});

// Now Vitest can safely use it here!
vi.mock("@/lib/Client/RESTClient.js", () => ({
  default: vi.fn().mockImplementation(() => ({
    updateSaveSearch: mockUpdateSaveSearch,
  })),
}));

// Mock the generic store import to intercept the commit
vi.mock("@/store", () => ({
  default: {
    commit: vi.fn(),
  },
}));

describe("SavedSearches.vue", () => {
  let wrapper;
  let store;
  let mockFetchRecord;

  const vuetify = createVuetify({
    components,
    directives,
  });

  const mockSavedSearches = [
    {
      id: 1,
      name: "Test Search",
      url: "/search/1",
      comments: "Test comment",
      creator: { id: 10, username: "test_user" },
      fairsharingRecords: [{ id: "record_1" }, { id: "record_2" }],
    },
  ];

  beforeEach(() => {
    mockFetchRecord = vi.fn().mockResolvedValue();
    store = createStore({
      modules: {
        record: {
          namespaced: true,
          state: {
            currentRecord: {
              fairsharingRecord: { id: "record_1" },
            },
          },
          getters: {
            getField: () => (field) => {
              if (field === "savedSearches") return mockSavedSearches;
              return [];
            },
          },
          actions: {
            fetchRecord: mockFetchRecord,
          },
        },
        users: {
          namespaced: true,
          state: {
            user: () => ({
              is_super_curator: true,
              credentials: { token: "mock-token-123" },
            }),
          },
        },
      },
    });

    wrapper = mount(SavedSearches, {
      global: {
        plugins: [vuetify, store],
        stubs: {
          RecordStatus: true,
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the saved searches if data exists", () => {
    expect(wrapper.text()).toContain("This policy has certain requirements");
    expect(wrapper.text()).toContain("Test Search");
    expect(wrapper.text()).toContain("test_user");
  });

  it("shows the unlink button for super curators", () => {
    const unlinkBtn = wrapper.findComponent({ name: "VBtn" });
    expect(unlinkBtn.exists()).toBe(true);
    expect(unlinkBtn.html()).toContain("fas fa-unlink");
  });

  it("hides the unlink button if user is not a super curator", async () => {
    store.state.users.user = () => ({
      is_super_curator: false,
      credentials: { token: "mock-token-123" },
    });

    // Remount to apply the new state
    wrapper = mount(SavedSearches, {
      global: { plugins: [vuetify, store], stubs: { RecordStatus: true } },
    });

    const unlinkBtn = wrapper.find(".fa-unlink");
    expect(unlinkBtn.exists()).toBe(false);
  });

  // --- DIALOG & METHODS ---

  it("opens the unlink confirmation dialog when the unlink button is clicked", async () => {
    const unlinkBtn = wrapper.findComponent({ name: "VBtn" }); // The fas fa-unlink button
    await unlinkBtn.trigger("click");

    expect(wrapper.vm.confirmUnlink).toBe(true);
    expect(wrapper.vm.selectedItem).toEqual(mockSavedSearches[0]);
    expect(document.body.innerHTML).toContain("Unlinking saved search");
  });

  it("closes the dialog without unlinking if cancel is clicked", async () => {
    // Open dialog first
    wrapper.vm.confirmUnlinkSavedSearch(mockSavedSearches[0]);

    // Trigger cancel logic directly
    await wrapper.vm.unlinkSavedSearch(false);

    // Verify dialog state reset and no APIs were called
    expect(wrapper.vm.confirmUnlink).toBe(false);
    expect(mockUpdateSaveSearch).not.toHaveBeenCalled();
    expect(mockFetchRecord).not.toHaveBeenCalled();
  });

  it("processes the unlinking logic when confirmed", async () => {
    // 1. Open the dialog
    wrapper.vm.confirmUnlinkSavedSearch(mockSavedSearches[0]);

    // 2. Execute the unlink true path
    await wrapper.vm.unlinkSavedSearch(true);
    await flushPromises();

    // 3. Verify the RESTClient was called with the filtered records
    // 'record_1' should be removed, leaving only 'record_2'
    expect(mockUpdateSaveSearch).toHaveBeenCalledWith(
      1, // The search ID
      { fairsharing_record_ids: ["record_2"] }, // The payload
      "mock-token-123", // The token
    );

    // 4. Verify the global store commit was fired
    expect(saveSearchStore.commit).toHaveBeenCalledWith(
      "saveSearch/setSaveSearchResult",
      { id: "updated_search_123" }, // Our mock return value
    );

    // 5. Verify it refetched the record
    expect(mockFetchRecord).toHaveBeenCalledWith(expect.anything(), {
      id: "record_1",
      token: "mock-token-123",
    });

    // 6. Verify the dialog was closed
    expect(wrapper.vm.confirmUnlink).toBe(false);
    expect(wrapper.vm.unlinkLoader).toBe(false);
  });
});
