import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import LinkOverlay from "@/components/Editor/Organisations/LinkOverlay.vue";
import ExternalClient from "@/lib/Client/ExternalClients";
import RestClient from "@/lib/Client/RESTClient.js";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
import userStore from "@/store/users.js";
import * as generalUtils from "@/utils/generalUtils";
import {
  VAutocompleteStub,
  VBtnStub,
  VFileInputStub,
  VFormStub,
  VOverlayStub,
  VTextFieldStub,
  VTooltipStub,
} from "../../../../stubs/index.js";

const sinon = require("sinon");

recordStore.state.sections = {
  organisations: { data: [{ id: 1, organisation: { name: "abc", id: 1 } }] },
};
recordStore.state.editOrganisationLink = {
  showOverlay: true,
  data: { id: 1, organisation: { name: "abc", id: 1 } },
  id: 0,
};
editorStore.state.organisations = [{ id: 1, name: "Existing Org" }];
editorStore.state.organisationsTypes = [
  { id: 1, name: "Government" },
  { id: 2, name: "Nonprofit" },
  { id: 3, name: "Education" },
  { id: 4, name: "Company" },
  { id: 5, name: "Other" },
  { id: 6, name: "Other" },
  { id: 7, name: "Other" },
  { id: 8, name: "Other" },
  { id: 9, name: "Other" },
  { id: 10, name: "Other" },
];
editorStore.state.grants = [];
const $store = new Vuex.Store({
  modules: {
    editor: editorStore,
    record: recordStore,
    users: userStore,
  },
});
const formValidation = {
  ...VFormStub,
  methods: {
    validate: vi.fn(() => true),
    reset: vi.fn(),
  },
};

const organisation = {
  items: [
    {
      locations: [
        {
          geonames_details: {
            country_code: "GB",
            country_name: "Great Britain",
          },
        },
      ],
      links: [
        {
          type: "website",
          value: "http://www.obsmedical.com/",
        },
      ],
      names: [
        {
          types: ["ror_display"],
          value: "OBS Medical (United Kingdom)",
        },
      ],
      ror_link: "https:rororere.rere",
      types: ["company"],
      parent_ror_links: ["https:rororere.rere1", "https:rororere.rere2"],
      child_ror_links: ["https:rororere.rere3", "https:rororere.rere4"],
    },
  ],
};

