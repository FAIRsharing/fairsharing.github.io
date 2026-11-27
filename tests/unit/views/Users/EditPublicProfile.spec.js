import { flushPromises, shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import EditPublicProfile from "@/views/Users/EditPublicProfile";
import sinon from "sinon";

import Client from "@/lib/Client/RESTClient.js";
import userStore from "@/store/users";

import { VBtnStub } from "../../../stubs/VBtnStub.js";
import { VCheckBoxStub } from "../../../stubs/VCheckBoxStub.js";
import { VDialogStub } from "../../../stubs/VDialogStub.js";
import { VFormStub } from "../../../stubs/VFormStub.js";
import { VSelectStub } from "../../../stubs/VSelectStub.js";
import { VSwitchStub } from "../../../stubs/VSwitchStub.js";
import { VTextFieldStub } from "../../../stubs/VTextFieldStub.js";

const vuetify = createVuetify();

let $route = { params: { id: 123 } };
let $router = {
  push: vi.fn(),
};
userStore.state.user = function () {
  return {
    metadata: {
      preferences: {
        hide_email: true,
      },
      profile_type: "profile 1",
      role: "user",
    },
    credentials: {
      username: "username",
      token: 123,
    },
  };
};
userStore.state.currentPublicUser = { preferences: {} };
let $store = new Vuex.Store({
  modules: {
    users: userStore,
  },
});
$router.go = vi.fn();

describe("EditPublicProfile.vue", function () {
  let wrapper,
    restStubProfile,
    restStubRole,
    restStubUser,
    restStubUpdateUser,
    restStubDeleteUser;
  let originalUserFn;

  beforeAll(() => {
    originalUserFn = userStore.state.user;
    restStubProfile = sinon.stub(Client.prototype, "getProfileTypes");
    restStubRole = sinon.stub(Client.prototype, "getUserRoles");
    restStubUser = sinon.stub(Client.prototype, "getPublicUser");
    restStubUpdateUser = sinon.stub(Client.prototype, "editPublicUser");
    restStubDeleteUser = sinon.stub(Client.prototype, "deletePublicUser");
  });
  afterAll(() => {
    restStubRole.restore();
    restStubProfile.restore();
    restStubUser.restore();
    restStubUpdateUser.restore();
    restStubDeleteUser.restore();
    userStore.state.user = originalUserFn;
  });

  beforeEach(async () => {
    [
      restStubProfile,
      restStubRole,
      restStubUser,
      restStubUpdateUser,
      restStubDeleteUser,
    ].forEach((stub) => stub.reset());
    $store.state.users.user = originalUserFn;
    $store.commit("users/cleanStore");
    $store.commit("users/clearMessages");
    $router.push.mockClear();
    $router.go.mockClear();
    restStubProfile.resolves(["profile 1", "profile 2"]);
    restStubRole.resolves([
      { id: 1, name: "user" },
      { id: 2, name: "curator" },
    ]);
    restStubUser.resolves({
      user: {
        id: 1,
        username: "user",
        email: "user@user.com",
        first_name: "Public",
        last_name: "User",
        homepage: "https://example.org",
        profile_type: "profile 1",
        orcid: "0000-0001-2345-6789",
        mastodon: "",
        bluesky: "",
        preferences: { hide_email: false, email_updates: false },
        role: "user",
        third_party: false,
        deactivated: false,
      },
    });
    restStubUpdateUser.resolves({ error: false });
    restStubDeleteUser.resolves({ error: false });
    wrapper = await shallowMount(EditPublicProfile, {
      vuetify,
      mocks: { $store, $route, $router },
      global: {
        stubs: {
          VBtn: VBtnStub,
          VCheckbox: VCheckBoxStub,
          VDialog: VDialogStub,
          VForm: VFormStub,
          VSelect: VSelectStub,
          VSwitch: VSwitchStub,
          VTextField: VTextFieldStub,
        },
      },
    });
    await flushPromises();
  });

  afterEach(async () => {
    await flushPromises();
    if (wrapper.exists()) wrapper.unmount();
    vi.restoreAllMocks();
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("EditPublicProfile");
    expect(wrapper.vm.pageLoad).toBe(false);
  });

  it("can check if there is no preference in the received data", async () => {
    restStubUser.resolves({ user: { username: "no-preferences" } });
    const wrapper2 = shallowMount(EditPublicProfile, {
      vuetify,
      mocks: { $store, $route },
    });
    await flushPromises();
    expect(wrapper2.vm.$options.name).toMatch("EditPublicProfile");
    expect(wrapper2.vm.formData.username).toBeNull();
    expect(wrapper2.vm.formData.preferences_hide).toBeNull();
    expect(wrapper2.vm.pageLoad).toBe(false);
    wrapper2.unmount();
  });

  it("can check updatePublicProfile method", async () => {
    let updatePublicUser = vi.spyOn(wrapper.vm, "updatePublicUser");
    wrapper.vm.formData.role = "user";
    await wrapper.vm.updatePublicProfile();
    expect(updatePublicUser).toHaveBeenCalled();
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.pageLoad).toBe(false);
  });

  it("can delete a user", async () => {
    await wrapper.vm.deleteAccount();
    expect(wrapper.vm.loading).toBe(false);
    expect($router.go).toHaveBeenCalled();
  });

  it("disables the email edit field for third party users", async () => {
    expect(wrapper.vm.isDisabled("email")).toBe(false);
    $store.state.users.currentPublicUser.third_party = true;
    expect(wrapper.vm.isDisabled("email")).toBe(true);
    await wrapper.vm.$nextTick();
    expect(
      wrapper.find('[aria-label="Email address"]').attributes("disabled"),
    ).toBeDefined();
  });

  it("loads the public user and lookup options once on mount", () => {
    expect(restStubUser.calledOnceWithExactly(123, 123)).toBe(true);
    expect(restStubProfile.calledOnce).toBe(true);
    expect(restStubRole.calledOnceWithExactly(123)).toBe(true);
    expect(wrapper.vm.formData).toMatchObject({
      id: 123,
      username: "user",
      email: "user@user.com",
      first_name: "Public",
      last_name: "User",
      homepage: "https://example.org",
      profile_type: "profile 1",
      orcid: "0000-0001-2345-6789",
      preferences_hide: false,
      preferences_send: false,
      role: "user",
      deactivated: true,
    });
    expect(wrapper.vm.data.profileTypes).toEqual(["profile 1", "profile 2"]);
    expect(wrapper.vm.data.userRoles).toEqual([
      { id: 1, name: "user" },
      { id: 2, name: "curator" },
    ]);
    expect(wrapper.text()).toContain("Edit Public profile of User ID: 123");
    expect(wrapper.findComponent({ name: "EditOrganisations" }).exists()).toBe(
      true,
    );
    expect(
      wrapper.find('[aria-label="Username"]').attributes("disabled"),
    ).toBeDefined();
    expect(
      wrapper.find('[aria-label="Orcid ID"]').attributes("disabled"),
    ).toBeDefined();
  });

  it("updates profile fields, preferences, role and form validity through v-model", async () => {
    await wrapper.find('[aria-label="First Name"]').setValue("Updated");
    await wrapper.find('[aria-label="Profile Type"]').setValue("profile 2");
    const role = wrapper
      .findAllComponents({ name: "VSelect" })
      .find((item) => item.props("label") === "Role");
    await role.vm.$emit("update:modelValue", "curator");
    const checkboxes = wrapper.findAll('[data-test="v-checkbox"]');
    await checkboxes[0].setValue(true);
    await checkboxes[1].setValue(true);
    await wrapper
      .findComponent({ name: "VForm" })
      .vm.$emit("update:modelValue", true);
    expect(wrapper.vm.formData).toMatchObject({
      first_name: "Updated",
      profile_type: "profile 2",
      role: "curator",
      preferences_hide: true,
      preferences_send: true,
    });
    expect(wrapper.vm.valid).toBe(true);
  });

  it("changes the activation switch and its explanatory label", async () => {
    const input = wrapper.find('[data-test="v-switch"]');
    expect(input.element.checked).toBe(true);
    expect(wrapper.text()).toContain("Switch off to deactivate user account");
    await input.setValue(false);
    expect(wrapper.vm.formData.deactivated).toBe(false);
    expect(wrapper.text()).toContain("Switch on to activate user account");
    await input.setValue(true);
    expect(wrapper.vm.formData.deactivated).toBe(true);
  });

  it("does not submit an invalid form", async () => {
    await wrapper.find("form").trigger("submit");
    expect(wrapper.vm.valid).toBe(false);
    expect(restStubUpdateUser.called).toBe(false);
    expect(wrapper.vm.loading).toBe(false);
  });

  it.each([false, true])(
    "submits a valid profile with active=%s and reloads the saved data",
    async (active) => {
      let finishUpdate;
      restStubUpdateUser.callsFake(
        () =>
          new Promise((resolve) => {
            finishUpdate = resolve;
          }),
      );
      await wrapper.find('[aria-label="First Name"]').setValue("Updated");
      await wrapper.find('[data-test="v-checkbox"]').setValue(true);
      await wrapper.find('[data-test="v-switch"]').setValue(active);
      await wrapper
        .findAllComponents({ name: "VSelect" })
        .find((item) => item.props("label") === "Role")
        .vm.$emit("update:modelValue", "curator");
      await wrapper
        .findComponent({ name: "VForm" })
        .vm.$emit("update:modelValue", true);
      const expectedUser = {
        ...wrapper.vm.formData,
        deactivated: !active,
        role_id: 2,
        preferences: { hide_email: true, email_updates: false },
      };
      restStubUser.onSecondCall().resolves({
        user: {
          ...wrapper.vm.currentPublicUser,
          first_name: "Updated",
          role: "curator",
          deactivated: !active,
        },
      });
      await wrapper.find("form").trigger("submit");
      expect(wrapper.vm.loading).toBe(true);
      expect(restStubUpdateUser.calledOnceWithExactly(expectedUser, 123)).toBe(
        true,
      );
      finishUpdate({ error: false });
      await flushPromises();
      expect(wrapper.vm.loading).toBe(false);
      expect(restStubUser.calledTwice).toBe(true);
      expect(wrapper.vm.formData.first_name).toBe("Updated");
      expect(wrapper.vm.formData.deactivated).toBe(active);
      expect(wrapper.findComponent({ name: "VAlert" }).props("type")).toBe(
        "success",
      );
      expect(wrapper.text()).toContain("Update successful!");
    },
  );

  it.each(["response", "exception"])(
    "renders a profile update error from an API %s",
    async (failure) => {
      if (failure === "response") restStubUpdateUser.resolves({ error: true });
      else restStubUpdateUser.rejects(new Error("Update service unavailable"));
      await wrapper
        .findComponent({ name: "VForm" })
        .vm.$emit("update:modelValue", true);
      await wrapper.find("form").trigger("submit");
      await flushPromises();
      expect(wrapper.vm.loading).toBe(false);
      expect(restStubUpdateUser.calledOnce).toBe(true);
      expect(wrapper.findComponent({ name: "VAlert" }).props("type")).toBe(
        "error",
      );
      expect(wrapper.text()).toContain(
        failure === "response"
          ? "Update failed! Please email contact@fairsharing.org for assistance."
          : "Update service unavailable",
      );
    },
  );

  it("opens and cancels deletion without sending a delete request", async () => {
    const button = wrapper
      .findAll("button")
      .find((item) => item.text() === "Delete Account!");
    await button.trigger("click");
    expect(wrapper.vm.dialog).toBe(true);
    expect(wrapper.text()).toContain(
      "Are you sure you want to delete the user account?",
    );
    await wrapper
      .findAll("button")
      .find((item) => item.text() === "No")
      .trigger("click");
    expect(wrapper.vm.dialog).toBe(false);
    expect(wrapper.find('[data-test="v-dialog"]').exists()).toBe(false);
    expect(restStubDeleteUser.called).toBe(false);
    expect($router.go).not.toHaveBeenCalled();
    await button.trigger("click");
    await wrapper
      .findComponent({ name: "VDialog" })
      .vm.$emit("update:modelValue", false);
    expect(wrapper.vm.dialog).toBe(false);
  });

  it("confirms deletion through the dialog and reloads after the request finishes", async () => {
    let finishDelete;
    restStubDeleteUser.callsFake(
      () =>
        new Promise((resolve) => {
          finishDelete = resolve;
        }),
    );
    await wrapper
      .findAll("button")
      .find((item) => item.text() === "Delete Account!")
      .trigger("click");
    await wrapper
      .findAll("button")
      .find((item) => item.text() === "Yes")
      .trigger("click");
    expect(wrapper.vm.dialog).toBe(false);
    expect(wrapper.vm.loading).toBe(true);
    expect(restStubDeleteUser.calledOnceWithExactly(123, 123)).toBe(true);
    expect($router.go).not.toHaveBeenCalled();
    finishDelete({ error: false });
    await flushPromises();
    expect(wrapper.vm.loading).toBe(false);
    expect($router.go).toHaveBeenCalledExactlyOnceWith();
    expect(wrapper.text()).toContain("Delete successful !");
    expect(wrapper.findComponent({ name: "VAlert" }).props("type")).toBe(
      "success",
    );
  });

  it("renders a failed deletion reported by the API", async () => {
    restStubDeleteUser.rejects(new Error("Delete service unavailable"));
    await wrapper.vm.deleteAccount();
    await flushPromises();
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.text()).toContain("Delete service unavailable");
    expect(wrapper.findComponent({ name: "VAlert" }).props("type")).toBe(
      "error",
    );
  });

  it("shows the deletion error alert when the store reports an error", async () => {
    $store.commit("users/setError", {
      field: "deletePublicUser",
      message: "Unable to delete this account",
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: "VAlert" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "VAlert" }).props("type")).toBe(
      "error",
    );
    expect(wrapper.find('[data-test="v-dialog"]').exists()).toBe(false);
  });

  it("shows a missing-user message and hides profile and organisation forms", async () => {
    restStubUser.resolves({ user: {} });
    await wrapper.vm.loadUser();
    await flushPromises();
    expect(wrapper.vm.pageLoad).toBe(false);
    expect(wrapper.text()).toContain("No user found with id 123.");
    expect(wrapper.find("form").exists()).toBe(false);
    expect(wrapper.findComponent({ name: "EditOrganisations" }).exists()).toBe(
      false,
    );
  });

  it("shows a load error while retaining the previously loaded public user", async () => {
    restStubUser.rejects(new Error("Public user service unavailable"));
    await wrapper.vm.loadUser();
    await flushPromises();
    expect(wrapper.vm.pageLoad).toBe(false);
    expect(wrapper.text()).toContain("Public user service unavailable");
    expect(wrapper.find("form").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "VAlert" }).props("type")).toBe(
      "error",
    );
  });

  it("cleans public user data when the editor is unmounted", () => {
    $store.state.users.usersList = [{ id: 123, username: "user" }];
    wrapper.unmount();
    expect($store.state.users.currentPublicUser.username).toBeNull();
    expect($store.state.users.usersList).toEqual([]);
    expect($store.state.users.user().credentials.token).toBe(123);
  });
});
