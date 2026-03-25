import { afterEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";

// 1. Mock Direct Store Import
import saveSearch from "@/store";
import SaveSearchStepper from "@/components/Records/Search/SaveSearch/SaveSearchStepper.vue";

// 3. Mock the RESTClient Class
const { mockSaveSearchAPI } = vi.hoisted(() => ({
  mockSaveSearchAPI: vi.fn(),
}));
vi.mock("@/lib/Client/RESTClient", () => {
  return {
    default: vi.fn(() => ({
      saveSearch: mockSaveSearchAPI,
    })),
  };
});

vi.mock("@/store", () => ({
  default: {
    commit: vi.fn(),
  },
}));

// 2. Mock Utils
vi.mock("@/utils/rules.js", () => ({
  isRequired: vi.fn(() => true),
}));

describe("SaveSearchStepper.vue", () => {
  let actions;
  let saveSearchGetters;
  let advancedSearchGetters;

  const createWrapper = (
    isSuperCurator = false,
    showStepper = true,
    customGetters = {},
  ) => {
    actions = { getUser: vi.fn() };

    saveSearchGetters = {
      getSaveSearchStepperDialog: () => true,
      getOrganisationSelected: () => [101],
      getPolicySelected: () => [202],
      getUserSelected: () => [303],
      getShowStepper: () => showStepper,
      ...customGetters,
    };

    advancedSearchGetters = {
      getAdvancedSearchQuery: () => ({ query: "test" }),
    };

    const store = createStore({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({
              id: 1,
              is_super_curator: isSuperCurator,
              credentials: { token: "fake-token" },
            }),
          },
          actions,
        },
        saveSearch: {
          namespaced: true,
          getters: saveSearchGetters,
        },
        advancedSearch: {
          namespaced: true,
          getters: advancedSearchGetters,
        },
      },
    });

    return shallowMount(SaveSearchStepper, {
      global: {
        plugins: [store],
        mocks: {
          $route: { fullPath: "/advanced-search" },
          $vuetify: { display: { smAndDown: false } },
        },
        stubs: {
          "v-dialog": true,
          "v-stepper": true,
          "v-stepper-header": true,
          "v-stepper-item": true,
          "v-divider": true,
          "v-window": true,
          "v-window-item": true,
          "v-form": true,
          "v-text-field": true,
          "v-btn": true,
          StepperDialogHeader: true,
          PolicyStepper: true,
          OrganisationStepper: true,
          UserStepper: true,
          ResultCard: true,
        },
      },
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Watchers: getSaveSearchStepperDialog", () => {
    it("calls getUser and updates super curator status when dialog opens", async () => {
      const wrapper = createWrapper(true); // User is super curator
      await wrapper.vm.$options.watch.getSaveSearchStepperDialog.call(
        wrapper.vm,
        true,
      );
      expect(wrapper.vm.stepperDialog).toBe(true);
      expect(actions.getUser).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.isSuperCurator).toBe(true);
    });
  });

  it("updates data and fetches user when dialog opens (Regular User)", async () => {
    const wrapper = createWrapper(false); // User is NOT super curator

    await wrapper.vm.$options.watch.getSaveSearchStepperDialog.call(
      wrapper.vm,
      true,
    );
    expect(wrapper.vm.stepperDialog).toBe(true);
    expect(actions.getUser).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.isSuperCurator).toBe(false);
  });

  describe("Methods: closeStepperDialog & restartStepper", () => {
    it("closeStepperDialog commits to the direct store", () => {
      const wrapper = createWrapper();
      wrapper.vm.closeStepperDialog();
      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchStepperDialog",
        false,
      );
    });

    it("restartStepper updates the 'steps' data property", () => {
      const wrapper = createWrapper();
      wrapper.vm.steps = 3;
      wrapper.vm.restartStepper(1);
      expect(wrapper.vm.steps).toBe(1);
    });
  });

  describe("Methods: saveSearch (API & Workflow)", () => {
    it("calls RESTClient and handles a SUCCESSFUL save search", async () => {
      const wrapper = createWrapper(false);
      const mockSuccessResponse = { id: 999, status: "success" };
      mockSaveSearchAPI.mockResolvedValueOnce(mockSuccessResponse);
      wrapper.vm.searchName = "My Search";
      wrapper.vm.searchComment = "Test Comment";
      await wrapper.vm.saveSearch();

      expect(mockSaveSearchAPI).toHaveBeenCalledTimes(1);
      expect(mockSaveSearchAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "My Search",
          comments: "Test Comment",
          url: expect.stringContaining("/advanced-search"),
          fairsharing_record_ids: [202],
          organisation_ids: [101],
          user_ids: [303], // Uses selected users if available
          params: { query: "test" },
        }),
        "fake-token",
      );

      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setShowStepper",
        false,
      );
      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchStatus",
        true,
      ); // True because no error
      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchResult",
        mockSuccessResponse,
      );
      // 3. Verify Form Reset
      expect(wrapper.vm.searchName).toBe("");
      expect(wrapper.vm.searchComment).toBe("");
      expect(wrapper.vm.loading).toBe(false);
    });

    it("handles an ERROR from the save search API", async () => {
      const wrapper = createWrapper(false);
      const mockErrorResponse = { error: "Something went wrong" };
      mockSaveSearchAPI.mockResolvedValueOnce(mockErrorResponse);
      await wrapper.vm.saveSearch();
      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setShowStepper",
        false,
      );
      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchStatus",
        false,
      ); // False because of error
      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchResult",
        mockErrorResponse,
      );
    });

    it("falls back to user().id if getUserSelected array is empty", async () => {
      const wrapper = createWrapper(false, true, { getUserSelected: () => [] });
      mockSaveSearchAPI.mockResolvedValueOnce({ status: "success" });
      await wrapper.vm.saveSearch();
      expect(mockSaveSearchAPI).toHaveBeenCalledWith(
        expect.objectContaining({
          user_ids: [1],
        }),
        "fake-token",
      );
    });
  });
});
