import { shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { createStore } from "vuex";
import {
  VDataIteratorStub,
  VBtnToggleStub,
  VDataTableFooterStub,
  VSlotStub,
  VBtnStub,
  VIconStub,
  VTextFieldStub,
  VSelectStub,
} from "../../../stubs/index.js";
import AdvancedSearchResultTable from "@/views/AdvancedSearch/AdvancedSearchResultTable.vue";

vi.mock("@/utils/recordsCardUtils", () => ({
  default: {
    methods: {
      getRecordLink: vi.fn((record) => `/mock-link/${record.id}`),
    },
  },
}));

const updateOptions = VDataIteratorStub.methods.updateOptions;

describe("AdvancedSearchResultTable.vue", () => {
  let wrapper;
  let store;
  let vuetify;
  let mockFetchAction;
  let wrappers;

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

    const mountedWrapper = shallowMount(AdvancedSearchResultTable, {
      global: {
        plugins: [store, vuetify],
        mocks: {
          $route: mockRoute,
        },
        stubs: {
          ErrorPage: true,
          SaveSearchButton: true,
          RecordStatus: true,
          TagChips: true,
          VDataIterator: VDataIteratorStub,
          VDataTableFooter: VDataTableFooterStub,
          VToolbar: VSlotStub,
          VTextField: VTextFieldStub,
          VSelect: VSelectStub,
          VBtnToggle: VBtnToggleStub,
          VBtn: VBtnStub,
          VIcon: VIconStub,
          VSpacer: true,
          VRow: VSlotStub,
          VCol: VSlotStub,
          VCard: VSlotStub,
          VCardTitle: VSlotStub,
        },
      },
    });
    wrappers.push(mountedWrapper);
    return mountedWrapper;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    wrappers = [];
    vi.stubEnv("VITE_FAIRSHARING_URL", "https://mock.fairsharing.org");
    vi.stubGlobal("innerWidth", 1280);
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");

    vi.stubGlobal("location", {
      href: "",
    });
  });

  afterEach(() => {
    wrappers.forEach((w) => w.unmount());
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("renders ErrorPage when getErrorStatus is true", () => {
    wrapper = mountComponent({ error: true });
    expect(wrapper.find("error-page-stub").exists()).toBe(true);
    expect(wrapper.find('[data-test="iterator"]').exists()).toBe(false);
  });

  it("renders table content when getErrorStatus is false", () => {
    wrapper = mountComponent({ error: false });
    expect(wrapper.find("error-page-stub").exists()).toBe(false);
    expect(wrapper.find('[data-test="iterator"]').exists()).toBe(true);
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

  it("renders record cards, descriptions and links alongside save and download controls", () => {
    const record = {
      id: 42,
      name: "Example resource",
      description: "Example description",
    };
    wrapper = mountComponent({ response: [record] });
    expect(
      wrapper
        .find('a[href="https://mock.fairsharing.org/mock-link/42"]')
        .text(),
    ).toBe("Example resource");
    expect(wrapper.text()).toContain("Example description");
    expect(
      wrapper.findComponent({ name: "RecordStatus" }).props("record"),
    ).toEqual(record);
    expect(wrapper.findComponent({ name: "TagChips" }).props("record")).toEqual(
      record,
    );
    expect(wrapper.find("save-search-button-stub").exists()).toBe(true);
    expect(wrapper.find('a[href*="gitbook"]').attributes("target")).toBe(
      "_blank",
    );
  });

  it("updates search and sorting through controls and forwards footer options", async () => {
    wrapper = mountComponent({
      response: [{ id: 42, name: "Example" }],
      loading: true,
    });
    await wrapper
      .find('[aria-label="Filter these results"]')
      .setValue("Example");
    await wrapper.find('[aria-label="Sort by"]').setValue("Status");
    wrapper.findComponent(VBtnToggleStub).vm.$emit("update:modelValue", true);
    await wrapper.setData({ page: 2, itemsPerPage: 20 });
    expect(wrapper.findComponent(VDataIteratorStub).props()).toMatchObject({
      loading: true,
      search: "Example",
      sortBy: [{ key: "status", order: "desc" }],
      page: 2,
      itemsPerPage: 20,
    });
    const footers = wrapper.findAllComponents(VDataTableFooterStub);
    expect(footers).toHaveLength(2);
    footers[0].vm.$emit("update:options", { page: 2 });
    footers[1].vm.$emit("update:options", { itemsPerPage: 20 });
    expect(updateOptions.mock.calls).toEqual([
      [{ page: 2 }],
      [{ itemsPerPage: 20 }],
    ]);
  });

  it("renders an empty state without pagination", () => {
    wrapper = mountComponent();
    expect(wrapper.text()).toContain("No results found.");
    expect(wrapper.findAllComponents(VDataTableFooterStub)).toHaveLength(0);
    expect(mockFetchAction).not.toHaveBeenCalled();
    expect(store.commit).not.toHaveBeenCalled();
  });

  it("uses the mobile layout without desktop sorting controls", async () => {
    vi.stubGlobal("innerWidth", 500);
    wrapper = mountComponent();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-test="action-wrapper"]').classes()).toContain(
      "flex-column",
    );
    expect(wrapper.find('[aria-label="Sort by"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="sort-toggle"]').exists()).toBe(false);
    expect(wrapper.find('[aria-label="Filter these results"]').exists()).toBe(
      true,
    );
  });

  it("downloads complete CSV fields and fallback values through the download button", async () => {
    wrapper = mountComponent({
      response: [
        {
          id: 1,
          name: "First, resource",
          abbreviation: "FR",
          doi: "10.1000/first",
          homepage: "https://example.org",
          publications: [1, 2],
        },
        { id: 2, name: "Second", publications: [] },
      ],
    });
    await wrapper
      .findAll("button")
      .find((b) => b.text() === "Download Results")
      .trigger("click");
    const blob = URL.createObjectURL.mock.calls[0][0];
    expect(blob.type).toBe("text/csv");
    expect(await blob.text()).toBe(
      "Name 5,Abbreviation,FAIRsharingURL,FAIRsharing DOI,Homepage,Number of Publications \nFirst resource,FR,https://fairsharing.org/1,10.1000/first,https://example.org,2\nSecond,n/a,https://fairsharing.org/2,n/a,n/a,0\n",
    );
    expect(window.location.href).toBe("blob:mock-url");
  });

  it.each(["term", undefined])(
    "parses boolean and list fields and fetches results with q=%s",
    (q) => {
      wrapper = mountComponent(
        {},
        {
          operator: "OR",
          fields:
            "(operator=AND&isRecommended=true&isFairAssist=false&registry=database+standard)",
          ...(q ? { q } : {}),
        },
      );
      const expected = {
        operatorIdentifier: "OR",
        children: [
          {
            operatorIdentifier: "AND",
            children: [
              { identifier: "isRecommended", value: "true" },
              { identifier: "isFairAssist", value: "false" },
              { identifier: "registry", value: ["database", "standard"] },
            ],
          },
        ],
      };
      expect(store.commit).toHaveBeenCalledWith(
        "advancedSearch/setAdvancedSearch",
        expected,
      );
      expect(store.commit).toHaveBeenCalledWith(
        "advancedSearch/setEditAdvancedSearch",
        expected,
      );
      expect(mockFetchAction).toHaveBeenCalledWith(expect.any(Object), q);
    },
  );

  it.each([
    { response: [{ id: 1, name: "Cached result" }] },
    { response: {} },
    { query: { fields: [{ identifier: "registry" }] } },
    { query: { fields: {} } },
  ])(
    "preserves existing results or query instead of parsing URL fields: %j",
    (getters) => {
      wrapper = mountComponent(getters, {
        operator: "AND",
        fields: "(registry=standard)",
      });
      expect(store.commit).not.toHaveBeenCalled();
      expect(mockFetchAction).not.toHaveBeenCalled();
    },
  );
});
