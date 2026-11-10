import { flushPromises, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import countriesQuery from "@/lib/GraphClient/queries/getCountries.json";
import getUserQuery from "@/lib/GraphClient/queries/getUserMeta.json";
import getOrganisationsQuery from "@/lib/GraphClient/queries/Organisations/getOrganisations.json";
import getOrganisationsTypesQuery from "@/lib/GraphClient/queries/Organisations/getOrganisationTypes.json";
import editorStore from "@/store/editor";
import userStore from "@/store/users";
import * as generalUtils from "@/utils/generalUtils";
import EditProfile from "@/views/Users/EditProfile.vue";

import { VAutocompleteStub } from "../../../stubs/VAutocompleteStub.js";
import { VBtnStub } from "../../../stubs/VBtnStub.js";
import { VCheckBoxStub } from "../../../stubs/VCheckBoxStub.js";
import { VFileInputStub } from "../../../stubs/VFileInputStub.js";
import { VFormStub } from "../../../stubs/VFormStub.js";
import { VIconStub } from "../../../stubs/VIconStub.js";
import { VSelectStub } from "../../../stubs/VSelectStub.js";
import { VTextFieldStub } from "../../../stubs/VTextFieldStub.js";
import { VTooltipStub } from "../../../stubs/VTooltipStub.js";

userStore.state.user = function () {
  return {
    metadata: {
      email: "test@example.com",
      first_name: "Test",
      last_name: "User",
      homepage: "",
      mastodon: "",
      bluesky: "",
      orcid: null,
      profile_type: "profile 1",
      third_party: false,
      preferences: {
        hide_email: true,
        email_updates: false,
        push_to_orcid: false,
      },
    },

    credentials: {
      username: "username",
      token: "123",
    },

    records: {
      organisations: [],
    },
  };
};

let $router = { push: vi.fn() };

let $store = new Vuex.Store({
  modules: {
    users: userStore,
    editor: editorStore,
  },
});

describe("EditPrivateProfile.vue", () => {
  let wrapper, graphStub, profilesStub, userStub;
  let originalUserFn;

  beforeAll(() => {
    originalUserFn = userStore.state.user;
    profilesStub = sinon
      .stub(Client.prototype, "getProfileTypes")
      .returns(["profile 1", "profile 2"]);
    userStub = sinon.stub(Client.prototype, "getUser");
    graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
    graphStub.withArgs(getUserQuery).callsFake(() => ({
      user: { organisations: [] },
    }));
    graphStub.withArgs(getOrganisationsQuery).callsFake(() => ({
      searchOrganisations: [
        { id: 1, name: "org 1" },
        { id: 2, name: "org 2" },
      ],
    }));
    graphStub.withArgs(getOrganisationsTypesQuery).returns({
      searchOrganisationTypes: [
        { id: 1, name: "org type 1" },
        { id: 2, name: "org type 2" },
      ],
    });
    graphStub.withArgs(countriesQuery).returns({
      searchCountries: [
        { label: "France", name: "France", code: "FR", id: 33 },
        { label: "Antarctica", name: "Antarctica", code: null, id: 10 },
      ],
    });
  });
  afterAll(() => {
    profilesStub.restore();
    graphStub.restore();
    userStub.restore();
    userStore.state.user = originalUserFn;
  });

  beforeEach(async () => {
    userStore.state.user = originalUserFn;
    localStorage.setItem("user", JSON.stringify(originalUserFn()));
    userStub.returns({
      id: 1,
      username: "username",
      ...originalUserFn().metadata,
    });
    $store.commit("users/clearMessages");
    $router.push.mockClear();
    wrapper = await shallowMount(EditProfile, {
      mocks: { $store, $router },
      global: {
        stubs: {
          VAutocomplete: {
            ...VAutocompleteStub,
            // This view uses the legacy item/selection slot shape.
            template: `
              <div>
                <slot name="prepend" />
                <template v-for="item in safeItems" :key="item.id">
                  <slot name="item" :item="item" />
                </template>
                <template v-for="item in (Array.isArray(modelValue) ? modelValue : [])" :key="item.id">
                  <slot name="selection" :item="item" />
                </template>
                <select :aria-label="label" :value="selectedValue" @change="handleChange">
                  <option value="">Select an option</option>
                  <option v-for="(item, index) in safeItems" :key="item.id || item"
                    :value="returnObject || multiple ? index : item[itemValue]">
                    {{ item[itemTitle] }}
                  </option>
                </select>
              </div>
            `,
          },
          VBtn: VBtnStub,
          VCheckbox: VCheckBoxStub,
          VFileInput: VFileInputStub,
          VForm: VFormStub,
          VIcon: VIconStub,
          VSelect: VSelectStub,
          VTextField: VTextFieldStub,
          VTooltip: VTooltipStub,
        },
      },
    });
    await flushPromises();
  });

  afterEach(async () => {
    await flushPromises();
    wrapper.unmount();
    vi.restoreAllMocks();
    userStore.state.user = originalUserFn;
    localStorage.removeItem("user");
  });

  it("can be instantiated", () => {
    const title = "EditProfile";
    expect(wrapper.vm.$options.name).toMatch(title);

    for (const rule in wrapper.vm.rules) {
      expect(typeof wrapper.vm.rules[rule]()).toBe("function");
    }
  });

  it("can post the new user", async () => {
    let restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: {
        modification: "failure",
      },
    });
    await wrapper.vm.updateProfile();
    expect($router.push).toHaveBeenCalledWith({ path: "/accounts/profile" });
    expect(wrapper.vm.messages().getUser.message).toBe(
      "Your profile was updated successfully.",
    );
    restStub.restore();
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: {
        error: {
          response: {
            data: {
              errors: {
                field: "test",
                message: "error",
              },
            },
          },
        },
      },
    });
    await wrapper.vm.updateProfile();
    expect(wrapper.vm.messages().updateProfile).toStrictEqual({
      message: { field: "test", message: "error" },
      error: true,
    });
    restStub.restore();
  });

  it("can process errors", async () => {
    userStub.returns({ id: 1 });
    userStore.state.user = function () {
      return {
        metadata: {},
        records: { organisations: [] },
        credentials: { token: "123" },
      };
    };
    $store = new Vuex.Store({
      modules: {
        users: userStore,
        editor: editorStore,
      },
    });
    let anotherWrapper = await shallowMount(EditProfile, {
      mocks: { $store, $router },
    });
    await flushPromises();
    expect(anotherWrapper.vm.formData).toBe(null);
    expect(anotherWrapper.find("#editProfileForm").exists()).toBe(false);
    anotherWrapper.unmount();
  });

  it("disables the email edit field for third party users", () => {
    expect(wrapper.vm.isDisabled("email")).toBe(false);
    $store.state.users.user = function () {
      return {
        metadata: { third_party: true },
        records: { organisations: [] },
      };
    };
    expect(wrapper.vm.isDisabled("email")).toBe(true);
  });

  it("can create a new organisation", async () => {
    let createOrganisationStub = sinon
      .stub(Client.prototype, "createOrganisation")
      .returns({
        data: {
          id: 10,
          attributes: {
            name: "an organisation",
          },
        },
      });
    wrapper.vm.userOrganisations = [];
    wrapper.vm.newOrganisation.data.country_ids = [
      { id: 1, name: "Duncruigh" },
    ];
    await wrapper.vm.createOrganisation();
    expect(wrapper.vm.data.organisations[2]).toStrictEqual({
      id: 10,
      name: "an organisation",
    });
    expect(wrapper.vm.userOrganisations).toStrictEqual([
      { id: 10, name: "an organisation" },
    ]);
    expect(wrapper.vm.newOrganisation.error).toBeFalsy();

    createOrganisationStub.returns({
      error: { response: { data: "An error" } },
    });
    await wrapper.vm.createOrganisation();
    expect(wrapper.vm.newOrganisation.error).toBe("An error");
    createOrganisationStub.restore();
  });

  it("can check removeCountry", () => {
    wrapper.vm.newOrganisation.data.country_ids = [{ id: 1, label: "b" }];
    wrapper.vm.removeCountry({ id: 1, label: "b" });
    expect(wrapper.vm.newOrganisation.data.country_ids).toStrictEqual([]);
  });

  it("can update profile preferences locally", async () => {
    expect(wrapper.vm.formData.preferences_hide).toBe(true);
    expect(wrapper.vm.formData.preferences_send).toBe(false);
    expect(wrapper.vm.formData.preferences_orcid).toBe(false);

    wrapper.vm.formData.preferences_hide = false;
    wrapper.vm.formData.preferences_send = true;
    wrapper.vm.formData.preferences_orcid = true;

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.formData.preferences_hide).toBe(false);
    expect(wrapper.vm.formData.preferences_send).toBe(true);
    expect(wrapper.vm.formData.preferences_orcid).toBe(true);
  });

  it("loads profile options and organisations before enabling the form", () => {
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.data.profileTypes).toEqual(["profile 1", "profile 2"]);
    expect(wrapper.vm.data.organisations).toEqual([
      { id: 1, name: "org 1" },
      { id: 2, name: "org 2" },
    ]);
    expect(wrapper.vm.organisationsTypes).toHaveLength(2);
    expect(wrapper.vm.countries).toEqual([
      { label: "France", name: "France", code: "FR", id: 33 },
      { label: "Antarctica", name: "Antarctica", code: null, id: 10 },
    ]);
    expect(wrapper.text()).toContain(
      "We strongly recommend including your ORCID ID",
    );
    expect(
      wrapper.find('[aria-label="Username"]').attributes("disabled"),
    ).toBeDefined();
    expect(
      wrapper.find('[aria-label="Orcid ID"]').attributes("disabled"),
    ).toBeDefined();
  });

  it("binds profile text, type, preferences and selected organisations", async () => {
    await wrapper.find('[aria-label="First Name"]').setValue("Updated");
    await wrapper.find('[aria-label="Profile Type"]').setValue("profile 2");
    const checkboxes = wrapper.findAll('[data-test="v-checkbox"]');
    await checkboxes[0].setValue(false);
    await checkboxes[1].setValue(true);
    await checkboxes[2].setValue(true);
    await wrapper.find('[aria-label="Organisations"]').setValue("1");
    await wrapper
      .findComponent({ name: "VForm" })
      .vm.$emit("update:modelValue", true);

    expect(wrapper.vm.formData).toMatchObject({
      first_name: "Updated",
      profile_type: "profile 2",
      preferences_hide: false,
      preferences_send: true,
      preferences_orcid: true,
    });
    expect(wrapper.vm.userOrganisations).toEqual([{ id: 2, name: "org 2" }]);
    expect(wrapper.vm.valid).toBe(true);
  });

  it("defaults missing preferences and hides the ORCID recommendation for linked users", async () => {
    const user = originalUserFn();
    user.metadata.preferences = {};
    user.metadata.orcid = "0000-0001-2345-6789";
    $store.state.users.user = () => user;
    wrapper.vm.setFormData();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.formData).toMatchObject({
      preferences_hide: false,
      preferences_send: false,
      preferences_orcid: false,
      orcid: "0000-0001-2345-6789",
    });
    expect(wrapper.text()).not.toContain(
      "We strongly recommend including your ORCID ID",
    );
  });

  it.each([false, true])(
    "submits profile changes through the button with error=%s",
    async (error) => {
      let finishRequest;
      const editUser = vi
        .spyOn(Client.prototype, "editUser")
        .mockImplementation(
          () =>
            new Promise((resolve) => {
              finishRequest = resolve;
            }),
        );
      await wrapper.find('[aria-label="First Name"]').setValue("Updated");
      await wrapper.find('[aria-label="Organisations"]').setValue("0");
      const button = wrapper
        .findAll("button")
        .find((item) => item.text() === "Update profile");
      await button.trigger("click");
      expect(wrapper.vm.loading).toBe(true);
      expect(editUser).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: "Updated",
          organisation_ids: [1],
          preferences: {
            hide_email: true,
            email_updates: false,
            push_to_orcid: false,
          },
        }),
        "123",
      );

      finishRequest(
        error
          ? {
              error: {
                response: { data: { errors: { email: ["Already taken"] } } },
              },
            }
          : {},
      );
      await flushPromises();
      expect(wrapper.vm.loading).toBe(false);
      if (error) {
        expect(wrapper.text()).toContain("email: Already taken");
        expect($router.push).not.toHaveBeenCalled();
      } else {
        expect($router.push).toHaveBeenCalledExactlyOnceWith({
          path: "/accounts/profile",
        });
        expect(wrapper.vm.messages().getUser.message).toBe(
          "Your profile was updated successfully.",
        );
      }
    },
  );

  it("renders a successful profile update message", async () => {
    $store.commit("users/setMessage", {
      field: "updateProfile",
      message: "Profile saved",
    });
    await wrapper.vm.$nextTick();
    const alert = wrapper.findComponent({ name: "VAlert" });
    expect(alert.props("type")).toBe("success");
    expect(alert.text()).toContain("Profile saved");
  });

  it("opens the organisation form, binds its fields and cancels without saving", async () => {
    const createOrganisation = vi.spyOn(Client.prototype, "createOrganisation");
    expect(wrapper.find("#createNewOrganisation").exists()).toBe(false);
    await wrapper.find('[data-test="v-icon"]').trigger("click");
    expect(wrapper.vm.newOrganisation.show).toBe(true);
    await wrapper
      .find('[aria-label="Organisation name"]')
      .setValue("New organisation");
    await wrapper
      .find('[aria-label="Organisation homepage"]')
      .setValue("https://example.org");
    const autocompletes = wrapper.findAllComponents({ name: "VAutocomplete" });
    await autocompletes
      .find((item) => item.props("label") === "Select the organisation type(s)")
      .vm.$emit("update:modelValue", [1]);
    await autocompletes
      .find((item) => item.props("label") === "Countries")
      .vm.$emit("update:modelValue", [{ id: 33, name: "France" }]);
    await wrapper
      .findAllComponents({ name: "VForm" })[1]
      .vm.$emit("update:modelValue", false);
    const save = wrapper
      .findAll("button")
      .find((item) => item.text() === "Save new organisation");
    expect(save.attributes("disabled")).toBeDefined();
    expect(wrapper.vm.newOrganisation.data).toMatchObject({
      name: "New organisation",
      homepage: "https://example.org",
      organisation_type_ids: [1],
      country_ids: [{ id: 33, name: "France" }],
    });
    await wrapper
      .findAll("button")
      .find((item) => item.text() === "Cancel")
      .trigger("click");
    expect(wrapper.find("#createNewOrganisation").exists()).toBe(false);
    expect(createOrganisation).not.toHaveBeenCalled();
  });

  it.each([false, true])(
    "saves an organisation through its form with error=%s",
    async (error) => {
      const createOrganisation = vi
        .spyOn(Client.prototype, "createOrganisation")
        .mockResolvedValue(
          error
            ? { error: { response: { data: "Organisation already exists" } } }
            : { data: { id: 10, attributes: { name: "New organisation" } } },
        );
      await wrapper.find('[data-test="v-icon"]').trigger("click");
      await wrapper
        .find('[aria-label="Organisation name"]')
        .setValue("New organisation");
      await wrapper
        .find('[aria-label="Organisation homepage"]')
        .setValue("https://example.org");
      wrapper.vm.newOrganisation.data.country_ids = [
        { id: 33, name: "France" },
      ];
      wrapper.vm.newOrganisation.data.organisation_type_ids = [2];
      wrapper.vm.newOrganisation.data.logoData = {
        filename: "logo.png",
        content_type: "image/png",
        data: "bG9nbw==",
      };
      await wrapper
        .findAll("button")
        .find((item) => item.text() === "Save new organisation")
        .trigger("click");
      await flushPromises();
      expect(createOrganisation).toHaveBeenCalledWith(
        {
          name: "New organisation",
          homepage: "https://example.org",
          organisation_type_ids: [2],
          country_ids: [33],
          logo: {
            filename: "logo.png",
            content_type: "image/png",
            data: "bG9nbw==",
          },
        },
        "123",
      );
      expect(wrapper.vm.newOrganisation.loading).toBe(false);
      if (error) {
        expect(wrapper.text()).toContain("Organisation already exists");
        expect(wrapper.vm.newOrganisation.show).toBe(true);
        expect(wrapper.vm.userOrganisations).toEqual([]);
      } else {
        expect(wrapper.vm.userOrganisations).toEqual([
          { id: 10, name: "New organisation" },
        ]);
        expect(wrapper.vm.newOrganisation.show).toBe(false);
        expect(wrapper.vm.newOrganisation.data.name).toBeNull();
      }
    },
  );

  it("converts an uploaded logo and clears its payload when removed", async () => {
    let finishConversion;
    const convert = vi.spyOn(generalUtils, "toBase64").mockImplementation(
      () =>
        new Promise((resolve) => {
          finishConversion = resolve;
        }),
    );
    await wrapper.find('[data-test="v-icon"]').trigger("click");
    const file = new File(["logo"], "logo.png", { type: "image/png" });
    const input = wrapper.findComponent({ name: "VFileInput" });
    await input.vm.$emit("update:modelValue", file);
    expect(wrapper.vm.logoLoading).toBe(true);
    expect(convert).toHaveBeenCalledExactlyOnceWith(file);
    finishConversion("bG9nbw==");
    await flushPromises();
    expect(wrapper.vm.newOrganisation.data.logoData).toEqual({
      filename: "logo.png",
      content_type: "image/png",
      data: "bG9nbw==",
    });
    expect(wrapper.vm.logoLoading).toBe(false);
    await input.vm.$emit("update:modelValue", null);
    await flushPromises();
    expect(wrapper.vm.newOrganisation.data.logoData).toEqual({});
    expect(convert).toHaveBeenCalledTimes(1);
  });

  it.each([null, 3145727, 3145728, 3145729])(
    "validates organisation logo size %s",
    async (size) => {
      vi.spyOn(generalUtils, "toBase64").mockResolvedValue("bG9nbw==");
      const file =
        size === null
          ? null
          : new File(["logo"], "logo.png", { type: "image/png" });
      if (file) Object.defineProperty(file, "size", { value: size });
      wrapper.vm.newOrganisation.data.logo = file;
      await wrapper.vm.$nextTick();
      await flushPromises();
      const tooBig = size !== null && size >= wrapper.vm.allowedFileSize;
      expect(wrapper.vm.imageSizeCorrect()).toBe(!tooBig);
      expect(wrapper.vm.imageTooBig).toBe(tooBig);
      if (file) expect(wrapper.emitted("imageTooBig").at(-1)).toEqual([tooBig]);
    },
  );

  it("removes countries by matching their identifier or label", () => {
    wrapper.vm.newOrganisation.data.country_ids = [
      { id: 1, label: "France" },
      { id: 2, label: "France" },
      { id: 3, label: "Germany" },
    ];
    wrapper.vm.removeCountry({ id: 1, name: "France" });
    expect(wrapper.vm.newOrganisation.data.country_ids).toEqual([
      { id: 3, label: "Germany" },
    ]);
  });

  it("renders country options and removes a selected country through its chip", async () => {
    await wrapper.find('[data-test="v-icon"]').trigger("click");
    expect(
      wrapper.findComponent({ name: "CountryFlag" }).props("country"),
    ).toBe("FR");
    expect(wrapper.find('img[src*="country.png"]').exists()).toBe(true);
    const countries = wrapper.find('[aria-label="Countries"]');
    await countries.setValue("0");
    await countries.setValue("1");
    const chip = wrapper
      .findAllComponents({ name: "VChip" })
      .find((item) => item.text() === "France");
    expect(chip).toBeDefined();
    await chip.vm.$emit("click:close");
    expect(wrapper.vm.newOrganisation.data.country_ids).toEqual([
      { label: "Antarctica", name: "Antarctica", code: null, id: 10 },
    ]);
    expect(
      wrapper.findAllComponents({ name: "VChip" }).map((item) => item.text()),
    ).toEqual(["Antarctica"]);
  });
});
