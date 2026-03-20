import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SearchOrganisationRecords from "@/components/Organisations/SearchOrganisationRecords.vue";

describe("SearchOrganisationRecords.vue", () => {
  let wrapper;

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
    global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/mock-blob");

    wrapper = shallowMount(SearchOrganisationRecords, {
      props: {
        organisation: mockOrganisation,
      },
      global: {
        mocks: {
          $route: { query: {} },
          $vuetify: { display: { mdAndUp: true } },
        },
        stubs: {
          "v-container": true,
          "v-data-iterator": true,
        },
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
    // Mock the window.location object so assigning href doesn't throw a navigation error
    delete window.location;
    window.location = { href: "" };

    wrapper.vm.downloadResults();

    // Verify createObjectURL was called
    expect(global.URL.createObjectURL).toHaveBeenCalledOnce();

    // Verify window location was updated with the mock blob URL
    expect(window.location.href).toBe("blob:http://localhost/mock-blob");
  });

  it("computes currentRouteQuery correctly from the $route object", () => {
    const mockQuery = { searchTerm: "cancer", page: "2" };
    const localWrapper = shallowMount(SearchOrganisationRecords, {
      props: {
        organisation: { organisationLinks: [] },
      },
      global: {
        mocks: {
          $route: { query: mockQuery },
          $vuetify: { display: { mdAndUp: true } },
        },
        stubs: {
          "v-container": true,
          "v-data-iterator": true,
        },
      },
    });
    expect(localWrapper.vm.currentRouteQuery).toStrictEqual(mockQuery);
  });
});
