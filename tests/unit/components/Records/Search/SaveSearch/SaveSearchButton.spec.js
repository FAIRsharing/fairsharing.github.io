import { afterEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import saveSearch from "@/store";
import SaveSearchButton from "@/components/Records/Search/SaveSearch/SaveSearchButton.vue";

vi.mock("@/store", () => ({
  default: {
    commit: vi.fn(),
  },
}));

describe("SaveSearchButton.vue", () => {
  let mockRouter;
  let mockRoute;

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

    const store = createStore({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({
              isLoggedIn: isLoggedIn,
            }),
          },
        },
      },
    });

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
    it("calls goToLogin() when the user is NOT logged in", async () => {
      const wrapper = createWrapper(false); // isLoggedIn = false
      const goToLoginSpy = vi.spyOn(wrapper.vm, "goToLogin");
      const saveSearchSpy = vi.spyOn(wrapper.vm, "saveSearchResults");
      await wrapper.findComponent({ name: "v-btn" }).trigger("click");
      expect(goToLoginSpy).toHaveBeenCalledTimes(1);
      expect(saveSearchSpy).not.toHaveBeenCalled();
    });

    it("calls saveSearchResults() when the user IS logged in", async () => {
      const wrapper = createWrapper(true); // isLoggedIn = true
      const goToLoginSpy = vi.spyOn(wrapper.vm, "goToLogin");
      const saveSearchSpy = vi.spyOn(wrapper.vm, "saveSearchResults");
      await wrapper.findComponent({ name: "v-btn" }).trigger("click");
      expect(saveSearchSpy).toHaveBeenCalledTimes(1);
      expect(goToLoginSpy).not.toHaveBeenCalled();
    });
  });

  describe("Methods: saveSearchResults", () => {
    it("commits 'setSaveSearchStepperDialog' to the direct store import", async () => {
      const wrapper = createWrapper();
      await wrapper.vm.saveSearchResults();
      expect(saveSearch.commit).toHaveBeenCalledTimes(1);
      expect(saveSearch.commit).toHaveBeenCalledWith(
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
      // Set the current path to the login page
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
