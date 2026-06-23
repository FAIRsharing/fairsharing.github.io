import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import UserStepper from "@/components/Records/Search/SaveSearch/StepperComponents/UserStepper.vue";

// 1. Mock utility helper
import { removeItem } from "@/utils/advancedSearchUtils";

vi.mock("@/utils/advancedSearchUtils", () => ({
  removeItem: vi.fn(),
}));

describe("UserStepper.vue", () => {
  let actions;
  let store; // Track the active Vuex store instance locally

  const createWrapper = (isSuperCurator = true, usersList = []) => {
    actions = {
      getUsersList: vi.fn().mockResolvedValue(),
    };

    store = createStore({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({ is_super_curator: isSuperCurator }),
            usersList,
          },
          actions,
        },
        // Added the missing saveSearch module to safely intercept watcher commits
        saveSearch: {
          namespaced: true,
          mutations: {
            setUserSelected: vi.fn(),
          },
        },
      },
    });

    // Directly spy on the commit method of the newly generated store instance
    vi.spyOn(store, "commit");

    return shallowMount(UserStepper, {
      global: {
        plugins: [store],
        stubs: {
          "v-autocomplete": {
            name: "v-autocomplete",
            props: ["modelValue", "search", "items", "loading"],
            template:
              '<div class="v-autocomplete-stub"><slot name="no-data" /></div>',
          },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Watcher: searchUser", () => {
    it("triggers getUsersList action when input >= 3 characters", async () => {
      const wrapper = createWrapper(true);

      // Update the search string
      wrapper.vm.searchUser = "John";
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.loading).toBe(true);
      expect(actions.getUsersList).toHaveBeenCalledWith(
        expect.any(Object),
        "John",
      );

      // Wait for the async action in the watcher to finish
      await flushPromises();
      expect(wrapper.vm.loading).toBe(false);
    });

    it("does NOT trigger action when input < 3 characters", async () => {
      const wrapper = createWrapper(true);
      wrapper.vm.searchUser = "Jo";
      await wrapper.vm.$nextTick();

      expect(actions.getUsersList).not.toHaveBeenCalled();
    });
  });

  describe("Watcher: userSelected", () => {
    it("commits to direct store when selection changes", async () => {
      const wrapper = createWrapper(true);
      const autocomplete = wrapper.findComponent({ name: "v-autocomplete" });
      const newSelection = [{ id: 1, username: "admin" }];

      await autocomplete.vm.$emit("update:modelValue", newSelection);
      expect(wrapper.vm.userSelected).toEqual(newSelection);

      // Asserts against the actual store instance spy instead of the removed global mock
      expect(store.commit).toHaveBeenCalledWith(
        "saveSearch/setUserSelected",
        newSelection,
      );
    });
  });

  describe("Method: remove", () => {
    it("calls removeItem utility with correct context", () => {
      const wrapper = createWrapper(true);
      wrapper.vm.userSelected = [1, 2, 3];

      wrapper.vm.remove(2);

      expect(removeItem).toHaveBeenCalledWith(2, [1, 2, 3]);
    });
  });
});
