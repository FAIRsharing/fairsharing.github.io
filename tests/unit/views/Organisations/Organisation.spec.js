import { flushPromises, shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "vuex";
import Organisation from "@/views/Organisations/Organisation.vue";
import {
  VAutocompleteStub,
  VBtnStub,
  VDialogStub,
  VFileInputStub,
  VFormStub,
  VOverlayStub,
  VTooltipStub,
} from "../../../stubs/index.js";

const {
  mockDeleteOrganisation,
  mockEditOrganisation,
  mockUpdateSaveSearch,
  mockExecuteQuery,
  mockToBase64,
} = vi.hoisted(() => ({
  mockDeleteOrganisation: vi.fn(),
  mockEditOrganisation: vi.fn(),
  mockUpdateSaveSearch: vi.fn(),
  mockExecuteQuery: vi.fn(),
  mockToBase64: vi.fn(),
}));

const makeOrganisation = () => ({
  id: 1,
  name: "Test Org",
  homepage: "https://test.org",
  rorLink: "https://ror.org/test",
  urlForLogo: "/media/logo.png",
  alternativeNames: ["Alt1", "Alt2"],
  types: ["Institute"],
  users: [
    {
      id: 1,
      username: "testuser",
      orcid: "0000-0000-0000-0000",
    },
  ],
  parentOrganisations: [],
  childOrganisations: [],
  countries: [{ id: 1, name: "France" }],
  savedSearches: [],
});

vi.mock("@/lib/GraphClient/GraphClient.js", () => ({
  default: vi.fn(function () {
    return {
      executeQuery: mockExecuteQuery,
    };
  }),
}));

vi.mock("@/lib/Client/RESTClient.js", () => ({
  default: vi.fn(function () {
    return {
      editOrganisation: mockEditOrganisation,
      deleteOrganisation: mockDeleteOrganisation,
      updateSaveSearch: mockUpdateSaveSearch,
    };
  }),
}));

vi.mock("@/utils/generalUtils", () => ({
  toBase64: mockToBase64,
}));

vi.mock("vuetify/framework", () => ({
  useTheme: () => ({
    computedThemes: {
      value: {
        fairSharingTheme: {
          colors: {
            bg_organisation_record_card: "#ffffff",
          },
        },
      },
    },
  }),
}));

vi.mock("@/lib/GraphClient/queries/Organisations/getOrganisation.json", () => ({
  default: {
    queryParam: {
      id: null,
    },
  },
}));

vi.stubEnv("VITE_API_ENDPOINT", "https://api.mock.com");
vi.stubEnv("VITE_HOSTNAME", "https://mock.com/");

// ============================================================
// TEST SUITE
// ============================================================

describe("Organisation.vue", () => {
  let wrapper;
  let store;
  let mockGetOrgTypes;
  let mockGetCountries;

  const mockRoute = {
    params: {
      id: "1",
    },
  };

  const mockRouter = {
    push: vi.fn(),
  };

  const createVuexStore = () => {
    mockGetOrgTypes = vi.fn();
    mockGetCountries = vi.fn();

    return createStore({
      modules: {
        users: {
          namespaced: true,

          state: () => ({
            user: () => ({
              is_curator: true,
              is_super_curator: false,
              credentials: {
                token: "mock-token",
              },
            }),
          }),
        },

        editor: {
          namespaced: true,

          state: () => ({
            organisationsTypes: [
              {
                id: 1,
                name: "Institute",
              },
            ],

            countries: [
              {
                id: 1,
                name: "France",
              },
            ],

            tooltips: {
              countries: "Select a country",
            },
          }),

          actions: {
            getOrganisationsTypes: mockGetOrgTypes,
            getCountries: mockGetCountries,
          },
        },

        saveSearch: {
          namespaced: true,

          mutations: {
            setSaveSearchResult: vi.fn(),
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

        stubs: {
          SectionTitle: true,
          SearchOrganisationRecords: true,
          NotFound: true,
          Loaders: true,
          CountryFlag: true,

          VOverlay: VOverlayStub,
          VDialog: VDialogStub,
          VBtn: VBtnStub,
          VTooltip: VTooltipStub,
          VAutocomplete: VAutocompleteStub,
          VForm: VFormStub,
          VFileInput: VFileInputStub,
        },
      },
    });

    await flushPromises();

    expect(wrapper.vm).not.toBeNull();

    return wrapper;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.params.id = "1";
    mockExecuteQuery.mockResolvedValue({
      organisation: makeOrganisation(),
    });
    mockDeleteOrganisation.mockResolvedValue({
      error: false,
    });
    mockEditOrganisation.mockResolvedValue({
      error: false,
    });
    mockUpdateSaveSearch.mockResolvedValue({
      error: false,
    });
    mockToBase64.mockResolvedValue("data:image/png;base64,mock...");
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = undefined;
    }

    vi.restoreAllMocks();
  });

  // ==========================================================
  // RENDERING AND LIFECYCLE
  // ==========================================================

  it("can be mounted", async () => {
    await mountComponent();
    expect(wrapper.vm.$options.name).toBe("Organisation");
    expect(wrapper.vm.rules.isRequired()).toBeDefined();
    expect(wrapper.vm.rules.isURL()).toBeDefined();
    expect(wrapper.vm.rules.isImage()).toBeDefined();
  });

  it("fetches organisation data on mount", async () => {
    await mountComponent();
    expect(mockExecuteQuery).toHaveBeenCalled();
    expect(mockGetOrgTypes).toHaveBeenCalled();
    expect(mockGetCountries).toHaveBeenCalled();
    expect(wrapper.vm.organisation.name).toBe("Test Org");
    expect(wrapper.vm.error).toBe(false);
    expect(wrapper.vm.loading).toBe(false);
  });

  it("handles an organisation fetch error", async () => {
    await mountComponent();
    await wrapper.setData({
      testEnvironment: true,
    });
    await wrapper.vm.getOrganisation();
    expect(wrapper.vm.errors).toBe("an error occurred while fetching data");
    expect(wrapper.vm.loading).toBe(false);
  });

  it("handles an organisation response containing null", async () => {
    await mountComponent();
    mockExecuteQuery.mockResolvedValueOnce({
      organisation: null,
    });
    await wrapper.vm.getOrganisation();
    expect(wrapper.vm.loading).toBe(false);
  });

  // ==========================================================
  // COMPUTED PROPERTIES
  // ==========================================================

  it("computes logoUrl correctly", async () => {
    await mountComponent();
    expect(wrapper.vm.logoUrl).toBe("https://api.mock.com/media/logo.png");
  });

  it("returns null when organisation has no logo", async () => {
    await mountComponent();

    await wrapper.setData({
      organisation: {
        ...wrapper.vm.organisation,
        urlForLogo: null,
      },
    });

    expect(wrapper.vm.logoUrl).toBeNull();
  });

  it("computes currentRoute correctly", async () => {
    await mountComponent();

    expect(wrapper.vm.currentRoute).toBe("1");
  });

  it("reloads organisation when currentRoute watcher runs", async () => {
    await mountComponent();

    mockExecuteQuery.mockClear();

    await wrapper.vm.$options.watch.currentRoute.call(wrapper.vm);

    expect(mockExecuteQuery).toHaveBeenCalled();
  });

  // ==========================================================
  // FORMATTING METHODS
  // ==========================================================

  it("formats users with and without ORCID", async () => {
    await mountComponent();
    expect(
      wrapper.vm.formatUser({
        username: "testuser",
        orcid: "1234",
      }),
    ).toBe("testuser (1234)");
    expect(
      wrapper.vm.formatUser({
        username: "testuser2",
      }),
    ).toBe("testuser2");
  });

  it("formats alternative names", async () => {
    await mountComponent();

    expect(
      wrapper.vm.getAltNames({
        alternativeNames: ["One", "Two"],
      }),
    ).toBe("One, Two");

    expect(wrapper.vm.getAltNames({})).toBeNull();

    expect(
      wrapper.vm.getAltNames({
        alternativeNames: [],
      }),
    ).toBeNull();
  });

  it("returns correct user and organisation URLs", async () => {
    await mountComponent();

    expect(wrapper.vm.getUserLink()).toBe("https://mock.com/users/");

    expect(wrapper.vm.orgUrl()).toBe("https://mock.com/organisations/");
  });

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  it("navigates to record edit page", async () => {
    await mountComponent();

    wrapper.vm.goToEdit(1);

    expect(mockRouter.push).toHaveBeenCalledWith({
      path: "/1/edit",
    });
  });

  it("previews a record", async () => {
    await mountComponent();

    wrapper.vm.previewRecord(123);

    expect(wrapper.vm.targetID).toBe(123);
    expect(wrapper.vm.showOverlay).toBe(true);
  });

  it("hides record preview overlay", async () => {
    await mountComponent();

    wrapper.vm.previewRecord(123);

    wrapper.vm.hideOverlay();

    expect(wrapper.vm.targetID).toBeNull();
    expect(wrapper.vm.showOverlay).toBe(false);
  });

  it("opens record in a new tab", async () => {
    await mountComponent();

    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);

    wrapper.vm.goToRecord(456);

    expect(openSpy).toHaveBeenCalledWith("/456", "_blank");
  });

  it("navigates to filtered organisation records", async () => {
    await mountComponent();

    await wrapper.setData({
      organisation: {
        ...wrapper.vm.organisation,
        name: "Test Org & Co.",
      },
    });

    wrapper.vm.filterRecords();

    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "search",
      query: {
        organisations: "test%20org%20%26%20co.",
      },
    });
  });

  // ==========================================================
  // EDITING
  // ==========================================================

  it("opens organisation edit dialog", async () => {
    await mountComponent();

    await wrapper.vm.startEditing();

    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.showEditDialog).toBe(true);

    expect(wrapper.vm.editedOrganisation.types).toEqual([
      {
        id: 1,
        name: "Institute",
      },
    ]);
  });

  it("removes an organisation type", async () => {
    await mountComponent();

    await wrapper.setData({
      editedOrganisation: {
        ...wrapper.vm.editedOrganisation,
        types: [
          { id: 1, label: "Institute" },
          { id: 2, label: "University" },
          { id: 3, label: "Company" },
        ],
      },
    });

    wrapper.vm.removeType({
      id: 2,
      name: "University",
    });

    expect(wrapper.vm.editedOrganisation.types).toEqual([
      { id: 1, label: "Institute" },
      { id: 3, label: "Company" },
    ]);
  });

  it("removes a country", async () => {
    await mountComponent();

    await wrapper.setData({
      editedOrganisation: {
        ...wrapper.vm.editedOrganisation,
        countries: [
          { id: 1, label: "France" },
          { id: 2, label: "Germany" },
          { id: 3, label: "Spain" },
        ],
      },
    });

    wrapper.vm.removeCountry({
      id: 2,
      name: "Germany",
    });

    expect(wrapper.vm.editedOrganisation.countries).toEqual([
      { id: 1, label: "France" },
      { id: 3, label: "Spain" },
    ]);
  });

  describe("editOrganisation()", () => {
    it("formats form data and saves successfully", async () => {
      await mountComponent();

      await wrapper.setData({
        showEditDialog: true,

        organisation: {
          ...wrapper.vm.organisation,
          id: 99,
        },

        editedOrganisation: {
          name: "Updated Name",
          homepage: "http://updated.org",
          rorLink: "http://ror.org/updated",

          types: [
            { id: 1, name: "Institute" },
            { id: 2, name: "Lab" },
          ],

          countries: [{ id: 10, name: "France" }],

          alternativeNames: "  Alt 1, Alt 2  ",

          logo: {
            name: "logo.png",
            type: "image/png",
            size: 1000,
          },
        },
      });

      await wrapper.vm.editOrganisation();

      expect(mockEditOrganisation).toHaveBeenCalledWith(
        {
          name: "Updated Name",
          homepage: "http://updated.org",
          organisation_type_ids: [1, 2],
          country_ids: [10],
          ror_link: "http://ror.org/updated",
          alternative_names: ["Alt 1", "Alt 2"],

          logo: {
            filename: "logo.png",
            content_type: "image/png",
            data: "data:image/png;base64,mock...",
          },
        },
        99,
        "mock-token",
      );

      expect(wrapper.vm.showEditDialog).toBe(false);
      expect(wrapper.vm.logoLoading).toBe(false);
    });

    it("handles missing alternative names and logo", async () => {
      await mountComponent();

      await wrapper.setData({
        organisation: {
          ...wrapper.vm.organisation,
          id: 99,
        },

        editedOrganisation: {
          name: "Simple Org",
          homepage: "https://simple.org",
          types: [],
          countries: [],
          alternativeNames: null,
          logo: null,
        },
      });

      await wrapper.vm.editOrganisation();

      expect(mockEditOrganisation).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Simple Org",
          alternative_names: [],
          country_ids: [],
        }),
        99,
        "mock-token",
      );

      const payload = mockEditOrganisation.mock.calls[0][0];

      expect(payload.logo).toBeUndefined();
    });

    it("handles null countries", async () => {
      await mountComponent();

      await wrapper.setData({
        editedOrganisation: {
          ...wrapper.vm.editedOrganisation,
          types: [],
          countries: null,
          alternativeNames: "",
          logo: null,
        },
      });

      await wrapper.vm.editOrganisation();

      expect(mockEditOrganisation).toHaveBeenCalledWith(
        expect.objectContaining({
          country_ids: [],
        }),
        1,
        "mock-token",
      );
    });

    it("keeps edit dialog open when API returns an error", async () => {
      await mountComponent();

      mockEditOrganisation.mockResolvedValueOnce({
        error: true,
      });

      await wrapper.setData({
        showEditDialog: true,

        editedOrganisation: {
          ...wrapper.vm.editedOrganisation,
          types: [],
          countries: [],
          alternativeNames: "",
          logo: null,
        },
      });

      await wrapper.vm.editOrganisation();

      expect(wrapper.vm.showEditDialog).toBe(true);
      expect(wrapper.vm.logoLoading).toBe(false);
    });
  });

  // ==========================================================
  // IMAGE VALIDATION
  // ==========================================================

  describe("imageSizeCorrect()", () => {
    it("accepts missing logo", async () => {
      await mountComponent();

      wrapper.vm.editedOrganisation.logo = null;
      wrapper.vm.imageTooBig = true;

      expect(wrapper.vm.imageSizeCorrect()).toBe(true);
      expect(wrapper.vm.imageTooBig).toBe(false);
    });

    it("accepts logo below size limit", async () => {
      await mountComponent();

      wrapper.vm.editedOrganisation.logo = {
        size: 1000000,
      };

      wrapper.vm.imageTooBig = true;

      expect(wrapper.vm.imageSizeCorrect()).toBe(true);
      expect(wrapper.vm.imageTooBig).toBe(false);
    });

    it("rejects oversized logo", async () => {
      await mountComponent();

      wrapper.vm.editedOrganisation.logo = {
        size: 4000000,
      };

      wrapper.vm.imageTooBig = false;

      expect(wrapper.vm.imageSizeCorrect()).toBe(
        "Image is too large (max 3MB).",
      );

      expect(wrapper.vm.imageTooBig).toBe(true);

      expect(wrapper.emitted("imageTooBig")).toEqual([[true]]);
    });
  });

  // ==========================================================
  // DELETE ORGANISATION
  // ==========================================================

  it("opens delete confirmation dialog", async () => {
    await mountComponent();

    wrapper.vm.confirmDeleteOrganisation();

    expect(wrapper.vm.confirmDelete).toBe(true);
    expect(wrapper.vm.deleteOrganisationCard).toBe(true);
    expect(wrapper.vm.unlinkSavedSearchCard).toBe(false);
  });

  it("cancels organisation deletion", async () => {
    await mountComponent();

    wrapper.vm.confirmDeleteOrganisation();

    await wrapper.vm.deleteOrganisation(false);

    expect(mockDeleteOrganisation).not.toHaveBeenCalled();

    expect(wrapper.vm.confirmDelete).toBe(false);
    expect(wrapper.vm.deleteOrganisationCard).toBe(false);
  });

  it("calls delete API when deletion is confirmed", async () => {
    await mountComponent();

    // Prevent JSDOM navigation by exercising the API-error path.
    mockDeleteOrganisation.mockResolvedValueOnce({
      error: true,
    });

    wrapper.vm.confirmDeleteOrganisation();

    await wrapper.vm.deleteOrganisation(true);

    expect(mockDeleteOrganisation).toHaveBeenCalledWith(1, "mock-token");

    expect(wrapper.vm.confirmDelete).toBe(false);
    expect(wrapper.vm.deleteOrganisationCard).toBe(false);
  });

  // ==========================================================
  // SAVED SEARCHES
  // ==========================================================

  it("opens unlink saved search confirmation", async () => {
    await mountComponent();

    const item = {
      id: 20,
      organisations: [{ id: 1 }],
    };

    wrapper.vm.confirmUnlinkSavedSearch(item);

    expect(wrapper.vm.selectedItem).toEqual(item);
    expect(wrapper.vm.confirmDelete).toBe(true);
    expect(wrapper.vm.deleteOrganisationCard).toBe(false);
    expect(wrapper.vm.unlinkSavedSearchCard).toBe(true);
  });

  it("cancels unlinking a saved search", async () => {
    await mountComponent();

    wrapper.vm.confirmUnlinkSavedSearch({
      id: 20,
      organisations: [{ id: 1 }],
    });

    await wrapper.vm.unlinkSavedSearch(false);

    expect(mockUpdateSaveSearch).not.toHaveBeenCalled();

    expect(wrapper.vm.confirmDelete).toBe(false);
    expect(wrapper.vm.unlinkSavedSearchCard).toBe(false);
    expect(wrapper.vm.deleteLoader).toBe(false);
  });

  it("unlinks a saved search successfully", async () => {
    await mountComponent();

    const commitSpy = vi.spyOn(store, "commit");

    wrapper.vm.confirmUnlinkSavedSearch({
      id: 20,

      organisations: [{ id: 1 }, { id: 2 }],
    });

    await wrapper.vm.unlinkSavedSearch(true);

    expect(mockUpdateSaveSearch).toHaveBeenCalledWith(
      20,
      {
        organisation_ids: [2],
      },
      "mock-token",
    );

    expect(commitSpy).toHaveBeenCalledWith(
      "saveSearch/setSaveSearchResult",
      expect.objectContaining({
        error: false,
      }),
    );

    expect(wrapper.vm.deleteLoader).toBe(false);
    expect(wrapper.vm.confirmDelete).toBe(false);
    expect(wrapper.vm.unlinkSavedSearchCard).toBe(false);
  });

  // ==========================================================
  // TEMPLATE RENDERING
  // ==========================================================

  it("renders organisation information", async () => {
    await mountComponent();

    expect(wrapper.text()).toContain("Test Org");
    expect(wrapper.text()).toContain("Homepage");
    expect(wrapper.text()).toContain("Types");
    expect(wrapper.text()).toContain("France");
  });

  it("renders parent and child organisations", async () => {
    await mountComponent();

    await wrapper.setData({
      organisation: {
        ...wrapper.vm.organisation,

        parentOrganisations: [
          {
            id: 2,
            name: "Parent Org",
          },
        ],

        childOrganisations: [
          {
            id: 3,
            name: "Child Org",
          },
        ],
      },
    });

    expect(wrapper.text()).toContain("Parent Org");
    expect(wrapper.text()).toContain("Child Org");
  });

  it("renders saved searches", async () => {
    await mountComponent();

    await wrapper.setData({
      organisation: {
        ...wrapper.vm.organisation,

        savedSearches: [
          {
            id: 20,
            name: "Saved Search",
            url: "/search?q=test",
          },
        ],
      },
    });

    expect(wrapper.text()).toContain("Saved Search");
  });

  it("renders NotFound when organisation is unavailable", async () => {
    await mountComponent();

    await wrapper.setData({
      error: true,
      loading: false,
    });

    expect(wrapper.findComponent({ name: "NotFound" }).exists()).toBe(true);
  });

  // ==========================================================
  // TEMPLATE EVENT HANDLERS
  // ==========================================================

  it("opens edit dialog when Edit Organisation is clicked", async () => {
    await mountComponent();
    const editButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Edit Organisation"));
    expect(editButton).toBeDefined();
    await editButton.trigger("click");
    expect(wrapper.vm.showEditDialog).toBe(true);
  });

  it("opens delete dialog when Delete Organisation is clicked", async () => {
    await mountComponent();
    const deleteButton = wrapper
      .findAll("button")
      .find((button) => button.text().includes("Delete Organisation"));
    expect(deleteButton).toBeDefined();
    await deleteButton.trigger("click");
    expect(wrapper.vm.confirmDelete).toBe(true);
    expect(wrapper.vm.deleteOrganisationCard).toBe(true);
  });

  it("closes edit dialog when Cancel is clicked", async () => {
    await mountComponent();
    await wrapper.setData({
      showEditDialog: true,
    });
    const dialog = wrapper.findAllComponents({
      name: "VDialog",
    })[0];
    const cancelButton = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "Cancel");
    expect(cancelButton).toBeDefined();
    await cancelButton.trigger("click");
    expect(wrapper.vm.showEditDialog).toBe(false);
  });

  it("updates edit dialog v-model", async () => {
    await mountComponent();
    const dialog = wrapper.findAllComponents({
      name: "VDialog",
    })[0];
    expect(dialog.exists()).toBe(true);
    dialog.vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showEditDialog).toBe(true);
    dialog.vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.showEditDialog).toBe(false);
  });

  it("updates loading overlay v-model", async () => {
    await mountComponent();
    const overlay = wrapper.findComponent({
      name: "VOverlay",
    });
    expect(overlay.exists()).toBe(true);
    overlay.vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.loading).toBe(true);
    overlay.vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.loading).toBe(false);
  });

  it("updates edit form fields through v-model events", async () => {
    await mountComponent();
    await wrapper.setData({
      showEditDialog: true,
    });
    const fields = wrapper.findAllComponents({
      name: "VTextField",
    });
    expect(fields.length).toBeGreaterThanOrEqual(4);
    const values = [
      ["name", "Updated Organisation"],
      ["homepage", "https://updated.example.org"],
      ["rorLink", "https://ror.org/123"],
      ["alternativeNames", "Alternative One, Alternative Two"],
    ];
    for (const [index, [property, value]] of values.entries()) {
      fields[index].vm.$emit("update:modelValue", value);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.editedOrganisation[property]).toBe(value);
    }
  });

  it("updates organisation types and countries through autocomplete", async () => {
    await mountComponent();
    await wrapper.setData({
      showEditDialog: true,
    });
    const autocompletes = wrapper.findAllComponents({
      name: "VAutocomplete",
    });
    expect(autocompletes.length).toBeGreaterThanOrEqual(2);
    const types = [
      {
        id: 2,
        name: "University",
      },
    ];
    const countries = [
      {
        id: 3,
        name: "Germany",
      },
    ];
    autocompletes[0].vm.$emit("update:modelValue", types);
    autocompletes[1].vm.$emit("update:modelValue", countries);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.editedOrganisation.types).toEqual(types);
    expect(wrapper.vm.editedOrganisation.countries).toEqual(countries);
  });

  it("updates edit form validity through v-model", async () => {
    await mountComponent();
    await wrapper.setData({
      showEditDialog: true,
    });
    const form = wrapper.findComponent({
      name: "VForm",
    });
    expect(form.exists()).toBe(true);
    form.vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.editFormValid).toBe(true);
    form.vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.editFormValid).toBe(false);
  });

  it("updates delete confirmation through dialog v-model", async () => {
    await mountComponent();
    const dialogs = wrapper.findAllComponents({
      name: "VDialog",
    });
    expect(dialogs.length).toBeGreaterThanOrEqual(2);
    const deleteDialog = dialogs[1];
    deleteDialog.vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.confirmDelete).toBe(true);
    deleteDialog.vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.confirmDelete).toBe(false);
  });

  it("opens unlink confirmation when saved-search icon is clicked", async () => {
    await mountComponent();
    const search = {
      id: 20,
      name: "Saved Search",
      url: "/search?q=test",
      organisations: [
        {
          id: 1,
        },
      ],
    };
    store.state.users.user = () => ({
      is_curator: true,
      is_super_curator: true,
      credentials: {
        token: "mock-token",
      },
    });
    await wrapper.setData({
      organisation: {
        ...wrapper.vm.organisation,
        savedSearches: [search],
      },
    });
    await wrapper.vm.$nextTick();
    const unlinkIcon = wrapper
      .findAllComponents({
        name: "VIcon",
      })
      .find((icon) => icon.text().includes("fa-unlink"));
    expect(unlinkIcon).toBeDefined();
    await unlinkIcon.trigger("click");
    expect(wrapper.vm.selectedItem).toEqual(search);
    expect(wrapper.vm.confirmDelete).toBe(true);
    expect(wrapper.vm.unlinkSavedSearchCard).toBe(true);
  });

  it("updates the logo via the file input model event", async () => {
    await mountComponent();
    await wrapper.setData({
      showEditDialog: true,
    });
    const logoInput = wrapper.findComponent({
      name: "VFileInput",
    });
    expect(logoInput.exists()).toBe(true);
    const logo = new File(["image"], "logo.png", {
      type: "image/png",
    });
    logoInput.vm.$emit("update:modelValue", logo);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.editedOrganisation.logo).toEqual(logo);
  });

  it("saves organisation edits from the rendered Save button", async () => {
    await mountComponent();
    await wrapper.setData({
      showEditDialog: true,
      editFormValid: true,
      imageTooBig: false,
    });
    const saveButton = wrapper
      .findAll("button")
      .find((button) => button.text().trim() === "Save");
    expect(saveButton).toBeDefined();
    await saveButton.trigger("click");
    await flushPromises();
    expect(mockEditOrganisation).toHaveBeenCalled();
  });

  it("cancels organisation deletion through the dialog button", async () => {
    await mountComponent();
    wrapper.vm.confirmDeleteOrganisation();
    await wrapper.vm.$nextTick();
    const dialog = wrapper.findAllComponents({ name: "VDialog" })[1];
    const cancel = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "Cancel");
    expect(cancel).toBeDefined();
    await cancel.trigger("click");
    expect(mockDeleteOrganisation).not.toHaveBeenCalled();
    expect(wrapper.vm.confirmDelete).toBe(false);
  });

  it("deletes an organisation through the dialog Delete button", async () => {
    await mountComponent();
    mockDeleteOrganisation.mockResolvedValueOnce({ error: true });
    wrapper.vm.confirmDeleteOrganisation();
    await wrapper.vm.$nextTick();
    const dialog = wrapper.findAllComponents({ name: "VDialog" })[1];
    const deleteButton = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "Delete");
    expect(deleteButton).toBeDefined();
    await deleteButton.trigger("click");
    await flushPromises();
    expect(mockDeleteOrganisation).toHaveBeenCalledWith(1, "mock-token");
    expect(wrapper.vm.confirmDelete).toBe(false);
  });

  it("cancels saved-search unlinking through the dialog button", async () => {
    await mountComponent();
    wrapper.vm.confirmUnlinkSavedSearch({
      id: 20,
      organisations: [{ id: 1 }],
    });
    await wrapper.vm.$nextTick();
    const dialog = wrapper.findAllComponents({ name: "VDialog" })[1];
    const cancel = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "Cancel");
    expect(cancel).toBeDefined();
    await cancel.trigger("click");
    expect(mockUpdateSaveSearch).not.toHaveBeenCalled();
    expect(wrapper.vm.confirmDelete).toBe(false);
  });

  it("unlinks a saved search through the dialog OK button", async () => {
    await mountComponent();
    wrapper.vm.confirmUnlinkSavedSearch({
      id: 20,
      organisations: [{ id: 1 }, { id: 2 }],
    });
    await wrapper.vm.$nextTick();
    const dialog = wrapper.findAllComponents({ name: "VDialog" })[1];
    const okButton = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "OK");
    expect(okButton).toBeDefined();
    await okButton.trigger("click");
    await flushPromises();
    expect(mockUpdateSaveSearch).toHaveBeenCalledWith(
      20,
      { organisation_ids: [2] },
      "mock-token",
    );
    expect(wrapper.vm.confirmDelete).toBe(false);
  });

  it("renders the selected organisation type chip", async () => {
    await mountComponent();
    await wrapper.vm.startEditing();
    await wrapper.vm.$nextTick();
    const autocompletes = wrapper.findAllComponents({
      name: "VAutocomplete",
    });
    expect(autocompletes.length).toBeGreaterThanOrEqual(2);
    const typeAutocomplete = autocompletes[0];
    const typeChip = typeAutocomplete.findComponent({ name: "VChip" });
    expect(typeChip.props("text")).toBe("Institute");
  });

  it("removes a country when its chip close event is emitted", async () => {
    await mountComponent();
    await wrapper.setData({
      showEditDialog: true,
      editedOrganisation: {
        ...wrapper.vm.editedOrganisation,
        countries: [
          { id: 1, name: "France" },
          { id: 2, name: "Germany" },
        ],
      },
    });
    const chips = wrapper.findAllComponents({
      name: "VChip",
    });
    const countryChip = chips.find((chip) => chip.text().includes("Germany"));
    expect(countryChip).toBeDefined();
    countryChip.vm.$emit("click:close");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.editedOrganisation.countries).toEqual([
      { id: 1, name: "France" },
    ]);
  });
});
