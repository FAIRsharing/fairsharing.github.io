import { describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";

// 1. Mock the direct store import
import saveSearch from "@/store";
import { removeItem } from "@/utils/advancedSearchUtils";
import OrganisationStepper from "@/components/Records/Search/SaveSearch/StepperComponents/OrganisationStepper.vue";

vi.mock("@/store", () => ({
  default: {
    commit: vi.fn(),
  },
}));

// 2. Mock the utility function
vi.mock("@/utils/advancedSearchUtils", () => ({
  removeItem: vi.fn(),
}));

describe("OrganisationStepper.vue", () => {
  let actions;
  let getters;

  const createWrapper = (isSuperCurator = false, stateOverrides = {}) => {
    actions = {
      fetchSearchOrganisations: vi.fn(),
      getUser: vi.fn(),
    };

    getters = {
      getUserRecords: () => ({
        user: { organisations: [{ id: 1, name: "Org 1" }] },
      }),
      getSearchOrganisations: () => [{ id: 10, name: "Search Org" }],
      getLoadingStatus: () => false,
      ...stateOverrides,
    };

    const store = createStore({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({ is_super_curator: isSuperCurator }),
          },
          getters: { getUserRecords: getters.getUserRecords },
          actions: { getUser: actions.getUser },
        },
        organisationSearch: {
          namespaced: true,
          getters: {
            getSearchOrganisations: getters.getSearchOrganisations,
            getLoadingStatus: getters.getLoadingStatus,
          },
          actions: {
            fetchSearchOrganisations: actions.fetchSearchOrganisations,
          },
        },
      },
    });

    return shallowMount(OrganisationStepper, {
      global: {
        plugins: [store],
        stubs: {
          "v-autocomplete": {
            name: "v-autocomplete",
            props: ["modelValue", "search"],
            template: '<div class="v-autocomplete-stub"></div>',
          },
          "v-checkbox": true,
          "v-progress-linear": true,
        },
      },
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("v-model (organisationSelected)", () => {
    it("updates local data when v-autocomplete emits 'update:modelValue'", async () => {
      const wrapper = createWrapper(true);
      const autocomplete = wrapper.findComponent({ name: "v-autocomplete" });
      const newSelection = [10, 20];

      // Simulate the child component changing the value
      await autocomplete.vm.$emit("update:modelValue", newSelection);

      expect(wrapper.vm.organisationSelected).toEqual(newSelection);
      // Verify the watcher also fired and committed to the store
      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setOrganisationSelected",
        newSelection,
      );
    });

    it("updates local data when v-autocomplete emits 'update:search'", async () => {
      const wrapper = createWrapper(true);
      const autocomplete = wrapper.findComponent({ name: "v-autocomplete" });

      // Simulate the user typing in the autocomplete
      await autocomplete.vm.$emit("update:search", "Cambridge");

      expect(wrapper.vm.searchOrganisation).toBe("Cambridge");
    });
  });

  describe("Initialization (Super Curator vs Regular)", () => {
    it("fetches user organisations on mount when NOT a super curator", async () => {
      const wrapper = createWrapper(false);
      await flushPromises();

      expect(actions.getUser).toHaveBeenCalled();
      expect(wrapper.vm.organisationList).toHaveLength(1);
      expect(wrapper.vm.organisationList[0].name).toBe("Org 1");
    });
  });

  describe("Watcher", () => {
    it("searchOrganisation triggers search action when query length is >= 3", async () => {
      const wrapper = createWrapper(true);

      wrapper.vm.searchOrganisation = "Uni"; // 3 chars
      await wrapper.vm.$nextTick();

      expect(actions.fetchSearchOrganisations).toHaveBeenCalledWith(
        expect.any(Object),
        "Uni",
      );
    });

    it("searchOrganisation does NOT trigger search when query length is < 3", async () => {
      const wrapper = createWrapper(true);

      wrapper.vm.searchOrganisation = "Un"; // 2 chars
      await wrapper.vm.$nextTick();

      expect(actions.fetchSearchOrganisations).not.toHaveBeenCalled();
    });

    it("organisationSelected commits selected organisations to the direct store", async () => {
      const wrapper = createWrapper(true);
      const selection = [1, 2, 3];

      wrapper.vm.organisationSelected = selection;
      await wrapper.vm.$nextTick();

      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setOrganisationSelected",
        selection,
      );
    });
  });

  describe("Methods: ", () => {
    it("fetchUserOrganisationData returns empty array if no organisations are found", async () => {
      const wrapper = createWrapper(false, {
        getUserRecords: () => ({ user: { organisations: null } }),
      });

      const result = await wrapper.vm.fetchUserOrganisationData();
      expect(result).toEqual([]);
    });

    it("calls the removeItem utility with the correct arguments and returns the result", () => {
      const wrapper = createWrapper(true); // Super curator or regular doesn't matter for this method

      // 1. Set up initial component state
      const initialList = [1, 2, 3];
      wrapper.vm.organisationSelected = initialList;

      // 2. Set up what the mocked utility should return
      const mockProcessedList = [1, 3]; // Simulating item '2' being removed
      removeItem.mockReturnValue(mockProcessedList);

      // 3. Execute the method
      const result = wrapper.vm.remove(2);

      // 4. Assertions
      // Check if the utility was called with (the_item, the_current_list)
      expect(removeItem).toHaveBeenCalledWith(2, initialList);

      // Check if the method returns exactly what the utility returned
      expect(result).toEqual(mockProcessedList);
    });
  });
});
