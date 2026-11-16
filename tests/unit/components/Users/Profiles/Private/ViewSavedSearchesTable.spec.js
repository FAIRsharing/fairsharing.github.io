import { flushPromises, shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "vuex";
import ViewSavedSearchesTable from "@/components/Users/Profiles/Private/ViewSavedSearchesTable.vue";
import {
  VBtnStub,
  VDataTableStub,
  VDialogStub,
  VIconStub,
} from "../../../../../stubs";

const slotStub = { template: "<div><slot /></div>" };
const tableStub = {
  ...VDataTableStub,
  template: `<table><tbody><tr v-for="item in items" :key="item.id"><td v-for="header in headers" :key="header.value" :data-column="header.value"><slot :name="'item.' + header.value" :item="item" /></td></tr><tr v-if="!items.length"><td><slot name="no-data" /></td></tr></tbody></table>`,
};

// 1. Create the mock functions FIRST
const { mockDelete, mockUpdate } = vi.hoisted(() => {
  return {
    mockDelete: vi.fn().mockResolvedValue({ message: "success" }),
    mockUpdate: vi.fn().mockResolvedValue({ id: 2, name: "Updated" }),
  };
});

vi.mock("@/lib/Client/RESTClient", () => {
  return {
    default: vi.fn(function () {
      return {
        deleteSavedSearch: mockDelete,
        updateSaveSearch: mockUpdate,
      };
    }),
  };
});

describe("ViewSavedSearchesTable.vue", () => {
  let store;
  let mockActions;
  let wrappers;

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
      url: "/search?q=created",
      comments: "Created search comment",
      fairsharingRecords: [{ id: 42, name: "Example record" }],
      organisations: [{ id: 7, name: "Example organisation" }],
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

  const createWrapper = (userStateOverrides = {}, routeOverrides = {}) => {
    if (Object.keys(userStateOverrides).length) {
      const currentUser = store.state.users.user();
      store.state.users.user = () => ({
        ...currentUser,
        ...userStateOverrides,
      });
    }
    const wrapper = shallowMount(ViewSavedSearchesTable, {
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
          VDataTable: tableStub,
          VIcon: VIconStub,
          VDialog: VDialogStub,
          VCard: slotStub,
          VCardTitle: slotStub,
          VCardActions: slotStub,
          VSpacer: true,
          VBtn: VBtnStub,
        },
      },
    });
    wrappers.push(wrapper);
    return wrapper;
  };

  afterEach(() => {
    wrappers.forEach((wrapper) => wrapper.unmount());
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    wrappers = [];
    vi.clearAllMocks();
    mockDelete.mockReset().mockResolvedValue({ message: "success" });
    mockUpdate.mockReset().mockResolvedValue({ id: 2, name: "Updated" });

    mockActions = {
      getUser: vi.fn(),
      getPublicUser: vi.fn().mockResolvedValue({
        user: { createdSearches: [], savedSearches: [] },
      }),
    };

    // Setup complete Vuex Store layout
    store = createStore({
      modules: {
        advancedSearch: {
          namespaced: true,
          mutations: {
            setAdvancedSearchDialogStatus: vi.fn(),
          },
        },
        saveSearch: {
          namespaced: true,
          mutations: {
            setSaveSearchResult: vi.fn(),
          },
        },
        users: {
          namespaced: true,
          state: {
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

    vi.spyOn(store, "commit");
  });

  describe("Initialization & Computed Properties", () => {
    it("mounts and combines searches correctly", async () => {
      const wrapper = createWrapper();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.totalSearches).toHaveLength(2);
      expect(wrapper.vm.totalSearches[0].id).toBe(2);
      expect(wrapper.vm.totalSearches[1].id).toBe(1);
    });

    it("adds Actions header if user is logged in", () => {
      const wrapper = createWrapper();
      const headers = wrapper.vm.headers;

      const hasActions = headers.some(
        (h) => h.value === "actions" || h.key === "actions",
      );
      expect(hasActions).toBe(true);
    });

    it("adds Additional User header if user is super curator", () => {
      store.state.users.user = () => ({
        isLoggedIn: true,
        is_super_curator: true,
      });
      const wrapper = createWrapper();

      const headers = wrapper.vm.headers;
      const hasAdditionalUser = headers.some(
        (h) => h.value === "additionalUser" || h.key === "additionalUser",
      );

      expect(hasAdditionalUser).toBe(true);
    });
  });

  describe("Methods", () => {
    it("filters additional users correctly", () => {
      const wrapper = createWrapper();
      const item = mockCreatedSearches[0];
      const additional = wrapper.vm.additionalUsers(item);

      expect(additional).toHaveLength(1);
      expect(additional[0].id).toBe(2);
    });

    it("commits to advancedSearch store when openAdvancedSearch is called", () => {
      const wrapper = createWrapper();
      wrapper.vm.openAdvancedSearch();

      // 🎯 FIX 4: Assert against store instance spy
      expect(store.commit).toHaveBeenCalledWith(
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

      // 🎯 FIX 5: Assert against store instance spy
      expect(store.commit).toHaveBeenCalledWith(
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

  it("renders search metadata, creator, records and organisation links", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('a[href="/users/1"]').text()).toBe("user1");
    expect(wrapper.find('a[href="/search?q=created"]').text()).toBe(
      "Created Search 1",
    );
    expect(wrapper.find('a[href="/42"]').text()).toBe("Example record");
    expect(wrapper.find('a[href="/organisations/7"]').text()).toBe(
      "Example organisation",
    );
    expect(wrapper.text()).toContain("2023-01-01");
    expect(wrapper.text()).toContain("Created search comment");
    expect(wrapper.find('[data-column="additionalUser"]').exists()).toBe(false);
  });

  it("renders additional users for super curators and hides actions for logged-out visitors", async () => {
    const curator = createWrapper({ is_super_curator: true });
    await curator.vm.$nextTick();
    expect(
      curator.findAll('[data-column="additionalUser"] a').map((a) => a.text()),
    ).toEqual(["user1", "user2"]);
    const visitor = createWrapper({
      isLoggedIn: false,
      is_super_curator: false,
    });
    await visitor.vm.$nextTick();
    expect(visitor.vm.headers.map((h) => h.value)).not.toContain("actions");
    expect(visitor.findAll('[data-test="v-icon"]')).toHaveLength(0);
  });

  it("deduplicates searches by id and sorts the latest entry first", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    const duplicate = {
      ...mockCreatedSearches[0],
      name: "Latest saved copy",
      createdAt: "2023-02-01T10:00:00",
    };
    await wrapper.setProps({
      savedSearches: [...mockSavedSearches, duplicate],
    });
    await wrapper.vm.combinedSearches();
    expect(wrapper.vm.totalSearches.map((s) => s.id)).toEqual([1, 2]);
    expect(wrapper.vm.totalSearches[0].name).toBe("Latest saved copy");
    expect(
      wrapper.findAll('[data-column="name"] a').map((a) => a.text()),
    ).toEqual(["Latest saved copy", "Saved Search 1"]);
  });

  it("opens advanced search through the empty-state link", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await wrapper.setProps({ createdSearches: [], savedSearches: [] });
    await wrapper.vm.combinedSearches();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("You haven't saved any searches yet.");
    await wrapper.find("td a").trigger("click");
    expect(store.commit).toHaveBeenCalledWith(
      "advancedSearch/setAdvancedSearchDialogStatus",
      true,
    );
  });

  it.each([
    [
      "own public profile",
      { name: "PublicProfile", params: { id: "1" } },
      "delete",
    ],
    [
      "another public profile",
      { name: "PublicProfile", params: { id: "2" } },
      "unlink",
    ],
    ["private account", { name: "UserProfile", params: { id: "2" } }, "delete"],
  ])(
    "opens and cancels the correct dialog on the %s",
    async (_, route, action) => {
      const wrapper = createWrapper({}, route);
      await wrapper.vm.$nextTick();
      await wrapper.findComponent(VIconStub).trigger("click");
      expect(wrapper.vm.selectedItem.id).toBe(2);
      expect(wrapper.vm.modifyDialog).toBe(true);
      expect(wrapper.text()).toContain(`Are you sure you want to ${action}`);
      expect(wrapper.vm.deleteSavedSearch).toBe(action === "delete");
      expect(wrapper.vm.unlinkSavedSearch).toBe(action === "unlink");
      await wrapper
        .findAll("button")
        .find((b) => b.text() === "Cancel")
        .trigger("click");
      expect(wrapper.find('[data-test="v-dialog"]').exists()).toBe(false);
      expect(mockDelete).not.toHaveBeenCalled();
      expect(mockUpdate).not.toHaveBeenCalled();
    },
  );

  it("deletes through the dialog and shows loading until the API completes", async () => {
    let resolveDelete;
    mockDelete.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveDelete = resolve;
        }),
    );
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await wrapper.findComponent(VIconStub).trigger("click");
    await wrapper
      .findAll("button")
      .find((b) => b.text() === "OK")
      .trigger("click");
    expect(wrapper.vm.loading).toBe(true);
    expect(
      wrapper
        .findAllComponents(VBtnStub)
        .find((b) => b.text() === "OK")
        .props("loading"),
    ).toBe(true);
    expect(mockDelete).toHaveBeenCalledWith(2, "fake-token");
    resolveDelete({ message: "success" });
    await flushPromises();
    expect(mockActions.getUser).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.deleteSavedSearch).toBe(false);
    expect(wrapper.vm.modifyDialog).toBe(false);
  });

  it("keeps the searches when deletion returns a failure response", async () => {
    mockDelete.mockResolvedValueOnce({
      message: "failure",
      error: "Not allowed",
    });
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    const before = [...wrapper.vm.totalSearches];
    wrapper.vm.deleteItem(mockCreatedSearches[0]);
    await wrapper.vm.deleteItemConfirm();
    expect(wrapper.vm.totalSearches).toEqual(before);
    expect(mockActions.getUser).not.toHaveBeenCalled();
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.modifyDialog).toBe(false);
  });

  it("unlinks only the viewed user and refreshes the displayed public searches", async () => {
    const wrapper = createWrapper(
      {},
      { name: "PublicProfile", params: { id: "2" } },
    );
    const item = {
      ...mockCreatedSearches[0],
      users: [...mockCreatedSearches[0].users, { id: 4, username: "retained" }],
    };
    const refreshed = {
      ...mockSavedSearches[0],
      name: "Refreshed public search",
    };
    mockActions.getPublicUser.mockResolvedValueOnce({
      user: { createdSearches: [], savedSearches: [refreshed] },
    });
    wrapper.vm.unlinkItem(item);
    await wrapper.vm.$nextTick();
    await wrapper
      .findAll("button")
      .find((b) => b.text() === "OK")
      .trigger("click");
    await flushPromises();
    expect(mockUpdate).toHaveBeenCalledWith(1, { user_ids: [4] }, "fake-token");
    expect(mockActions.getPublicUser).toHaveBeenCalledWith(
      expect.any(Object),
      "2",
    );
    expect(mockActions.getUser).toHaveBeenCalledTimes(1);
    expect(store.commit).toHaveBeenCalledWith(
      "saveSearch/setSaveSearchResult",
      { id: 2, name: "Updated" },
    );
    expect(wrapper.vm.totalSearches).toEqual([refreshed]);
    expect(wrapper.text()).toContain("Refreshed public search");
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.unlinkSavedSearch).toBe(false);
    expect(wrapper.vm.modifyDialog).toBe(false);
  });

  it.each(["delete", "unlink"])(
    "propagates a rejected %s request without refreshing or closing its dialog",
    async (action) => {
      const error = new Error("Network unavailable");
      const wrapper = createWrapper();
      await wrapper.vm.$nextTick();
      if (action === "delete") {
        mockDelete.mockRejectedValueOnce(error);
        wrapper.vm.deleteItem(mockCreatedSearches[0]);
        await expect(wrapper.vm.deleteItemConfirm()).rejects.toThrow(
          "Network unavailable",
        );
      } else {
        mockUpdate.mockRejectedValueOnce(error);
        wrapper.vm.unlinkItem(mockSavedSearches[0]);
        await expect(wrapper.vm.unlinkItemConfirm()).rejects.toThrow(
          "Network unavailable",
        );
      }
      expect(mockActions.getUser).not.toHaveBeenCalled();
      expect(mockActions.getPublicUser).not.toHaveBeenCalled();
      expect(store.commit).not.toHaveBeenCalledWith(
        "saveSearch/setSaveSearchResult",
        expect.anything(),
      );
      expect(wrapper.vm.modifyDialog).toBe(true);
      expect(wrapper.vm.totalSearches).toHaveLength(2);
    },
  );
});
