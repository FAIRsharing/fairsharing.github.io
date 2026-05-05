import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "vuex";
import ViewSavedSearchesTable from "@/components/Users/Profiles/Private/ViewSavedSearchesTable.vue";
import mockStore from "@/store";

// 1. Create the mock functions FIRST
const { mockDelete, mockUpdate } = vi.hoisted(() => {
  return {
    mockDelete: vi.fn().mockResolvedValue({ message: "success" }),
    mockUpdate: vi.fn().mockResolvedValue({ id: 2, name: "Updated" }),
  };
});

vi.mock("@/lib/Client/RESTClient", () => {
  return {
    default: vi.fn(() => ({
      deleteSavedSearch: mockDelete,
      updateSaveSearch: mockUpdate,
    })),
  };
});

vi.mock("@/store", () => ({
  default: {
    commit: vi.fn(),
  },
}));

describe("ViewSavedSearchesTable.vue", () => {
  let store;
  let restClientMock;
  let mockActions;

  // Reusable Mock Data
  const mockCreatedSearches = [
    {
      id: 1,
      name: "Created Search 1",
      createdAt: "2023-01-01T10:00:00",
      creator: { id: 1, username: "user1" },
      users: [
        { id: 1, username: "user1" },
        { id: 2, username: "user2" },
      ],
      fairsharingRecords: [],
      organisations: [],
    },
  ];

  const mockSavedSearches = [
    {
      id: 2,
      name: "Saved Search 1",
      createdAt: "2023-01-05T10:00:00",
      creator: { id: 3, username: "user3" },
      users: [
        { id: 3, username: "user3" },
        { id: 1, username: "user1" },
      ],
      fairsharingRecords: [],
      organisations: [],
    },
  ];

  // Helper to create a fresh wrapper for each test
  const createWrapper = (userStateOverrides = {}, routeOverrides = {}) => {
    return shallowMount(ViewSavedSearchesTable, {
      props: {
        createdSearches: mockCreatedSearches,
        savedSearches: mockSavedSearches,
      },
      global: {
        plugins: [store],
        mocks: {
          $route: {
            params: { id: "1" },
            name: "UserProfile",
            ...routeOverrides,
          },
        },
        stubs: {
          VDataTable: true,
          VIcon: true,
          VDialog: true,
          VCard: true,
          VCardTitle: true,
          VCardActions: true,
          VSpacer: true,
          VBtn: true,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup Vuex Actions Mock
    mockActions = {
      getUser: vi.fn(),
      getPublicUser: vi.fn().mockResolvedValue({
        user: { createdSearches: [], savedSearches: [] },
      }),
    };

    // Setup Vuex Store
    store = createStore({
      modules: {
        users: {
          namespaced: true,
          state: {
            // Replicating component's state access pattern: this.user()
            user: () => ({
              id: 1,
              isLoggedIn: true,
              is_super_curator: false,
              credentials: { token: "fake-token" },
            }),
          },
          getters: {
            getUserRecords: () => ({
              user: {
                createdSearches: mockCreatedSearches,
                savedSearches: mockSavedSearches,
              },
            }),
          },
          actions: mockActions,
        },
      },
    });
  });

  describe("Initialization & Computed Properties", () => {
    it("mounts and combines searches correctly", async () => {
      const wrapper = createWrapper();

      // combinedSearches is called on mount. Wait for promises to resolve.
      await wrapper.vm.$nextTick();

      // totalSearches should be 2 (1 created + 1 saved)
      expect(wrapper.vm.totalSearches).toHaveLength(2);

      // Should be sorted by createdAt descending (latest first)
      expect(wrapper.vm.totalSearches[0].id).toBe(2); // The one from Jan 5
      expect(wrapper.vm.totalSearches[1].id).toBe(1); // The one from Jan 1
    });

    it("adds Actions header if user is logged in", () => {
      const wrapper = createWrapper();
      const headers = wrapper.vm.headers;

      const hasActions = headers.some((h) => h.value === "actions");
      expect(hasActions).toBe(true);
    });

    it("adds Additional User header if user is super curator", () => {
      // Create store again for this specific test case
      store.state.users.user = () => ({
        isLoggedIn: true,
        is_super_curator: true,
      });
      const wrapper = createWrapper();

      const headers = wrapper.vm.headers;
      const hasAdditionalUser = headers.some(
        (h) => h.value === "additionalUser",
      );

      expect(hasAdditionalUser).toBe(true);
    });
  });

  describe("Methods", () => {
    it("filters additional users correctly", () => {
      const wrapper = createWrapper();
      const item = mockCreatedSearches[0];

      // item.users has ID 1 and 2. Creator is ID 1.
      const additional = wrapper.vm.additionalUsers(item);

      expect(additional).toHaveLength(1);
      expect(additional[0].id).toBe(2);
    });

    it("commits to advancedSearch store when openAdvancedSearch is called", () => {
      const wrapper = createWrapper();
      wrapper.vm.openAdvancedSearch();

      expect(mockStore.commit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearchDialogStatus",
        true,
      );
    });

    it("sets up modifyDialog for Delete action", () => {
      const wrapper = createWrapper();
      const item = mockCreatedSearches[0];

      wrapper.vm.deleteItem(item);

      expect(wrapper.vm.selectedItem).toEqual(item);
      expect(wrapper.vm.modifyDialog).toBe(true);
      expect(wrapper.vm.deleteSavedSearch).toBe(true);
      expect(wrapper.vm.unlinkSavedSearch).toBe(false);
    });

    it("sets up modifyDialog for Unlink action", () => {
      const wrapper = createWrapper();
      const item = mockSavedSearches[0];

      wrapper.vm.unlinkItem(item);

      expect(wrapper.vm.selectedItem).toEqual(item);
      expect(wrapper.vm.modifyDialog).toBe(true);
      expect(wrapper.vm.unlinkSavedSearch).toBe(true);
      expect(wrapper.vm.deleteSavedSearch).toBe(false);
    });
  });

  describe("API Actions", () => {
    it("confirms delete and refreshes searches", async () => {
      const wrapper = createWrapper();
      wrapper.vm.selectedItem = mockCreatedSearches[0];

      await wrapper.vm.deleteItemConfirm();

      expect(wrapper.vm.loading).toBe(false);
      expect(mockDelete).toHaveBeenCalledWith(1, "fake-token");
      expect(mockActions.getUser).toHaveBeenCalled();
      expect(wrapper.vm.modifyDialog).toBe(false);
    });

    it("confirms unlink, updates store, and refreshes searches", async () => {
      const wrapper = createWrapper();
      wrapper.vm.selectedItem = mockSavedSearches[0];

      await wrapper.vm.unlinkItemConfirm();
      expect(mockUpdate).toHaveBeenCalledWith(
        2,
        { user_ids: [] },
        "fake-token",
      );

      expect(mockStore.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchResult",
        { id: 2, name: "Updated" },
      );

      expect(mockActions.getPublicUser).toHaveBeenCalledWith(
        expect.any(Object),
        wrapper.vm.$route.params.id,
      );
      expect(wrapper.vm.modifyDialog).toBe(false);
    });
  });
});
