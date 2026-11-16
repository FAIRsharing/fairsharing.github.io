import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import { reactive } from "vue";
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
import SearchOrganisationRecords from "@/components/Organisations/SearchOrganisationRecords.vue";

const updateOptions = VDataIteratorStub.methods.updateOptions;

describe("SearchOrganisationRecords.vue", () => {
  let wrapper;
  let vuetify;
  const mockRoute = reactive({ query: {} });

  const mockOrganisation = {
    organisationLinks: [
      {
        isLead: true,
        relation: "funds",
        fairsharingRecord: {
          id: 1,
          name: "Fairsharing DB",
          abbreviation: "FSDB",
          description: "A database about databases",
        },
      },
      {
        isLead: false,
        relation: "maintains",
        fairsharingRecord: {
          id: 2,
          name: "Second DB",
          abbreviation: null,
          description: "Another database",
        },
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_HOSTNAME", "https://fairsharing.org/");
    vi.stubGlobal("location", { href: "" });
    vi.stubGlobal("innerWidth", 1280);
    vi.spyOn(URL, "createObjectURL").mockReturnValue(
      "blob:http://localhost/mock-blob",
    );
    mockRoute.query = {};
    vuetify = createVuetify();
    wrapper = shallowMount(SearchOrganisationRecords, {
      props: { organisation: structuredClone(mockOrganisation) },
      global: {
        plugins: [vuetify],
        mocks: { $route: mockRoute },
        stubs: {
          VContainer: VSlotStub,
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
          VChip: VSlotStub,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("reformats nested organisation links correctly", () => {
    const reformatted = wrapper.vm.reformatLinks(
      mockOrganisation.organisationLinks,
    );

    expect(reformatted.length).toBe(2);

    // Check that properties were hoisted correctly
    expect(reformatted[0].id).toBe(1);
    expect(reformatted[0].isLead).toBe(true);
    expect(reformatted[0].relation).toBe("funds");
    expect(reformatted[0].name).toBe("Fairsharing DB");
  });

  it("returns an empty array if reformatLinks is passed null or undefined", () => {
    expect(wrapper.vm.reformatLinks(null)).toStrictEqual([]);
    expect(wrapper.vm.reformatLinks(undefined)).toStrictEqual([]);
  });

  it("formats abbreviations correctly using getAbbr", () => {
    // Has abbreviation
    expect(wrapper.vm.getAbbr({ abbreviation: "FSDB" })).toBe("(FSDB)");

    // No abbreviation
    expect(wrapper.vm.getAbbr({ abbreviation: null })).toBe("");
    expect(wrapper.vm.getAbbr({})).toBe("");
  });

  it("computes noPagination correctly based on reformatted links", async () => {
    // With data, noPagination should be false
    expect(wrapper.vm.noPagination).toBe(false);

    // Without data, it should be true
    await wrapper.setProps({ organisation: { organisationLinks: [] } });
    expect(wrapper.vm.noPagination).toBe(true);
  });

  it("computes filteredKeys correctly by removing Name and Description", () => {
    const keys = wrapper.vm.filteredKeys;
    expect(keys).not.toContain("Name");
    expect(keys).not.toContain("Description");
    expect(keys).toContain("Relation");
    expect(keys).toContain("Status");
  });

  describe("sortData computed property", () => {
    it("sorts by Name ascending/descending", async () => {
      await wrapper.setData({ sortBy: "Name", sortDesc: false });
      expect(wrapper.vm.sortData).toStrictEqual([
        { key: "name", order: "asc" },
      ]);

      await wrapper.setData({ sortBy: "Name", sortDesc: true });
      expect(wrapper.vm.sortData).toStrictEqual([
        { key: "name", order: "desc" },
      ]);
    });

    it("sorts by Registry", async () => {
      await wrapper.setData({ sortBy: "Registry", sortDesc: false });
      expect(wrapper.vm.sortData).toStrictEqual([
        { key: "registry", order: "asc" },
      ]);

      await wrapper.setData({ sortBy: "Registry", sortDesc: true });
      expect(wrapper.vm.sortData).toStrictEqual([
        { key: "registry", order: "desc" },
      ]);
    });

    it("sorts by Type", async () => {
      await wrapper.setData({ sortBy: "Type", sortDesc: false });
      expect(wrapper.vm.sortData).toStrictEqual([
        { key: "type", order: "asc" },
      ]);

      await wrapper.setData({ sortBy: "Type", sortDesc: true });
      expect(wrapper.vm.sortData).toStrictEqual([
        { key: "type", order: "desc" },
      ]);
    });

    it("sorts by Status", async () => {
      await wrapper.setData({ sortBy: "Status", sortDesc: false });
      expect(wrapper.vm.sortData).toStrictEqual([
        { key: "status", order: "asc" },
      ]);

      await wrapper.setData({ sortBy: "Status", sortDesc: true });
      expect(wrapper.vm.sortData).toStrictEqual([
        { key: "status", order: "desc" },
      ]);
    });

    it("sorts by Description", async () => {
      await wrapper.setData({ sortBy: "Description", sortDesc: false });
      expect(wrapper.vm.sortData).toStrictEqual([
        { key: "description", order: "asc" },
      ]);

      await wrapper.setData({ sortBy: "Description", sortDesc: true });
      expect(wrapper.vm.sortData).toStrictEqual([
        { key: "description", order: "desc" },
      ]);
    });

    it("defaults to Name if sortBy is unrecognized", async () => {
      await wrapper.setData({ sortBy: "UnknownThing", sortDesc: false });
      expect(wrapper.vm.sortData).toStrictEqual([
        { key: "name", order: "asc" },
      ]);

      await wrapper.setData({ sortBy: "UnknownThing", sortDesc: true });
      expect(wrapper.vm.sortData).toStrictEqual([
        { key: "name", order: "desc" },
      ]);
    });
  });

  it("generates a CSV and triggers downloadResults", () => {
    wrapper.vm.downloadResults();

    // Verify createObjectURL was called
    expect(global.URL.createObjectURL).toHaveBeenCalledOnce();

    // Verify window location was updated with the mock blob URL
    expect(window.location.href).toBe("blob:http://localhost/mock-blob");
  });

  it("computes currentRouteQuery correctly from the $route object", () => {
    const mockQuery = { searchTerm: "cancer", page: "2" };
    mockRoute.query = mockQuery;
    expect(wrapper.vm.currentRouteQuery).toStrictEqual(mockQuery);
  });

  it("renders record links, descriptions, relations and lead labels", () => {
    expect(
      wrapper.findAll('a[target="_blank"]').map((a) => a.attributes("href")),
    ).toEqual(["https://fairsharing.org/1", "https://fairsharing.org/2"]);
    expect(wrapper.text()).toContain("Fairsharing DB");
    expect(wrapper.text()).toContain("A database about databases");
    expect(wrapper.text()).toContain("Funds");
    expect(wrapper.text()).toContain("Maintains");
    expect(wrapper.findAll("b").map((b) => b.text())).toEqual([
      "Funds",
      "Maintains",
    ]);
    expect(wrapper.text().match(/LEAD ORGANISATION/g)).toHaveLength(1);
    expect(
      wrapper
        .findAllComponents({ name: "RecordStatus" })
        .map((c) => c.props("record").id),
    ).toEqual([1, 2]);
    expect(wrapper.findAllComponents({ name: "TagChips" })).toHaveLength(2);
  });

  it("forwards search, sort and pagination state to the iterator through controls", async () => {
    await wrapper
      .find('[aria-label="Filter these results"]')
      .setValue("database");
    await wrapper.find('[aria-label="Sort by"]').setValue("Registry");
    wrapper.findComponent(VBtnToggleStub).vm.$emit("update:modelValue", true);
    await wrapper.setData({ page: 2, itemsPerPage: 10 });
    expect(wrapper.findComponent(VDataIteratorStub).props()).toMatchObject({
      search: "database",
      sortBy: [{ key: "registry", order: "desc" }],
      page: 2,
      itemsPerPage: 10,
    });
    const footers = wrapper.findAllComponents(VDataTableFooterStub);
    expect(footers).toHaveLength(2);
    footers[0].vm.$emit("update:options", { page: 2 });
    footers[1].vm.$emit("update:options", { itemsPerPage: 10 });
    expect(updateOptions.mock.calls).toEqual([
      [{ page: 2 }],
      [{ itemsPerPage: 10 }],
    ]);
  });

  it("hides pagination and displays the empty state when there are no links", async () => {
    await wrapper.setProps({ organisation: { organisationLinks: null } });
    expect(wrapper.text()).toContain("No results found.");
    expect(wrapper.findAllComponents(VDataTableFooterStub)).toHaveLength(0);
    expect(wrapper.findAllComponents({ name: "RecordStatus" })).toHaveLength(0);
  });

  it("displays the error state instead of the result controls", async () => {
    await wrapper.setData({ error: true });
    expect(wrapper.text()).toContain("Sorry, something went wrong!");
    expect(wrapper.findComponent(VDataIteratorStub).exists()).toBe(false);
    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("hides desktop sorting controls on narrow screens", async () => {
    vi.stubGlobal("innerWidth", 500);
    vuetify.display.update();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[aria-label="Sort by"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="sort-toggle"]').exists()).toBe(false);
    expect(wrapper.find('[aria-label="Filter these results"]').exists()).toBe(
      true,
    );
  });

  it("downloads the rendered record list as CSV including abbreviation fallbacks", async () => {
    await wrapper
      .findAll("button")
      .find((b) => b.text() === "Download Record List")
      .trigger("click");
    const blob = URL.createObjectURL.mock.calls[0][0];
    expect(blob.type).toBe("text/csv");
    expect(await blob.text()).toBe(
      "name,abbreviation,URL\nFairsharing DB,FSDB,https://fairsharing.org/1\nSecond DB,n/a,https://fairsharing.org/2\n",
    );
    expect(window.location.href).toBe("blob:http://localhost/mock-blob");
  });
});
