import { afterEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import SaveSearchButton from "@/components/Records/Search/SaveSearch/SaveSearchButton.vue";

describe("SaveSearchButton.vue", () => {
  let mockRouter;
  let mockRoute;
  let store; // Track the active Vuex store instance locally

  const createWrapper = (
    isLoggedIn = false,
    currentPath = "/search",
    fullPath = "/search?query=test",
  ) => {
    mockRouter = {
      push: vi.fn(),
    };

    mockRoute = {
      path: currentPath,
      fullPath: fullPath,
    };

    store = createStore({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({
              isLoggedIn: isLoggedIn,
            }),
          },
        },
        // Added the missing saveSearch module to handle the mutation commit safely
        saveSearch: {
          namespaced: true,
          mutations: {
            setSaveSearchStepperDialog: vi.fn(),
          },
        },
      },
    });

    // Directly spy on the commit method of the generated store instance
    vi.spyOn(store, "commit");

    return shallowMount(SaveSearchButton, {
      global: {
        plugins: [store],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
        },
        stubs: {
          "v-btn": {
            name: "v-btn",
            template: `<button class="v-btn-stub"><slot/></button>`,
          },
        },
      },
    });
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Template @click Logic", () => {
    it("calls goToLogin() routing logic when the user is NOT logged in", async () => {
      const wrapper = createWrapper(
        false,
        "/advanced-search",
        "/advanced-search?type=database",
      );

      await wrapper.findComponent({ name: "v-btn" }).trigger("click");

      // Asserts that routing to login happened because the user wasn't logged in
      expect(mockRouter.push).toHaveBeenCalledWith({
        path: "/accounts/login",
        query: { goTo: "/advanced-search?type=database" },
      });
      expect(store.commit).not.toHaveBeenCalled();
    });

    it("calls saveSearchResults() store logic when the user IS logged in", async () => {
      const wrapper = createWrapper(true); // isLoggedIn = true

      await wrapper.findComponent({ name: "v-btn" }).trigger("click");

      // Asserts that the store dialog was triggered because the user was logged in
      expect(store.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchStepperDialog",
        true,
      );
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  describe("Methods: saveSearchResults", () => {
    it("commits 'setSaveSearchStepperDialog' to the store instance", async () => {
      const wrapper = createWrapper();
      await wrapper.vm.saveSearchResults();

      expect(store.commit).toHaveBeenCalledTimes(1);
      expect(store.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchStepperDialog",
        true,
      );
    });
  });

  describe("Methods: goToLogin", () => {
    it("pushes to /accounts/login with a 'goTo' query if NOT currently on the login page", async () => {
      const wrapper = createWrapper(
        false,
        "/advanced-search",
        "/advanced-search?type=database",
      );

      await wrapper.vm.goToLogin();

      expect(mockRouter.push).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith({
        path: "/accounts/login",
        query: {
          goTo: "/advanced-search?type=database",
        },
      });
    });

    it("does NOTHING if the user is already on the login page", async () => {
      const wrapper = createWrapper(
        false,
        "/accounts/login",
        "/accounts/login",
      );

      await wrapper.vm.goToLogin();

      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});
