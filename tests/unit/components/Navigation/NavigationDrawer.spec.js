import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";
import { reactive } from "vue"; // For a reactive $route
import NavDrawer from "@/components/Navigation/NavigationDrawer.vue";
import userStore from "@/store/users.js";

const vuetify = createVuetify();

// 1. Mock the store
const $store = new Vuex.Store({
  modules: { users: userStore },
});

describe("NavigationDrawer.vue", () => {
  const $route = reactive({ path: "/", query: {} });
  const $router = { push: vi.fn() };

  it("can be instantiated and navigate", async () => {
    const wrapper = shallowMount(NavDrawer, {
      global: {
        plugins: [vuetify, $store],
        mocks: { $route, $router },
      },
    });

    // --- Test Case 1: Collections ---
    await wrapper.vm.goTo({ path: "collections", query: {} });

    expect($router.push).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        path: "/collections",
      }),
    );

    // IMPORTANT: Clear the history so the next assertion doesn't see "collections"
    $router.push.mockClear();

    // --- Test Case 2: Login ---
    await wrapper.vm.goToLogin();

    // Use objectContaining to ignore that weird { goTo: undefined } noise
    expect($router.push).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/accounts/login",
      }),
    );
  });
});
