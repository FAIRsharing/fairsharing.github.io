import { shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { createStore } from "vuex";
import AdvancedSearchResultTable from "@/views/AdvancedSearch/AdvancedSearchResultTable.vue";

vi.mock("@/utils/recordsCardUtils", () => ({
  default: {
    methods: {
      getRecordLink: vi.fn((record) => `/mock-link/${record.id}`),
    },
  },
}));

vi.stubEnv("VITE_FAIRSHARING_URL", "https://mock.fairsharing.org");

describe("AdvancedSearchResultTable.vue", () => {
  let wrapper;
  let store;
  let vuetify;
  let mockFetchAction;

  const mockRoute = { query: {} };

  const createVuexStore = (getterOverrides = {}) => {
    mockFetchAction = vi.fn();
    return createStore({
      modules: {
        advancedSearch: {
          namespaced: true,
          getters: {
            getAdvancedSearchResponse: () => getterOverrides.response || [],
            getLoadingStatus: () => getterOverrides.loading || false,
            getErrorStatus: () => getterOverrides.error || false,
            getAdvancedSearchQuery: () =>
              getterOverrides.query || { fields: [] },
          },
          actions: { fetchAdvancedSearchResults: mockFetchAction },
          mutations: {
            setEditAdvancedSearch: vi.fn(),
            setAdvancedSearch: vi.fn(),
          },
        },
      },
    });
  };

  const mountComponent = (getters = {}, routeQuery = {}) => {
    store = createVuexStore(getters);
    vi.spyOn(store, "commit");

    vuetify = createVuetify();
    mockRoute.query = routeQuery;

    return shallowMount(AdvancedSearchResultTable, {
      global: {
        plugins: [store, vuetify],
        mocks: {
          $route: mockRoute,
          $vuetify: { display: { mdAndUp: true } },
        },
        stubs: ["ErrorPage", "SaveSearchButton", "RecordStatus", "TagChips"],
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = vi.fn(() => "blob:mock-url");

    vi.stubGlobal("location", {
      href: "",
    });
  });

  afterEach(() => {
    if (wrapper) wrapper.unmount();
    vi.unstubAllGlobals();
  });

  it("renders ErrorPage when getErrorStatus is true", () => {
    wrapper = mountComponent({ error: true });
    expect(wrapper.find("error-page-stub").exists()).toBe(true);
    expect(wrapper.find("v-data-iterator-stub").exists()).toBe(false);
  });

  it("renders table content when getErrorStatus is false", () => {
    wrapper = mountComponent({ error: false });
    expect(wrapper.find("error-page-stub").exists()).toBe(false);
    expect(wrapper.find("v-data-iterator-stub").exists()).toBe(true);
  });

  // --- COMPUTED PROPERTY TESTS ---

  it("computes noPagination correctly", () => {
    wrapper = mountComponent({ response: [] });
    expect(wrapper.vm.noPagination).toBe(true);

    wrapper = mountComponent({ response: [{ id: 1 }] });
    expect(wrapper.vm.noPagination).toBe(false);
  });

  it("computes sortData correctly for Name", () => {
    wrapper = mountComponent();
    wrapper.vm.sortBy = "Name";
    wrapper.vm.sortDesc = true;
    expect(wrapper.vm.sortData).toEqual([{ key: "name", order: "desc" }]);
    wrapper.vm.sortDesc = false;
    expect(wrapper.vm.sortData).toEqual([{ key: "name", order: "asc" }]);
  });

  it("computes sortData correctly for Registry", () => {
    wrapper = mountComponent();
    wrapper.vm.sortBy = "Registry";
    wrapper.vm.sortDesc = true;
    expect(wrapper.vm.sortData).toEqual([{ key: "registry", order: "desc" }]);

    wrapper.vm.sortDesc = false;
    expect(wrapper.vm.sortData).toEqual([{ key: "registry", order: "asc" }]);
  });

  it("computes sortData correctly for Type", () => {
    wrapper = mountComponent();
    wrapper.vm.sortBy = "Type";
    wrapper.vm.sortDesc = true;
    expect(wrapper.vm.sortData).toEqual([{ key: "type", order: "desc" }]);

    wrapper.vm.sortDesc = false;
    expect(wrapper.vm.sortData).toEqual([{ key: "type", order: "asc" }]);
  });

  it("computes sortData correctly for Status", () => {
    wrapper = mountComponent();
    wrapper.vm.sortBy = "Status";
    wrapper.vm.sortDesc = true;
    expect(wrapper.vm.sortData).toEqual([{ key: "status", order: "desc" }]);

    wrapper.vm.sortDesc = false;
    expect(wrapper.vm.sortData).toEqual([{ key: "status", order: "asc" }]);
  });

  it("computes sortData correctly for Description", () => {
    wrapper = mountComponent();
    wrapper.vm.sortBy = "Description";
    wrapper.vm.sortDesc = true;
    expect(wrapper.vm.sortData).toEqual([
      { key: "description", order: "desc" },
    ]);
    wrapper.vm.sortDesc = false;
    expect(wrapper.vm.sortData).toEqual([{ key: "description", order: "asc" }]);
  });

  it("computes sortData correctly for any value/default", () => {
    wrapper = mountComponent();
    wrapper.vm.sortBy = "Test";
    wrapper.vm.sortDesc = true;
    expect(wrapper.vm.sortData).toEqual([{ key: "name", order: "desc" }]);
    wrapper.vm.sortDesc = false;
    expect(wrapper.vm.sortData).toEqual([{ key: "name", order: "asc" }]);
  });

  it("generates CSV and triggers download in downloadResults()", () => {
    const mockData = [
      {
        id: "1",
        name: "Test, Record",
        abbreviation: "TR",
        publications: [1, 2],
      },
    ];
    wrapper = mountComponent({ response: mockData });

    wrapper.vm.downloadResults();

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    // Verify our stub location URL caught the payload assignment
    expect(window.location.href).toBe("blob:mock-url");
  });

  it("calculates recordPublicationsLength correctly", () => {
    wrapper = mountComponent();
    expect(
      wrapper.vm.recordPublicationsLength({ publications: [1, 2, 3] }),
    ).toBe(3);
    expect(wrapper.vm.recordPublicationsLength({ publications: [] })).toBe(0);
    expect(wrapper.vm.recordPublicationsLength({})).toBe(0);
  });

  it("parses URL query parameters and dispatches store actions on mount", () => {
    const testRouteQuery = {
      operator: "AND",
      fields: "(operator=OR&registry=true+false)",
      q: "searchterm",
    };

    wrapper = mountComponent(
      { response: [], query: { fields: [] } },
      testRouteQuery,
    );

    expect(store.commit).toHaveBeenCalledWith(
      "advancedSearch/setAdvancedSearch",
      expect.any(Object),
    );
    expect(store.commit).toHaveBeenCalledWith(
      "advancedSearch/setEditAdvancedSearch",
      expect.any(Object),
    );

    const committedPayload = store.commit.mock.calls[0][1];
    expect(committedPayload.operatorIdentifier).toBe("AND");
    expect(committedPayload.children[0].operatorIdentifier).toBe("OR");
    expect(committedPayload.children[0].children[0].identifier).toBe(
      "registry",
    );
    expect(committedPayload.children[0].children[0].value).toEqual([
      "true",
      "false",
    ]);

    expect(mockFetchAction).toHaveBeenCalledWith(
      expect.any(Object),
      "searchterm",
    );
  });
});
