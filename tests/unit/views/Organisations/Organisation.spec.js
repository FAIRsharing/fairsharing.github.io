import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "vuex";
import Organisation from "@/views/Organisations/Organisation.vue";

// --- 1. MOCK EXTERNAL CLIENTS & UTILS ---
const { mockDeleteOrganisation, mockEditOrganisation, mockUpdateSaveSearch } =
  vi.hoisted(() => ({
    mockDeleteOrganisation: vi.fn().mockResolvedValue({ error: false }),
    mockEditOrganisation: vi.fn().mockResolvedValue({ error: false }),
    mockUpdateSaveSearch: vi.fn().mockResolvedValue({ error: false }),
  }));

vi.mock("@/lib/GraphClient/GraphClient.js", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      executeQuery: vi.fn().mockResolvedValue({
        organisation: {
          id: 1,
          name: "Test Org",
          homepage: "https://test.org",
          rorLink: "https://ror.org/test",
          urlForLogo: "/media/logo.png",
          alternativeNames: ["Alt1", "Alt2"],
          types: ["Institute"],
          users: [
            { id: 1, username: "testuser", orcid: "0000-0000-0000-0000" },
          ],
          parentOrganisations: [],
          childOrganisations: [],
          countries: [{ id: 1, name: "France" }],
          savedSearches: [],
        },
      }),
    })),
  };
});

vi.mock("@/lib/Client/RESTClient.js", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      editOrganisation: mockEditOrganisation,
      deleteOrganisation: mockDeleteOrganisation,
      updateSaveSearch: mockUpdateSaveSearch,
    })),
  };
});

vi.mock("@/utils/generalUtils", () => ({
  toBase64: vi.fn().mockResolvedValue("data:image/png;base64,mock..."),
}));

// --- 2. MOCK VUETIFY & STORE IMPORTS ---
vi.mock("vuetify/framework", () => ({
  useTheme: () => ({
    computedThemes: {
      value: {
        fairSharingTheme: {
          colors: { bg_organisation_record_card: "#ffffff" },
        },
      },
    },
  }),
}));

vi.mock("@/store", () => ({
  default: { commit: vi.fn() },
}));

// Mock the JSON query import
vi.mock("@/lib/GraphClient/queries/Organisations/getOrganisation.json", () => ({
  default: { queryParam: { id: null } },
}));

// --- 3. MOCK ENVIRONMENT VARIABLES ---
vi.stubEnv("VITE_API_ENDPOINT", "https://api.mock.com");
vi.stubEnv("VITE_HOSTNAME", "https://mock.com/");

describe("Organisation.vue", () => {
  let wrapper;
  let store;
  let mockGetOrgTypes;
  let mockGetCountries;

  const mockRoute = { params: { id: "1" } };
  const mockRouter = { push: vi.fn() };

  const createVuexStore = () => {
    mockGetOrgTypes = vi.fn();
    mockGetCountries = vi.fn();

    return createStore({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({
              is_curator: true,
              is_super_curator: false,
              credentials: { token: "mock-token" },
            }),
          },
        },
        editor: {
          namespaced: true,
          state: {
            organisationsTypes: [{ id: 1, name: "Institute" }],
            countries: [{ id: 1, name: "France" }],
            tooltips: { countries: "Select a country" },
          },
          actions: {
            getOrganisationsTypes: mockGetOrgTypes,
            getCountries: mockGetCountries,
          },
        },
      },
    });
  };

  const mountComponent = async () => {
    store = createVuexStore();

    wrapper = shallowMount(Organisation, {
      global: {
        plugins: [store],
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
        },
        stubs: [
          "SectionTitle",
          "SearchOrganisationRecords",
          "NotFound",
          "Loaders",
          "CountryFlag",
        ],
      },
    });

    // Wait for the created/mounted async hooks to resolve
    await vi.dynamicImportSettled();
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Safety mock for window.location (used in deleteOrganisation)
    delete window.location;
    window.location = { pathname: "" };
  });

  // --- RENDERING & LIFECYCLE ---

  it("fetches organisation data and dispatches store actions on mount", async () => {
    await mountComponent();

    // Verifies mounted hooks fired
    expect(mockGetOrgTypes).toHaveBeenCalled();
    expect(mockGetCountries).toHaveBeenCalled();

    // Verifies created hook fetched the org and mapped it to the component data
    expect(wrapper.vm.organisation.name).toBe("Test Org");
    expect(wrapper.vm.error).toBe(false);
  });

  // --- COMPUTED PROPERTIES ---

  it("computes logoUrl correctly from env variables", async () => {
    await mountComponent();
    expect(wrapper.vm.logoUrl).toBe("https://api.mock.com/media/logo.png");
  });

  // --- FORMATTING METHODS ---

  it("formats users with and without ORCID correctly", async () => {
    await mountComponent();
    const userWithOrcid = { username: "testuser", orcid: "1234" };
    const userNoOrcid = { username: "testuser2" };

    expect(wrapper.vm.formatUser(userWithOrcid)).toBe("testuser (1234)");
    expect(wrapper.vm.formatUser(userNoOrcid)).toBe("testuser2");
  });

  it("formats alternative names as comma-separated string", async () => {
    await mountComponent();
    const mockOrg = { alternativeNames: ["One", "Two"] };
    expect(wrapper.vm.getAltNames(mockOrg)).toBe("One, Two");

    expect(wrapper.vm.getAltNames({})).toBeNull();
  });

  // --- ACTIONS (DELETE) ---

  it("calls REST client to delete organisation and redirects on success", async () => {
    await mountComponent();

    // Call the method passing 'true' to confirm deletion
    await wrapper.vm.deleteOrganisation(true);

    // Verify the shared spy was called with org ID and user token
    expect(mockDeleteOrganisation).toHaveBeenCalledWith(1, "mock-token");

    // Verify window.location was updated to redirect the user
    expect(window.location.pathname).toBe("/organisations");
  });

  it("can check confirmDeleteOrganisation method", async () => {
    await mountComponent();
    wrapper.vm.confirmDeleteOrganisation();

    expect(wrapper.vm.confirmDelete).toBe(true);
    expect(wrapper.vm.deleteOrganisationCard).toBe(true);
    expect(wrapper.vm.unlinkSavedSearchCard).toBe(false);
  });

  it("can check confirmUnlinkSavedSearch method", async () => {
    await mountComponent();
    wrapper.vm.confirmUnlinkSavedSearch("test");

    expect(wrapper.vm.selectedItem).toBe("test");
    expect(wrapper.vm.confirmDelete).toBe(true);
    expect(wrapper.vm.deleteOrganisationCard).toBe(false);
    expect(wrapper.vm.unlinkSavedSearchCard).toBe(true);
  });

  it("can check getUserLink method", async () => {
    await mountComponent();
    wrapper.vm.getUserLink();
    let output = import.meta.env.VITE_HOSTNAME + "users/";
    expect(wrapper.vm.getUserLink()).toBe(output);
  });

  it("can check orgUrl method", async () => {
    await mountComponent();
    wrapper.vm.orgUrl();
    let output = import.meta.env.VITE_HOSTNAME + "organisations/";
    expect(wrapper.vm.orgUrl()).toBe(output);
  });
});
