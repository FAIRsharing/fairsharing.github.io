import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import sinon from "sinon";
import BaseFields from "@/components/Editor/GeneralInformation/BaseFields.vue";
import RestClient from "@/lib/Client/RESTClient.js";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
import userStore from "@/store/users.js";

import { nextTick } from "vue";
import * as generalUtils from "@/utils/generalUtils.js";
import {
  VAutocompleteStub,
  VBtnStub,
  VCheckboxSlotsStub,
  VFileInputStub,
  VFormStub,
  VIconStub,
  VListItemSlotsStub,
  VOverlayStub,
  VTooltipStub,
  makeTextInputSlotsStub,
} from "../../../../stubs/index.js";

recordStore.state.sections = {
  generalInformation: {
    data: {
      countries: [
        { label: "France", id: 1 },
        { label: "UK", id: 2 },
      ],
      metadata: {},
      type: { name: "test" },
      logo: [],
    },
  },
};

const initialSections = structuredClone(recordStore.state.sections);

const $store = new Vuex.Store({
  modules: {
    editor: editorStore,
    record: recordStore,
    users: userStore,
  },
});

const $route = {
  path: "/create",
};

const $router = {
  push: vi.fn(),
  currentRoute: {
    path: "/edit/123",
  },
};

let wrapper;

