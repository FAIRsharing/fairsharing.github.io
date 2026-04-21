import { shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { createStore } from "vuex";
import AdvancedSearchRecordsView from "@/views/AdvancedSearch/AdvancedSearchRecordsView.vue";

vi.mock("@/utils/onScrollUtil", () => ({
  default: {
    methods: {
      onScroll: vi.fn(),
    },
  },
}));

describe("AdvancedSearchRecordsView.vue", () => {
  let wrapper;
  let store;
  let vuetify;
  let dispatchSpy;

  const mockActions = {
    setStickToTop: vi.fn(),
    setGeneralUIAttributesAction: vi.fn(),
    resetAdvancedSearchResponse: vi.fn(),
    resetUserDefinedTags: vi.fn(),
    resetSubjects: vi.fn(),
    resetRecords: vi.fn(),
    resetOrganisations: vi.fn(),
    resetSearchDomains: vi.fn(),
    resetSearchTaxonomies: vi.fn(),
    resetSearchLicences: vi.fn(),
    resetSearchCountries: vi.fn(),
  };

  const createVuexStore = (stateOverrides = {}, getterOverrides = {}) => {
    const storeObj = createStore({
      modules: {
        uiController: {
          namespaced: true,
          state: { scrollStatus: false, stickToTop: false, ...stateOverrides },
          actions: {
            setStickToTop: mockActions.setStickToTop,
            setGeneralUIAttributesAction:
              mockActions.setGeneralUIAttributesAction,
          },
        },
        advancedSearch: {
          namespaced: true,
          getters: {
            getLoadingStatus: () => getterOverrides.getLoadingStatus || false,
            getAdvancedSearchResponse: () =>
              getterOverrides.getAdvancedSearchResponse || [],
          },
          actions: {
            resetAdvancedSearchResponse:
              mockActions.resetAdvancedSearchResponse,
          },
        },
        userDefinedTagsSearch: {
          namespaced: true,
          actions: { resetUserDefinedTags: mockActions.resetUserDefinedTags },
        },
        subjectSearch: {
          namespaced: true,
          actions: { resetSubjects: mockActions.resetSubjects },
        },
        recordTypes: {
          namespaced: true,
          actions: { resetRecords: mockActions.resetRecords },
        },
        organisationSearch: {
          namespaced: true,
          actions: { resetOrganisations: mockActions.resetOrganisations },
        },
        domainsSearch: {
          namespaced: true,
          actions: { resetSearchDomains: mockActions.resetSearchDomains },
        },
        taxonomiesSearch: {
          namespaced: true,
          actions: { resetSearchTaxonomies: mockActions.resetSearchTaxonomies },
        },
        licencesSearch: {
          namespaced: true,
          actions: { resetSearchLicences: mockActions.resetSearchLicences },
        },
        countriesSearch: {
          namespaced: true,
          actions: { resetSearchCountries: mockActions.resetSearchCountries },
        },
      },
    });
    dispatchSpy = vi.spyOn(storeObj, "dispatch");
    return storeObj;
  };

  const mountComponent = (
    displayOverrides = {},
    stateOverrides = {},
    getterOverrides = {},
  ) => {
    store = createVuexStore(stateOverrides, getterOverrides);
    vuetify = createVuetify();

    // Use shallowMount to avoid rendering the actual children components
    return shallowMount(AdvancedSearchRecordsView, {
      global: {
        plugins: [store, vuetify],
        stubs: [
          "JumpToTop",
          "Loaders",
          "AdvancedSearchDialogBox",
          "SaveSearchStepper",
          "AdvancedSearchButtons",
          "AdvancedSearchResultTable",
          "AdvancedSearchSelection",
        ],
        mocks: {
          $vuetify: {
            display: {
              mdAndDown: false,
              lgAndUp: true,
              ...displayOverrides,
            },
          },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    if (wrapper) wrapper.unmount();
  });

  // --- LIFECYCLE & VUEX TESTS ---

  it("adds scroll event listener on mount", () => {
    wrapper = mountComponent();
    expect(window.addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });

  it("dispatches reset actions and removes listener on unmount", () => {
    wrapper = mountComponent();

    // Trigger the unmounted lifecycle hook
    wrapper.unmount();
    wrapper = null; // Prevent afterEach from unmounting twice

    // Check mapped actions
    expect(mockActions.resetAdvancedSearchResponse).toHaveBeenCalled();
    expect(mockActions.setStickToTop).toHaveBeenCalledWith(
      expect.any(Object),
      false,
    );
    expect(mockActions.resetUserDefinedTags).toHaveBeenCalled();
    expect(mockActions.resetSubjects).toHaveBeenCalled();
    expect(mockActions.resetRecords).toHaveBeenCalled();
    expect(mockActions.resetOrganisations).toHaveBeenCalled();
    expect(mockActions.resetSearchDomains).toHaveBeenCalled();
    expect(mockActions.resetSearchTaxonomies).toHaveBeenCalled();
    expect(mockActions.resetSearchLicences).toHaveBeenCalled();
    expect(mockActions.resetSearchCountries).toHaveBeenCalled();

    // Check direct store dispatch
    expect(dispatchSpy).toHaveBeenCalledWith(
      "uiController/setGeneralUIAttributesAction",
      { drawerVisibilityState: false, headerVisibilityState: true },
    );

    // Check event listener removal
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });
});
