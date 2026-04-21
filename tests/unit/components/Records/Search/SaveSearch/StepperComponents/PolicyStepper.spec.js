import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";

// 1. Mock the direct store import
import { removeItem } from "@/utils/advancedSearchUtils";
import PolicyStepper from "@/components/Records/Search/SaveSearch/StepperComponents/PolicyStepper.vue";

vi.mock("@/store", () => ({
  default: {
    commit: vi.fn(),
  },
}));

// 2. Mock the utility function
vi.mock("@/utils/advancedSearchUtils", () => ({
  removeItem: vi.fn(),
}));

describe("PolicyStepper.vue", () => {
  let actions;
  let getters;

  const createWrapper = (isSuperCurator = false, stateOverrides = {}) => {
    actions = {
      fetchPolicyRecords: vi.fn(),
      getUser: vi.fn(),
    };

    getters = {
      getUserRecords: () => ({
        user: { policy: [{ id: 1, name: "Org 1" }] },
      }),
      getPolicyRecords: () => [{ id: 10, name: "Search Org" }],
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
        saveSearch: {
          namespaced: true,
          getters: {
            getPolicyRecords: getters.getPolicyRecords,
            getLoadingStatus: getters.getLoadingStatus,
          },
          actions: {
            fetchPolicyRecords: actions.fetchPolicyRecords,
          },
        },
      },
    });

    return shallowMount(PolicyStepper, {
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

  describe("v-model (policySelected)", () => {
    it("updates local data when v-autocomplete emits 'update:search'", async () => {
      const wrapper = createWrapper(true);
      const autocomplete = wrapper.findComponent({ name: "v-autocomplete" });

      // Simulate the user typing in the autocomplete
      await autocomplete.vm.$emit("update:search", "Cambridge");

      expect(wrapper.vm.searchPolicy).toBe("Cambridge");
    });
  });

  describe("Watcher", () => {
    it("searchPolicy does NOT trigger search when query length is < 3", async () => {
      const wrapper = createWrapper(true);

      wrapper.vm.searchPolicy = "Un"; // 2 chars
      await wrapper.vm.$nextTick();

      expect(actions.fetchPolicyRecords).not.toHaveBeenCalled();
    });
  });

  describe("Methods: ", () => {
    it("fetchUserPolicyRecordData returns empty array if no policy are found", async () => {
      const wrapper = createWrapper(false, {
        getUserRecords: () => ({ user: { policy: null } }),
      });

      const result = await wrapper.vm.fetchUserPolicyRecordData();
      expect(result).toEqual([]);
    });

    it("calls the removeItem utility with the correct arguments and returns the result", () => {
      const wrapper = createWrapper(true); // Super curator or regular doesn't matter for this method

      // 1. Set up initial component state
      const initialList = [1, 2, 3];
      wrapper.vm.policySelected = initialList;

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