describe("Edit -> LinkOverlay.vue", function () {
  let wrapper;
  let restStub;
  let fetchStub;

  beforeEach(async () => {
    $store.state.record.sections = {
      organisations: { data: [{ id: 1, organisation: { name: "abc", id: 1 } }] },
    };
    $store.state.record.editOrganisationLink = {
      showOverlay: true,
      data: { id: 1, organisation: { name: "abc", id: 1 }, relation: "maintains" },
      id: 0,
    };
    $store.state.editor.organisations = [{ id: 1, name: "Existing Org", types: [] }];
    $store.state.editor.organisationsRelations = ["maintains", "funds"];
    $store.state.editor.countries = [
      { id: 44, name: "Great Britain", code: "gb" },
      { id: 99, name: "Unknown", code: null },
    ];
    $store.state.editor.grants = [];
    formValidation.methods.validate.mockClear();
    formValidation.methods.reset.mockClear();
    wrapper = shallowMount(LinkOverlay, {
      global: {
        plugins: [$store],
        stubs: {
          VForm: formValidation,
          VOverlay: VOverlayStub,
          VBtn: VBtnStub,
          VAutocomplete: VAutocompleteStub,
          VTextField: VTextFieldStub,
          VFileInput: VFileInputStub,
          VTooltip: VTooltipStub,
          VListItem: { template: '<div><slot name="prepend" /><slot /></div>' },
        },
      },
    });
    await flushPromises();
  });

  afterEach(() => {
    wrapper.unmount();
    restStub?.restore();
    fetchStub?.restore();
    restStub = null;
    fetchStub = null;
    vi.restoreAllMocks();
  });

  it("can be mounted", () => {
    wrapper.vm.menus.show = "organisation";
    wrapper.vm.rules.isRequired();
    wrapper.vm.rules.isURL();
    wrapper.vm.rules.isImage();
    expect(wrapper.vm.$options.name).toMatch("LinkOverlay");
    expect(wrapper.vm.organisationLinks).toStrictEqual([
      { id: 1, organisation: { name: "abc", id: 1 } },
    ]);
    expect(wrapper.vm.cleanTextList).toEqual(["Maintains", "Funds"]);
    expect(wrapper.vm.relationValue).toBe("maintains");
  });

  it("can check removeCountry", () => {
    wrapper.vm.menus.newOrganisation.data.country_ids = [{ id: 1, label: "b" }];
    wrapper.vm.removeCountry({ id: 1, label: "b" });
    expect(wrapper.vm.menus.newOrganisation.data.country_ids).toStrictEqual([]);
  });

  // it("can react to change in logo", () => {
  //     const fileContents= 'data:image/png;base64,TEST1';
  //     const readAsDataURL= jest.fn();
  //     const addEventListener   = jest.fn((_, evtHandler) => { evtHandler({
  //         target: {result: fileContents}} )});
  //     const dummyFileReader    = {addEventListener, readAsDataURL, result: fileContents};
  //     window.FileReader = jest.fn(() => dummyFileReader);
  //     wrapper.vm.menus.newOrganisation.data = {logo: {value: "123"}};
  //     expect(wrapper.vm.menus.newOrganisation.logoData.data).toBe("data:image/png;base64,TEST1");
  //     wrapper.vm.menus.newOrganisation.data = {logo: null};
  //     expect(wrapper.vm.menus.newOrganisation.logoData.data).toBe("data:image/png;base64,TEST1");
  // });

  it("can hide the menu", () => {
    wrapper.vm.hideMenu();
    expect(wrapper.vm.menus.show).toBe(false);
    expect(wrapper.vm.editOrganisationLink.data).toStrictEqual({});
    expect(wrapper.vm.editOrganisationLink.id).toBe(null);
    expect(wrapper.vm.editOrganisationLink.showOverlay).toBe(false);
  });

  it("can confirm the modifications", () => {
    wrapper.vm.$store.state.record.sections = {
      organisations: {
        data: [{ id: 1, organisation: { name: "abc", id: 1 } }],
      },
    };

    wrapper.vm.$store.state.record.editOrganisationLink = {
      showOverlay: true,
      data: { organisation: { name: "test", id: 2 } },
      id: -1,
    };

    wrapper.vm.confirmModifications();

    expect(wrapper.vm.organisationLinks).toStrictEqual([
      { id: 1, organisation: { name: "abc", id: 1 } },
      { organisation: { name: "test", id: 2 } },
    ]);

    wrapper.vm.$store.state.record.editOrganisationLink = {
      showOverlay: true,
      data: { id: 1, organisation: { name: "work", id: 1 } },
      id: 0,
    };

    wrapper.vm.confirmModifications();

    expect(wrapper.vm.organisationLinks).toStrictEqual([
      { id: 1, organisation: { name: "work", id: 1 } },
      { organisation: { name: "test", id: 2 } },
    ]);
  });

  it("can create a new organisation", async () => {
    restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({
      data: {
        error: "I am an error",
      },
    });
    wrapper.vm.menus.newOrganisation.logoData = {
      data: "data:image/png;base64,AnotherTest",
    };
    wrapper.vm.menus.newOrganisation.data = {
      name: "test",
      homepage: "https://example.com/test",
      organisation_type_ids: [{ id: 1, name: "?" }],
      country_ids: [{ id: 1 }],
      parent_ror_links: [
        { id: "https:rororere.rere1" },
        { id: "https:rororere.rere2" },
      ],
      child_ror_links: [{ id: "https:rororere.rere3" }],
    };
    wrapper.vm.menus.newOrganisation.data.country_ids = [];
    await wrapper.vm.createNewOrganisation();
    expect(wrapper.vm.menus.newOrganisation.error).toBe("I am an error");

    wrapper.vm.menus.newOrganisation.logoData = null;
    restStub.returns({
      data: {
        data: {
          id: 1,
          attributes: {
            name: "test",
            relationships: [
              { type: "Parent", id: "https:rororere.rere1" },
              { type: "Parent", id: "https:rororere.rere2" },
              { type: "Child", id: "https:rororere.rere3" },
            ],
          },
          types: [{ name: "?" }],
        },
      },
    });

    // 2. Clear the store array to prevent test pollution!
    wrapper.vm.$store.state.editor.organisations = [];

    // 3. Test the success state
    await wrapper.vm.createNewOrganisation();

    // Now it will correctly equal an array of exactly 1 item
    expect(wrapper.vm.organisations).toStrictEqual([
      {
        id: 1,
        name: "test",
        types: ["?"],
        homepage: undefined,
        urlForLogo: undefined,
      },
    ]);

    restStub.restore();
  });

  it("can create a new grant", async () => {
    restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({
      data: {
        error: "I am an error",
      },
    });
    wrapper.vm.menus.newGrant.data = {
      name: "grant",
      description: "http://example.com/grant",
    };
    await wrapper.vm.createNewGrant();
    expect(wrapper.vm.menus.newGrant.error).toBe("I am an error");
    restStub.returns({
      data: {
        name: "grant",
        description: "another description",
        id: 123,
      },
    });
    await wrapper.vm.createNewGrant();
    expect(wrapper.vm.grants).toStrictEqual([
      {
        name: "grant",
        description: "another description",
        id: 123,
      },
    ]);
    restStub.restore();
  });

  it("can run a custom filter on autocompletes", () => {
    const mockItem = {
      raw: { name: "this", alternativeNames: [] },
    };
    expect(wrapper.vm.customFilter("this", "that", mockItem)).toBe(false);
    expect(wrapper.vm.customFilter("this", "this", mockItem)).toBe(true);
  });

  it("can check removeType", () => {
    wrapper.vm.menus.newOrganisation.data.organisation_type_ids = [
      { id: 1, label: "typeA" },
    ];
    wrapper.vm.removeType({ id: 1, label: "typeA" });
    expect(
      wrapper.vm.menus.newOrganisation.data.organisation_type_ids,
    ).toStrictEqual([]);
  });

  it("can check addNewOrganisation", () => {
    wrapper.vm.menus.show = "";
    wrapper.vm.enterName = false;
    wrapper.vm.importROR = true;
    wrapper.vm.addNewOrganisation();
    expect(wrapper.vm.menus.show).toBe("organisation");
    expect(wrapper.vm.enterName).toBe(true);
    expect(wrapper.vm.importROR).toBe(false);
  });

  it("can getOrganisations List", async () => {
    fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
    fetchStub.returns({ data: organisation });
    const expectedOrganisation = [
      {
        locations: [
          {
            geonames_details: {
              country_code: "GB",
              country_name: "Great Britain",
            },
          },
        ],
        links: [
          {
            type: "website",
            value: "http://www.obsmedical.com/",
          },
        ],
        names: [
          {
            types: ["ror_display"],
            value: "OBS Medical (United Kingdom)",
          },
        ],
        name: "OBS Medical (United Kingdom)",
        ror_link: "https:rororere.rere",
        types: ["company"],
        parent_ror_links: ["https:rororere.rere1", "https:rororere.rere2"],
        child_ror_links: ["https:rororere.rere3", "https:rororere.rere4"],
      },
    ];
    wrapper.vm.enterName = true;
    wrapper.vm.importROR = false;
    wrapper.vm.validName = true;
    wrapper.vm.menus.newOrganisation.data.name = "Oxford";
    wrapper.vm.menus.newOrganisation.data.child_ror_links[1] =
      "https:rororere.rere4";
    await wrapper.vm.getOrganisations();
    expect(wrapper.vm.enterName).toBe(false);
    expect(wrapper.vm.importROR).toBe(true);
    expect(wrapper.vm.validName).toBe(true);
    expect(wrapper.vm.organisationsList).toStrictEqual(expectedOrganisation);
    expect(wrapper.vm.organisationsNameList).toStrictEqual([
      "OBS Medical (United Kingdom)",
    ]);
    fetchStub.restore();
  });

  it("cannot getOrganisations List", async () => {
    const fetchOrganisation = {};
    fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
    fetchStub.returns({ data: fetchOrganisation });
    const expectedOrganisation = [];
    wrapper.vm.enterName = true;
    wrapper.vm.importROR = false;
    wrapper.vm.validName = true;
    wrapper.vm.menus.newOrganisation.data.name = "abc";
    await wrapper.vm.getOrganisations();
    expect(wrapper.vm.enterName).toBe(true);
    expect(wrapper.vm.importROR).toBe(false);
    expect(wrapper.vm.validName).toBe(false);
    expect(wrapper.vm.organisationsList).toStrictEqual(expectedOrganisation);
    fetchStub.restore();
  });

  it("can select selectOrganisation", () => {
    wrapper.vm.selectOrganisationFromList();
    expect(wrapper.vm.menus.newOrganisation.data.name).toBeUndefined();
    wrapper.vm.menus.newOrganisation.selectOrganisation = {
      ...structuredClone(organisation.items[0]),
      id: "https://ror.org/example",
      name: "OBS Medical (United Kingdom)",
      names: [
        ...organisation.items[0].names,
        { types: ["alias"], value: "OBS Medical" },
      ],
      relationships: [
        { type: "parent", id: "parent-id" },
        { type: "child", id: "child-id" },
      ],
    };
    wrapper.vm.selectOrganisationFromList();
    expect(wrapper.vm.menus.newOrganisation.data).toMatchObject({
      name: "OBS Medical (United Kingdom)",
      homepage: "http://www.obsmedical.com/",
      ror_link: "https://ror.org/example",
      alternative_names: ["OBS Medical"],
      organisation_type_ids: [{ id: 6, name: "Other" }],
      country_ids: [{ id: 44, name: "Great Britain", code: "gb" }],
      parent_ror_links: [{ type: "parent", id: "parent-id" }],
      child_ror_links: [{ type: "child", id: "child-id" }],
    });
  });

  it("can check clearForm", () => {
    wrapper.vm.enterName = false;
    wrapper.vm.importROR = true;
    wrapper.vm.validName = false;
    wrapper.vm.menus.newOrganisation.data.name = "xyz";
    wrapper.vm.clearForm();
    expect(wrapper.vm.enterName).toBe(true);
    expect(wrapper.vm.importROR).toBe(false);
    expect(wrapper.vm.validName).toBe(true);
    expect(wrapper.vm.menus.newOrganisation.data.name).toBe("");
  });

  it("validates image size", () => {
    // No logo -> Valid
    expect(wrapper.vm.imageSizeCorrect()).toBe(true);

    // Small logo -> Valid
    wrapper.vm.menus.newOrganisation.logo = { size: 100 };
    expect(wrapper.vm.imageSizeCorrect()).toBe(true);
    expect(wrapper.emitted().imageTooBig[0]).toEqual([false]);

    // Big logo -> Invalid (limit is 3145728)
    wrapper.vm.menus.newOrganisation.logo = { size: 4000000 };
    expect(wrapper.vm.imageSizeCorrect()).toBe(false);
    expect(wrapper.emitted().imageTooBig[1]).toEqual([true]);
  });

  it("selectTypes method for filter case IF condition", () => {
    /* Government */
    wrapper.vm.menus.newOrganisation.selectOrganisation = {
      types: ["Government"],
    };
    wrapper.vm.selectTypes();
    expect(
      wrapper.vm.menus.newOrganisation.data.organisation_type_ids,
    ).toStrictEqual([{ id: 1, name: "Government" }]);
  });

  it("selectTypes method for ELSE switch case", () => {
    /* Government */
    wrapper.vm.menus.newOrganisation.selectOrganisation = {
      types: ["government"],
    };
    wrapper.vm.selectTypes();
    expect(
      wrapper.vm.menus.newOrganisation.data.organisation_type_ids,
    ).toStrictEqual([{ id: 1, name: "Government" }]);

    /* Non profit */
    wrapper.vm.menus.newOrganisation.selectOrganisation = {
      types: ["nonprofit"],
    };
    wrapper.vm.selectTypes();
    expect(
      wrapper.vm.menus.newOrganisation.data.organisation_type_ids,
    ).toStrictEqual([{ id: 2, name: "Nonprofit" }]);

    /* education */
    wrapper.vm.menus.newOrganisation.selectOrganisation = {
      types: ["education"],
    };
    wrapper.vm.selectTypes();
    expect(
      wrapper.vm.menus.newOrganisation.data.organisation_type_ids,
    ).toStrictEqual([{ id: 3, name: "Education" }]);

    /* company */
    wrapper.vm.menus.newOrganisation.selectOrganisation = {
      types: ["company"],
    };
    wrapper.vm.selectTypes();
    expect(
      wrapper.vm.menus.newOrganisation.data.organisation_type_ids,
    ).toStrictEqual([{ id: 6, name: "Other" }]);

    /* healthcare */
    wrapper.vm.menus.newOrganisation.selectOrganisation = {
      types: ["healthcare"],
    };
    wrapper.vm.selectTypes();
    expect(
      wrapper.vm.menus.newOrganisation.data.organisation_type_ids,
    ).toStrictEqual([{ id: 9, name: "Other" }]);
  });

  const findButton = (text) => wrapper.findAll("button")
    .find((button) => button.text().trim().endsWith(text));
  const findAutocomplete = (label) => wrapper.findAllComponents({ name: "VAutocomplete" })
    .find((input) => input.props("label") === label);

  it("updates overlay visibility and validates its form when reopened", async () => {
    const overlay = wrapper.findComponent({ name: "VOverlay" });
    overlay.vm.$emit("update:modelValue", false);
    await flushPromises();
    expect(wrapper.vm.editOrganisationLink.showOverlay).toBe(false);
    expect(wrapper.find("#editOrganisationLink").exists()).toBe(false);
    formValidation.methods.validate.mockClear();
    overlay.vm.$emit("update:modelValue", true);
    await flushPromises();
    expect(wrapper.find("#editOrganisationLink").exists()).toBe(true);
    expect(formValidation.methods.validate).toHaveBeenCalledOnce();
  });

  it("selects an organisation and confirms the relationship through the form", async () => {
    const selected = { id: 2, name: "Selected institute", types: [] };
    findAutocomplete("Select an organisation").vm.$emit("update:modelValue", selected);
    wrapper.findComponent({ name: "VForm" }).vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    await findButton("Confirm").trigger("click");
    expect(wrapper.vm.organisationLinks[0]).toEqual({ id: 1, organisation: selected, relation: "maintains" });
    expect(wrapper.vm.editOrganisationLink.showOverlay).toBe(false);
  });

  it("cancels a relationship without modifying the saved links", async () => {
    const initialLinks = JSON.parse(JSON.stringify(wrapper.vm.organisationLinks));
    await findButton("Cancel").trigger("click");
    expect(wrapper.vm.organisationLinks).toEqual(initialLinks);
    expect(wrapper.vm.editOrganisationLink.data).toEqual({});
    expect(wrapper.vm.editOrganisationLink.showOverlay).toBe(false);
  });

  it("shows funding grants and removes the selected grant when the relationship changes", async () => {
    expect(findAutocomplete("Select an optional grant for funding organisations")).toBeUndefined();
    findAutocomplete("Select a type of relationship").vm.$emit("update:modelValue", "funds");
    await wrapper.vm.$nextTick();
    const grant = { id: 7, name: "Funding", description: "Research funding" };
    $store.state.editor.grants = [grant];
    findAutocomplete("Select an optional grant for funding organisations").vm.$emit("update:modelValue", grant);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.editOrganisationLink.data.grant).toEqual(grant);
    expect(wrapper.findAllComponents({ name: "VChip" }).map((chip) => chip.props("text"))).toContain("Funding");
    findAutocomplete("Select a type of relationship").vm.$emit("update:modelValue", "maintains");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.editOrganisationLink.data).not.toHaveProperty("grant");
    expect(findAutocomplete("Select an optional grant for funding organisations")).toBeUndefined();
  });

  it("opens the organisation form and binds its inputs and validity", async () => {
    expect(wrapper.find("#createNewOrganisation").exists()).toBe(false);
    await findButton("Add New").trigger("click");
    expect(formValidation.methods.validate).toHaveBeenCalled();
    await wrapper.find('input[aria-label="Organisation Name"]').setValue("New institute");
    await wrapper.find('input[aria-label="Organisation Homepage"]').setValue("https://example.org");
    findAutocomplete("Select an organisation type(s)").vm.$emit("update:modelValue", [{ id: 3, name: "Education", title: "Education" }]);
    findAutocomplete("Countries").vm.$emit("update:modelValue", [{ id: 44, name: "Great Britain" }]);
    wrapper.findAllComponents({ name: "VForm" })[1].vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.menus.newOrganisation.data).toMatchObject({
      name: "New institute", homepage: "https://example.org",
      organisation_type_ids: [{ id: 3, name: "Education", title: "Education" }],
      country_ids: [{ id: 44, name: "Great Britain" }],
    });
    expect(findButton("Save new organisation").attributes("disabled")).toBeUndefined();
    expect(findButton("Confirm").attributes("disabled")).toBeDefined();
    expect(wrapper.findAllComponents({ name: "VChip" }).map((chip) => chip.props("text"))).toEqual(expect.arrayContaining(["Education", "Great Britain"]));
    await findButton("Cancel").trigger("click");
    expect(wrapper.vm.menus.show).toBe(false);
  });

  it.each([false, true])("saves an organisation through its button with error=%s", async (error) => {
    restStub = sinon.stub(RestClient.prototype, "createOrganisation").resolves(error
      ? { error: { response: { data: "Organisation already exists" } } }
      : { data: { id: 8, attributes: { name: "New institute", homepage: "https://example.org", url_for_logo: "/logo.png" } } });
    await findButton("Add New").trigger("click");
    await wrapper.setData({ menus: { newOrganisation: {
      formValid: true,
      data: { name: "New institute", organisation_type_ids: [{ id: 3, name: "Education" }], country_ids: [{ id: 44 }] },
    } } });
    await findButton("Save new organisation").trigger("click");
    await flushPromises();
    expect(restStub.calledOnce).toBe(true);
    expect(restStub.firstCall.args).toEqual([
      expect.objectContaining({ name: "New institute", organisation_type_ids: [3], country_ids: [44] }),
      wrapper.vm.user().credentials.token,
    ]);
    expect(wrapper.vm.menus.newOrganisation.loading).toBe(false);
    if (error) {
      expect(wrapper.text()).toContain("Organisation already exists");
      expect(wrapper.vm.organisations).toHaveLength(1);
    }
    else {
      expect(wrapper.vm.editOrganisationLink.data.organisation).toMatchObject({ id: 8, types: ["Education"], urlForLogo: "/logo.png" });
      expect(wrapper.vm.organisations).toHaveLength(2);
      expect(wrapper.vm.menus.show).toBe(null);
    }
  });

  it.each([false, true])("creates a grant through its form with error=%s", async (error) => {
    restStub = sinon.stub(RestClient.prototype, "createGrant").resolves(error
      ? { error: { response: { data: "Grant already exists" } } }
      : { id: 7, name: "Research grant", description: "Funding" });
    findAutocomplete("Select a type of relationship").vm.$emit("update:modelValue", "funds");
    await wrapper.vm.$nextTick();
    const add = wrapper.findAll("button").find((button) => button.text().includes("fas fa-plus") && !button.text().includes("Add New"));
    await add.trigger("click");
    await wrapper.find('input[aria-label="Grant Name"]').setValue("Research grant");
    await wrapper.find('input[aria-label="Grant Description"]').setValue("Funding");
    wrapper.findAllComponents({ name: "VForm" })[1].vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.menus.newGrant.formValid).toBe(true);
    await findButton("Save new grant").trigger("click");
    await flushPromises();
    expect(restStub.calledOnceWithExactly({ name: "Research grant", description: "Funding" }, wrapper.vm.user().credentials.token)).toBe(true);
    expect(wrapper.vm.menus.newGrant.loading).toBe(false);
    if (error) expect(wrapper.text()).toContain("Grant already exists");
    else {
      expect(wrapper.vm.editOrganisationLink.data.grant).toEqual({ id: 7, name: "Research grant", description: "Funding" });
      expect(wrapper.vm.menus.show).toBe(null);
    }
  });

  it("cancels a new grant without sending an API request", async () => {
    restStub = sinon.stub(RestClient.prototype, "createGrant");
    wrapper.vm.relationValue = "funds";
    wrapper.vm.menus.show = "grant";
    await wrapper.vm.$nextTick();
    await findButton("Cancel").trigger("click");
    expect(wrapper.vm.menus.show).toBe(false);
    expect(restStub.called).toBe(false);
  });

  it("imports trimmed ROR searches and selects the returned organisation", async () => {
    fetchStub = sinon.stub(ExternalClient.prototype, "getROROrganisation").resolves({ items: [{
      ...structuredClone(organisation.items[0]),
      id: "https://ror.org/example",
      names: [{ types: ["alias"], value: "OBS" }, ...organisation.items[0].names],
      relationships: [{ type: "parent", id: "parent-id" }, { type: "child", id: "child-id" }],
    }] });
    await findButton("Add New").trigger("click");
    await wrapper.find('input[aria-label="Organisation Name"]').setValue("  Oxford  ");
    await findButton("Import from ROR").trigger("click");
    await flushPromises();
    expect(fetchStub.calledOnceWithExactly("Oxford")).toBe(true);
    expect(wrapper.vm.importROR).toBe(true);
    expect(findButton("Import from ROR").attributes("disabled")).toBeDefined();
    const choices = wrapper.findAllComponents({ name: "VAutocomplete" }).filter((input) => input.props("label") === "Select an organisation");
    choices[1].vm.$emit("update:modelValue", wrapper.vm.organisationsList[0]);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.menus.newOrganisation.data).toMatchObject({
      name: "OBS Medical (United Kingdom)", ror_link: "https://ror.org/example",
      alternative_names: ["OBS"], country_ids: [{ id: 44, name: "Great Britain", code: "gb" }],
      parent_ror_links: [{ type: "parent", id: "parent-id" }], child_ror_links: [{ type: "child", id: "child-id" }],
    });
    await findButton("Clear Form").trigger("click");
    expect(formValidation.methods.reset).toHaveBeenCalledOnce();
    expect(wrapper.vm.menus.newOrganisation.data.name).toBe("");
    expect(wrapper.vm.menus.newOrganisation.data.ror_link).toBe(null);
    expect(wrapper.vm.importROR).toBe(false);
  });

  it("shows the ROR no-match message and clears it on typing", async () => {
    fetchStub = sinon.stub(ExternalClient.prototype, "getROROrganisation").resolves({ items: [] });
    await findButton("Add New").trigger("click");
    await findButton("Import from ROR").trigger("click");
    await flushPromises();
    expect(wrapper.text()).toContain("No matching organisation found");
    expect(wrapper.vm.menus.newOrganisation.rorLoader).toBe(false);
    await wrapper.find('input[aria-label="Organisation Name"]').trigger("keydown");
    expect(wrapper.vm.validName).toBe(true);
    expect(wrapper.text()).not.toContain("No matching organisation found");
  });

  it("converts an uploaded logo and clears its payload when removed", async () => {
    const convert = vi.spyOn(generalUtils, "toBase64").mockResolvedValue("bG9nbw==");
    await findButton("Add New").trigger("click");
    const file = new File(["logo"], "logo.png", { type: "image/png" });
    const input = wrapper.findComponent({ name: "VFileInput" });
    input.vm.$emit("update:modelValue", file);
    await flushPromises();
    expect(convert).toHaveBeenCalledWith(file);
    expect(wrapper.vm.menus.newOrganisation.logoData).toEqual({ filename: "logo.png", content_type: "image/png", data: "bG9nbw==" });
    expect(wrapper.vm.logoLoading).toBe(false);
    input.vm.$emit("update:modelValue", null);
    await flushPromises();
    expect(wrapper.vm.menus.newOrganisation.logoData).toEqual({});
    expect(convert).toHaveBeenCalledOnce();
  });

  it("serialises logo and ROR relationships when saving an organisation", async () => {
    restStub = sinon.stub(RestClient.prototype, "createOrganisation").resolves({ error: { response: { data: "Save failed" } } });
    wrapper.vm.menus.newOrganisation.logoData = { filename: "logo.png", content_type: "image/png", data: "data:image/png;base64,bG9nbw==" };
    wrapper.vm.menus.newOrganisation.data.organisation_type_ids = [{ id: 3, name: "Education" }];
    wrapper.vm.menus.newOrganisation.data.parent_ror_links = [{ id: "parent-id" }];
    wrapper.vm.menus.newOrganisation.data.child_ror_links = [{ id: "child-id" }];
    await wrapper.vm.createNewOrganisation();
    expect(restStub.firstCall.args[0]).toMatchObject({
      logo: { filename: "logo.png", content_type: "image/png", data: "bG9nbw==" },
      organisation_type_ids: [3], parent_ror_links: ["parent-id"], child_ror_links: ["child-id"],
    });
    expect(wrapper.vm.menus.newOrganisation.error.response.data).toBe("Save failed");
  });

  it("matches organisation names and aliases without requiring alternativeNames", () => {
    expect(wrapper.vm.customFilter("", "RESEARCH", { raw: { name: "Institute", alternativeNames: ["Research centre"] } })).toBe(true);
    expect(wrapper.vm.customFilter("", "INSTITUTE", { raw: { name: "Institute" } })).toBe(true);
    expect(wrapper.vm.customFilter("", "missing", { raw: { name: "Institute" } })).toBe(false);
  });

  it("rejects a logo at the exact size limit", () => {
    wrapper.vm.menus.newOrganisation.logo = { size: wrapper.vm.allowedFileSize };
    expect(wrapper.vm.imageSizeCorrect()).toBe(false);
    expect(wrapper.vm.imageTooBig).toBe(true);
    expect(wrapper.emitted("imageTooBig")).toEqual([[true]]);
  });
});
