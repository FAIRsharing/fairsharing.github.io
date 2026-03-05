import { shallowMount  } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import UserMenu from "@/components/Users/UserProfileMenu.vue";
import Client from "@/lib/Client/RESTClient.js";
import userStore from "@/store/users";

userStore.state.user = function () {
  return {
    role: "super_curator",
    email: "test@test.com",
    credentials: {
      token: "thisisafaketoken",
    },
    id: 1,
  };
};

const $store = new Vuex.Store({
  modules: {
    users: userStore,
  },
});
const $router = { push: jest.fn() };

describe("UserProfileMenu.vue", () => {
  let wrapper;
  let restStub;

  beforeAll(() => {
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: {
        success: true,
        message: "Success !",
      },
    });
  });
  afterAll(() => {
    restStub.restore();
  });

  beforeEach(() => {
    $router.push.mockClear();
    wrapper = shallowMount(UserMenu, {
      mocks: { $store, $router },
    });
  });

  it("can be instantiated", () => {
    const title = "UserProfileMenu";
    expect(wrapper.vm.$options.name).toMatch(title);
  });

  it("can a user that is a curator access to the curator panel", async () => {
    restStub.restore();
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: {
        success: true,
        message: "Success !",
      },
    });
    await wrapper.vm.menuItems
      .filter((obj) => obj.name === "Curator Panel")[0]
      .action();
    expect($router.push).toHaveBeenCalledWith({ path: "/curator" });
  });

  it("can log user out", async () => {
    await wrapper.vm.menuItems
      .filter((obj) => obj.name === "Logout")[0]
      .action();
    expect($router.push).toHaveBeenCalledWith({ name: "Login" });
  });

  it("can reset user pwd", async () => {
    await wrapper.vm.menuItems
      .filter((obj) => obj.name === "Reset Password")[0]
      .action();
    expect($router.push).toHaveBeenCalledWith({
      path: "/accounts/forgotPassword",
    });
  });

  it("can redirect to user edit profile or editPublicProfile", async () => {
    userStore.state.user = function () {
      return {
        role: "super_curator",
        email: "test@test.com",
        credentials: {
          token: "thisisafaketoken",
        },
        id: 1,
      };
    };
    let $store = new Vuex.Store({
      modules: {
        users: userStore,
      },
    });
    wrapper = shallowMount(UserMenu, {
      props: { viewingId: 1 },
      mocks: { $store, $router },
    });
    await wrapper.vm.menuItems
      .filter((obj) => obj.name === "Edit profile")[0]
      .action();
    expect($router.push).toHaveBeenCalledWith({ path: "/profiles/edit" });
    userStore.state.user = function () {
      return {
        role: "super_curator",
        email: "test@test.com",
        credentials: {
          token: "thisisafaketoken",
        },
        id: 1,
      };
    };
    $store = new Vuex.Store({
      modules: {
        users: userStore,
      },
    });
    wrapper = shallowMount(UserMenu, {
      props: { viewingId: 2 },
      mocks: { $store, $router },
    });
    await wrapper.vm.menuItems
      .filter((obj) => obj.name === "Edit profile")[0]
      .action();
    expect($router.push).toHaveBeenCalledWith({
      path: "/profiles/editPublicProfile/2",
    });
    userStore.state.user = function () {
      return {
        role: "super_curator",
        email: "test@test.com",
        credentials: {
          token: "thisisafaketoken",
        },
        id: 1,
      };
    };
    $store = new Vuex.Store({
      modules: {
        users: userStore,
      },
    });
    wrapper = shallowMount(UserMenu, {
      props: {},
      mocks: { $store, $router },
    });
    await wrapper.vm.menuItems
      .filter((obj) => obj.name === "Edit profile")[0]
      .action();
    expect($router.push).toHaveBeenCalledWith({ path: "/profiles/edit" });
  });

  it("can redirect to userLists", async () => {
    await wrapper.vm.menuItems
      .filter((obj) => obj.name === "Users List")[0]
      .action();
    expect($router.push).toHaveBeenCalledWith({ path: "/profiles/usersList" });
  });

  it("hides edit profile button where required", () => {
    // Unknown why this has to be duplicated here for the test to pass...
    userStore.state.user = function () {
      return {
        role: "super_curator",
        email: "test@test.com",
        credentials: {
          token: "thisisafaketoken",
        },
        id: 1,
      };
    };
    const $store = new Vuex.Store({
      modules: {
        users: userStore,
      },
    });
    wrapper = shallowMount(UserMenu, {
      props: { viewingId: 1 },
      mocks: { $store, $router },
    });
    expect(wrapper.vm.disableEdit()).toBe(false);

    wrapper = shallowMount(UserMenu, {
      props: { viewingId: 2 },
      mocks: { $store, $router },
    });
    expect(wrapper.vm.disableEdit()).toBe(false);
  });

  it("can disable edit when user is a curator", () => {
    userStore.state.user = function () {
      return {
        role: "curator",
        email: "test@test.com",
        credentials: {
          token: "thisisafaketoken",
        },
        id: 2,
      };
    };
    const $store = new Vuex.Store({
      modules: {
        users: userStore,
      },
    });
    wrapper = shallowMount(UserMenu, {
      props: { viewingId: 2 },
      mocks: { $store, $router },
    });
    expect(wrapper.vm.disableEdit()).toBe(false);
  });

  it("supplies correct password reset URL", () => {
    $store.state.users.user = function () {
      return { isLoggedIn: false };
    };
    expect(wrapper.vm.resetPasswordPath()).toEqual("/accounts/forgotPassword");
    $store.state.users.user = function () {
      return { isLoggedIn: true };
    };
    expect(wrapper.vm.resetPasswordPath()).toEqual("/users/password/edit");
  });
});
