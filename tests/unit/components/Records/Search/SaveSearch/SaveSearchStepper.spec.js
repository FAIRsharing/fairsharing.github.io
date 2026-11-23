import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";

import SaveSearchStepper from "@/components/Records/Search/SaveSearch/SaveSearchStepper.vue";

import {
  VBtnStub,
  VFormStub,
  VSlotStub,
  VTextFieldStub,
} from "../../../../../stubs/index.js";

// 1. Mock the RESTClient Class
const { mockSaveSearchAPI } = vi.hoisted(() => ({
  mockSaveSearchAPI: vi.fn(),
}));

vi.mock("@/lib/Client/RESTClient", () => {
  return {
    default: vi.fn(function () {
      return {
        saveSearch: mockSaveSearchAPI,
      };
    }),
  };
});

// 2. Mock Utils
vi.mock("@/utils/rules.js", () => ({
  isRequired: vi.fn(() => true),
}));

describe("SaveSearchStepper.vue", () => {
  const wrappers = [];
  let actions;
  let saveSearchGetters;
  let advancedSearchGetters;
  let store; // Track the active Vuex store instance locally

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

    store = createStore({
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
          state: () => ({ open: false }),
          getters: saveSearchGetters,
          // Placeholder mutations to prevent Vuex "unknown mutation" warnings
          mutations: {
            setSaveSearchStepperDialog: vi.fn(),
            setShowStepper: vi.fn(),
            setSaveSearchStatus: vi.fn(),
            setSaveSearchResult: vi.fn(),
          },
        },
        advancedSearch: {
          namespaced: true,
          getters: advancedSearchGetters,
        },
      },
    });

    // Directly spy on the commit method of the generated store instance
    vi.spyOn(store, "commit");

    const wrapper = shallowMount(SaveSearchStepper, {
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
          "v-stepper-item": VSlotStub,
          "v-divider": true,
          "v-window": true,
          "v-window-item": true,
          "v-form": VFormStub,
          VTextField: VTextFieldStub,
          "v-btn": VBtnStub,
          StepperDialogHeader: true,
          PolicyStepper: true,
          OrganisationStepper: true,
          UserStepper: true,
          ResultCard: true,
        },
      },
    });
    wrappers.push(wrapper);
    return wrapper;
  };

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    vi.resetAllMocks();
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
  });

  describe("Methods: closeStepperDialog & restartStepper", () => {
    it("closeStepperDialog commits to the direct store", () => {
      const wrapper = createWrapper();
      wrapper.vm.closeStepperDialog();
      expect(store.commit).toHaveBeenCalledWith(
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

      // Verify the commits hit the local active store spy
      expect(store.commit).toHaveBeenCalledWith(
        "saveSearch/setShowStepper",
        false,
      );
      expect(store.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchStatus",
        true,
      ); // True because no error
      expect(store.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchResult",
        mockSuccessResponse,
      );

      // Verify Form Reset
      expect(wrapper.vm.searchName).toBe("");
      expect(wrapper.vm.searchComment).toBe("");
      expect(wrapper.vm.loading).toBe(false);
    });

    it("handles an ERROR from the save search API", async () => {
      const wrapper = createWrapper(false);
      const mockErrorResponse = { error: "Something went wrong" };
      mockSaveSearchAPI.mockResolvedValueOnce(mockErrorResponse);

      await wrapper.vm.saveSearch();

      expect(store.commit).toHaveBeenCalledWith(
        "saveSearch/setShowStepper",
        false,
      );
      expect(store.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchStatus",
        false,
      ); // False because of error
      expect(store.commit).toHaveBeenCalledWith(
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

  it.each([false, true])(
    "navigates the available step headers and buttons for super curator=%s",
    async (isSuperCurator) => {
      const wrapper = createWrapper(isSuperCurator);
      const headers = wrapper.findAll("v-stepper-header-stub > div");
      expect(headers).toHaveLength(isSuperCurator ? 4 : 2);
      for (let index = 0; index < headers.length; index++) {
        await headers[index].trigger("click");
        expect(wrapper.vm.steps).toBe(index + 1);
      }
      const continues = wrapper
        .findAll("button")
        .filter((button) => button.text() === "Continue");
      expect(continues).toHaveLength(isSuperCurator ? 3 : 1);
      for (let index = 0; index < continues.length; index++) {
        await continues[index].trigger("click");
        expect(wrapper.vm.steps).toBe(index + 2);
      }
      const backs = wrapper
        .findAll("button")
        .filter((button) => button.text() === "Back");
      for (let index = 0; index < backs.length; index++) {
        await backs[index].trigger("click");
        expect(wrapper.vm.steps).toBe(index + 1);
      }
    },
  );

  it("updates form models and saves through the enabled Save button", async () => {
    const wrapper = createWrapper();
    const save = wrapper
      .findAll("button")
      .find((button) => button.text() === "Save");
    expect(save.attributes("disabled")).toBeDefined();
    await wrapper
      .get('input[aria-label="Search Name"]')
      .setValue("A saved search");
    await wrapper
      .get('input[aria-label="Comments"]')
      .setValue("Search comment");
    wrapper.findComponent(VFormStub).vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.searchName).toBe("A saved search");
    expect(wrapper.vm.searchComment).toBe("Search comment");
    expect(save.attributes("disabled")).toBeUndefined();
    mockSaveSearchAPI.mockResolvedValueOnce({ id: 72 });
    await save.trigger("click");
    await flushPromises();
    expect(mockSaveSearchAPI).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "A saved search",
        comments: "Search comment",
      }),
      "fake-token",
    );
    expect(wrapper.vm.searchName).toBe("");
    expect(wrapper.vm.searchComment).toBe("");
  });

  it("handles Escape and restart events from the header and result card", async () => {
    const wrapper = createWrapper(false, false);
    expect(wrapper.findComponent({ name: "PolicyStepper" }).exists()).toBe(
      false,
    );
    wrapper
      .findComponent({ name: "ResultCard" })
      .vm.$emit("restart-stepper", 2);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.steps).toBe(2);
    wrapper
      .findComponent({ name: "StepperDialogHeader" })
      .vm.$emit("restart-stepper", 1);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.steps).toBe(1);
    await wrapper.get("v-dialog-stub").trigger("keydown", { key: "Escape" });
    expect(store.commit).toHaveBeenCalledWith(
      "saveSearch/setSaveSearchStepperDialog",
      false,
    );
  });

  it("reacts to the dialog getter opening and closing without fetching on close", async () => {
    const wrapper = createWrapper(true, true, {
      getSaveSearchStepperDialog: (state) => state.open,
    });
    const state = store.state.saveSearch;
    state.open = true;
    await flushPromises();
    state.open = false;
    await flushPromises();
    expect(wrapper.vm.stepperDialog).toBe(false);
    actions.getUser.mockClear();
    state.open = true;
    await flushPromises();
    expect(wrapper.vm.stepperDialog).toBe(true);
    expect(wrapper.vm.isSuperCurator).toBe(true);
    expect(actions.getUser).toHaveBeenCalledTimes(1);
    state.open = false;
    await flushPromises();
    expect(wrapper.vm.stepperDialog).toBe(false);
    expect(actions.getUser).toHaveBeenCalledTimes(1);
  });

  it("falls back to the current user when no user selection exists", async () => {
    const wrapper = createWrapper(false, true, { getUserSelected: () => null });
    mockSaveSearchAPI.mockResolvedValueOnce(undefined);
    await wrapper.vm.saveSearch();
    expect(mockSaveSearchAPI).toHaveBeenCalledWith(
      expect.objectContaining({ user_ids: [1] }),
      "fake-token",
    );
    expect(store.commit).toHaveBeenCalledWith(
      "saveSearch/setSaveSearchStatus",
      true,
    );
    expect(wrapper.vm.loading).toBe(false);
  });
});