describe("Editor -> BaseFields.vue", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_ENDPOINT", "https://api.example.test");
    vi.clearAllMocks();
    $store.state.record.sections = structuredClone(initialSections);
    $store.state.record.sections.generalInformation.data.status = "ready";
    $store.state.record.sections.generalInformation.data.countries = [
      { id: 1, label: "France", name: "France", code: "FR" },
      { id: 2, label: "UK", name: "UK", code: null },
    ];
    $store.state.record.currentRecord = {
      fairsharingRecord: { id: 123, urlForLogo: null },
    };
    $store.state.editor.possibleDuplicates = [];
    $store.state.editor.countries =
      $store.state.record.sections.generalInformation.data.countries;
    $store.state.editor.recordTypes = [
      { header: "Collection" },
      { header: "Database" },
      { name: "repository", description: "A data repository" },
      { name: "identifier_schema", description: "An identifier schema" },
    ];
    $store.state.editor.status = [
      { name: "ready", description: "Available" },
      { name: "deprecated", description: "Retired" },
    ];
    $router.currentRoute.path = "/edit/123";
    $store.state.record.newRecord = false;
    $store.state.users.user = function () {
      return { is_curator: false, credentials: { token: "a token" } };
    };
    wrapper = shallowMount(BaseFields, {
      global: {
        plugins: [$store],
        mocks: { $route, $router },
        stubs: {
          VForm: VFormStub,
          VAutocomplete: VAutocompleteStub,
          VBtn: VBtnStub,
          VCheckbox: VCheckboxSlotsStub,
          VFileInput: VFileInputStub,
          VTextField: makeTextInputSlotsStub("VTextField"),
          VTextarea: makeTextInputSlotsStub("VTextarea", "textarea"),
          VIcon: VIconStub,
          VListItem: VListItemSlotsStub,
          VOverlay: VOverlayStub,
          VTooltip: VTooltipStub,
        },
      },
      props: {
        createMode: false,
        submitRecord: false,
        loading: false,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("BaseFields");
    expect(wrapper.vm.$route.path).toEqual("/create");
  });

  it("can remove a country", () => {
    wrapper.vm.removeCountry({ id: 1, label: "France" });
    expect(wrapper.vm.fields.countries.length).toBe(1);
  });

  it("disables type field except for new records and curators", () => {
    $store.state.users.user = function () {
      return { is_curator: false, credentials: { token: "a token" } };
    };
    expect(wrapper.vm.typeChangeDisabled()).toBe(true);
    $store.state.record.newRecord = true;
    expect(wrapper.vm.typeChangeDisabled()).toBe(false);

    $store.state.users.user = function () {
      return { is_curator: true, credentials: { token: "a token" } };
    };
    $store.state.record.newRecord = false;
    expect(wrapper.vm.typeChangeDisabled()).toBe(false);
  });

  it("sets the submitAnyway flag", () => {
    expect(wrapper.vm.submitAnywayDisabled).toBe(false);
    wrapper.vm.submitAnyway();
    expect(wrapper.vm.submitAnywayDisabled).toBe(true);
  });

  it("runs the tryAgain method", () => {
    wrapper.vm.fields.metadata.homepage = "aaaa";
    wrapper.vm.fields.metadata.name = "aaaa";
    wrapper.vm.fields.metadata.abbreviation = "aaaa";
    wrapper.vm.tryAgain();
    expect(wrapper.vm.fields.metadata.homepage).toBe(null);
    expect(wrapper.vm.fields.metadata.name).toBe(null);
    expect(wrapper.vm.fields.metadata.abbreviation).toBe(null);
  });

  it("sets the disableSubmit variable correctly", async () => {
    $store.state.editor.possibleDuplicates = [{ record: "a record" }];
    wrapper.vm.formValid = false;
    await wrapper.setProps({ submitRecord: false });
    expect(wrapper.vm.disableSubmit()).toBe(true);
    wrapper.vm.formValid = true;
    expect(wrapper.vm.disableSubmit()).toBe(true);
    $store.state.editor.possibleDuplicates = [];
    wrapper.vm.formValid = true;
    await wrapper.setProps({ submitRecord: false });
    expect(wrapper.vm.disableSubmit()).toBe(false);
  });

  it("can delete the logo", async () => {
    const originalRecord = $store.state.record.currentRecord.fairsharingRecord;
    $store.state.record.currentRecord.fairsharingRecord = {
      ...originalRecord,
      id: 123,
      urlForLogo: "/logos/test.png",
    };
    const logoStub = sinon.stub(RestClient.prototype, "clearLogo");
    try {
      logoStub.resolves({ error: "error" });
      await wrapper.setData({ currentLogo: "placeholder" });
      expect(wrapper.findComponent({ name: "VImg" }).props("src")).toBe(
        "https://api.example.test/logos/test.png",
      );
      await wrapper.vm.deleteLogo();
      expect(wrapper.vm.currentLogo).toEqual("placeholder");
      expect(logoStub.calledOnceWithExactly(123, "a token")).toBe(true);
      expect(wrapper.vm.logoLoading).toBe(false);

      logoStub.resolves({});
      await wrapper.vm.deleteLogo();
      expect(wrapper.vm.currentLogo).toBeNull();
      expect(
        wrapper
          .findAllComponents({ name: "VImg" })
          .filter(
            (image) =>
              image.props("src") === "https://api.example.test/logos/test.png",
          ),
      ).toHaveLength(0);
      expect(logoStub.calledTwice).toBe(true);
      expect(wrapper.vm.logoLoading).toBe(false);
    } finally {
      logoStub.restore();
      $store.state.record.currentRecord.fairsharingRecord = originalRecord;
    }
  });

  it("can check isDatabase method", async () => {
    wrapper.vm.fields.type = { name: "repository" };
    expect(wrapper.vm.isDatabase()).toBe(true);
    // wrapper.vm.fields.type = { name: "test" };
    // expect(wrapper.vm.isDatabase()).toBe(false);
  });

  it("updates record metadata, description, form validity and overlay through v-model", async () => {
    for (const [label, field, value] of [
      ["Record Name", "name", "Test repository"],
      ["Abbreviation", "abbreviation", "TR"],
      ["Homepage", "homepage", "https://example.test"],
      [
        "Description",
        "description",
        "A detailed description of the repository",
      ],
    ]) {
      await wrapper.get(`[aria-label="${label}"]`).setValue(value);
      expect(wrapper.vm.fields.metadata[field]).toBe(value);
    }
    wrapper.findComponent(VFormStub).vm.$emit("update:modelValue", true);
    wrapper.findComponent(VOverlayStub).vm.$emit("update:modelValue", true);
    await nextTick();
    expect(wrapper.vm.formValid).toBe(true);
    expect(wrapper.findComponent({ name: "Loaders" }).exists()).toBe(true);
    wrapper.findComponent(VOverlayStub).vm.$emit("update:modelValue", false);
    await nextTick();
    expect(wrapper.vm.logoLoading).toBe(false);
    expect(wrapper.vm.rules.isLongEnough(4)("short")).toBe(true);
    expect(wrapper.vm.rules.isLongEnough(4)("a")).toContain("1/4");
    expect(wrapper.vm.rules.isImage()({ type: "text/plain" })).toBe(
      "File type should be PNG or JPEG",
    );
  });

  it("renders duplicate links and handles override and retry clicks", async () => {
    $store.state.editor.possibleDuplicates = [
      {
        id: 42,
        name: "Existing record",
        abbreviation: "ER",
        homepage: "https://example.test",
      },
      { id: 43, name: "Other record", homepage: "https://other.test" },
    ];
    await nextTick();
    expect(wrapper.get('a[href="/42"]').text()).toBe("Existing record");
    expect(wrapper.get('a[href="/43"]').text()).toBe("Other record");
    expect(wrapper.text()).toContain("(ER)");
    const override = wrapper
      .findAll("button")
      .find((button) => button.text().includes("I know"));
    await override.trigger("click");
    expect(wrapper.emitted("submission")).toHaveLength(1);
    expect(override.element.disabled).toBe(true);
    wrapper.vm.fields.metadata.name = "Duplicate";
    const retry = wrapper
      .findAll("button")
      .find((button) => button.text() === "Clear and retry");
    await retry.trigger("click");
    expect(wrapper.vm.fields.metadata).toMatchObject({
      name: null,
      homepage: null,
      abbreviation: null,
    });
    expect(wrapper.emitted("clearing")).toHaveLength(1);
    wrapper.vm.formValid = true;
    await wrapper.setProps({ submitRecord: true });
    expect(wrapper.vm.disableSubmit()).toBe(false);
  });

  it("only enables creation for a valid form and emits the create action", async () => {
    expect(
      wrapper
        .findAll("button")
        .some((button) => button.text() === "Create Record"),
    ).toBe(false);
    await wrapper.setProps({ createMode: true });
    const create = wrapper
      .findAll("button")
      .find((button) => button.text() === "Create Record");
    expect(create.element.disabled).toBe(true);
    wrapper.findComponent(VFormStub).vm.$emit("update:modelValue", true);
    await nextTick();
    expect(create.element.disabled).toBe(false);
    await create.trigger("click");
    expect(wrapper.emitted("createnewrecord")).toHaveLength(1);
  });

  it.each(["repository", "knowledgebase", "knowledgebase_and_repository"])(
    "supports %s as a registry object and string and updates internal identifiers",
    async (type) => {
      for (const value of [{ name: type }, type]) {
        wrapper.vm.fields.type = value;
        await nextTick();
        expect(wrapper.vm.isDatabase()).toBe(true);
        expect(wrapper.text()).toContain(
          "This database uses internal identifiers",
        );
      }
      await wrapper.get('input[type="checkbox"]').setValue(true);
      expect(wrapper.vm.fields.metadata.internal_identifiers).toBe(true);
    },
  );

  it.each([{ name: "identifier_schema" }, "identifier_schema"])(
    "renders identifier options for %j and persists their values",
    async (type) => {
      wrapper.vm.fields.type = type;
      await nextTick();
      expect(wrapper.vm.isIdentifierSchema()).toBe(true);
      expect(wrapper.vm.isDatabase()).toBe(false);
      const checkboxes = wrapper.findAll('input[type="checkbox"]');
      expect(checkboxes).toHaveLength(3);
      for (const checkbox of checkboxes) await checkbox.setValue(true);
      expect(wrapper.vm.fields.metadata).toMatchObject({
        globally_unique: true,
        persistent: true,
        resolvable: true,
      });
    },
  );

  it("shows curator and deprecation fields only when applicable", async () => {
    expect(wrapper.find('[aria-label="Curator notes"]').exists()).toBe(false);
    expect(wrapper.find('[aria-label="Reason for deprecation"]').exists()).toBe(
      false,
    );
    $store.state.users.user = () => ({
      is_curator: true,
      credentials: { token: "a token" },
    });
    wrapper.vm.fields.status = "deprecated";
    await nextTick();
    await wrapper
      .get('[aria-label="Curator notes"]')
      .setValue("Curator review");
    await wrapper
      .get('[aria-label="Reason for deprecation"]')
      .setValue("Superseded");
    await wrapper.get('input[type="checkbox"]').setValue(true);
    expect(wrapper.vm.fields).toMatchObject({
      curator_notes: "Curator review",
      isHidden: true,
      metadata: { deprecation_reason: "Superseded" },
    });
    expect(wrapper.vm.typeChangeDisabled()).toBe(false);
  });

  it("renders country flags, registry descriptions and status options, and removes country chips", async () => {
    const autocomplete = wrapper.findAllComponents(VAutocompleteStub);
    const countries = autocomplete.find(
      (input) => input.props("label") === "Countries",
    );
    expect(countries.text()).toContain("France");
    expect(
      countries.findComponent({ name: "CountryFlag" }).props("country"),
    ).toBe("FR");
    expect(countries.findComponent({ name: "VImg" }).exists()).toBe(true);
    countries.findComponent({ name: "VChip" }).vm.$emit("click:close");
    await nextTick();
    expect(wrapper.vm.fields.countries.map((country) => country.name)).toEqual([
      "UK",
    ]);
    const types = autocomplete.find(
      (input) => input.props("label") === "Registry and type",
    );
    expect(types.text()).toContain("A data repository");
    expect(types.findComponent({ name: "VDivider" }).exists()).toBe(true);
    expect(types.find("select").element.disabled).toBe(true);
    $store.state.record.newRecord = true;
    await nextTick();
    await types.get("select").setValue("2");
    expect(wrapper.vm.fields.type.name).toBe("repository");
    expect(types.get('[data-test="v-autocomplete-selection"]').text()).toBe(
      "repository",
    );
    const status = autocomplete.find(
      (input) => input.props("label") === "Status",
    );
    expect(status.text()).toContain("Retired");
    await status.get("select").setValue("deprecated");
    expect(wrapper.vm.fields.status).toBe("deprecated");
    const year = autocomplete.find(
      (input) => input.props("label") === "Year of creation",
    );
    year.vm.$emit("update:modelValue", 2024);
    await nextTick();
    expect(wrapper.vm.fields.metadata.year_creation).toBe(2024);
  });

  it("converts an uploaded logo and clears an unpersisted upload", async () => {
    const convert = vi
      .spyOn(generalUtils, "toBase64")
      .mockResolvedValue("aW1hZ2U=");
    const file = new File(["image"], "logo.png", { type: "image/png" });
    const input = wrapper.findComponent(VFileInputStub);
    input.vm.$emit("update:modelValue", file);
    await flushPromises();
    expect(convert).toHaveBeenCalledWith(file);
    expect(wrapper.vm.fields.logo).toEqual({
      filename: "logo.png",
      content_type: "image/png",
      data: "aW1hZ2U=",
    });
    expect(wrapper.vm.logoLoading).toBe(false);
    input.vm.$emit("update:modelValue", null);
    await flushPromises();
    expect(wrapper.vm.fields.logo).toEqual({});
  });

  it("emits the image-size validation result below and at the upload limit", async () => {
    vi.spyOn(generalUtils, "toBase64").mockResolvedValue("image");
    expect(wrapper.vm.imageSizeCorrect).toBe(true);
    for (const [size, valid] of [
      [1048575, true],
      [1048576, false],
    ]) {
      wrapper
        .findComponent(VFileInputStub)
        .vm.$emit(
          "update:modelValue",
          new File(["a".repeat(size)], "logo.png", { type: "image/png" }),
        );
      await flushPromises();
      expect(wrapper.vm.imageSizeCorrect).toBe(valid);
      expect(wrapper.emitted("imageTooBig").at(-1)).toEqual([!valid]);
    }
  });
});
