import { beforeEach, describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import EditLicenceLinks from "@/components/Editor/DataAccess/EditLicenceLinks.vue";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
import {
  VAutocompleteStub,
  VBtnStub,
  VDialogStub,
  VFormStub,
  VSwitchStub,
  VTextFieldStub,
  VTooltipStub,
} from "../../../../stubs/index.js";
import { VIconStub } from "../../../../stubs/VIconStub.js";

let $route = { path: "/123/edit", params: { id: 123 } };

const mockDataAccessData = {
  exhaustiveLicences: true,
  licences: [{ id: 1, name: "MIT" }],
};

recordStore.state.sections = {
  dataAccess: {
    data: {
      licences: [
        { id: 222, name: "test", licence: { id: 123, name: "myLicence" } },
      ],
    },
    initialData: {
      licences: [
        { id: 222, name: "test", licence: { id: 123, name: "myLicence" } },
      ],
    },
  },
};
recordStore.getters = {
  getSection: () => (sectionName) => {
    if (sectionName === "dataAccess") {
      return { data: mockDataAccessData };
    }
    return { data: {} };
  },
};
editorStore.state.availableLicences = [
  { id: 222, name: "test", licence: { id: 123 } },
];
const $store = new Vuex.Store({
  modules: {
    editor: editorStore,
    record: recordStore,
  },
});
let wrapper;

describe("Edit -> EditLicenceLinks.vue", function () {
  beforeEach(async () => {
    wrapper = await shallowMount(EditLicenceLinks, {
      global: {
        plugins: [$store],
        mocks: { $route },
        stubs: {
          VForm: VFormStub,
          VAutocomplete: VAutocompleteStub,
          VTextField: VTextFieldStub,
          VIcon: VIconStub,
          VTooltip: VTooltipStub,
          VDialog: VDialogStub,
          VBtn: VBtnStub,
          VSwitch: VSwitchStub,
          VContainer: {
            template: "<div><slot /></div>",
          },
          VRow: {
            template: "<div><slot /></div>",
          },
          VChipGroup: {
            template: "<div><slot /></div>",
          },
          VChip: {
            name: "VChip",
            template: '<div v-bind="$attrs"><slot /></div>',
          },
        },
      },
    });
  });

  it("can be mounted", () => {
    wrapper.vm.rules.isRequired();
    wrapper.vm.rules.isUrl();
    expect(wrapper.vm.$options.name).toMatch("EditLicences");
    expect(wrapper.vm.isNew({ field: "test" })).toBe(true);
    expect(wrapper.vm.cleanTextList).toHaveBeenCalled;
  });

  it("can display the overlay", () => {
    wrapper.vm.showCreator = true;
    wrapper.vm.showEditItem(0);
    expect(wrapper.vm.edit).toStrictEqual({
      show: true,
      template: {
        licence: { name: "myLicence", id: 123 },
        target: 222,
        relation: undefined,
      },
      id: 0,
    });
    wrapper.vm.showEditItem();
    expect(wrapper.vm.edit).toStrictEqual({
      show: true,
      id: null,
      template: { relation: null, target: null },
    });
  });

  it("can hide the overlay", () => {
    wrapper.vm.hideEdit();
    expect(wrapper.vm.edit).toStrictEqual({
      show: false,
      id: null,
      template: null,
    });
    expect(wrapper.vm.showCreator).toBe(false);
  });

  it("can create a new licence", () => {
    wrapper.vm.newLicence = { name: "why not?" };
    wrapper.vm.edit.template = {};
    wrapper.vm.createNewLicence();
    expect(wrapper.vm.edit.template).toStrictEqual({
      licence: { name: "why not?" },
    });
    expect(wrapper.vm.showCreator).toBe(false);
    expect(wrapper.vm.newLicence).toStrictEqual({
      name: null,
      url: null,
    });
  });

  it("can remove a licence link", () => {
    wrapper.vm.removeLicenceLink(1);
    expect(recordStore.state.sections.dataAccess.data.licences.length).toBe(1);
    wrapper.vm.removeLicenceLink(0);
    expect(recordStore.state.sections.dataAccess.data.licences.length).toBe(0);
  });

  it("can check fields computed property", () => {
    expect(wrapper.vm.fields).toEqual(mockDataAccessData);
  });

  it("covers existing and new licence chips and their click handlers", async () => {
    const existing = {
      id: 222,
      relation: "supports",
      licence: {
        id: 123,
        name: "myLicence",
      },
    };

    const added = {
      id: 333,
      relation: "undefined",
      licence: {
        id: 456,
        name: "New Licence",
      },
    };

    $store.state.record.sections.dataAccess.data.licences = [existing, added];

    $store.state.record.sections.dataAccess.initialData.licences = [
      structuredClone(existing),
    ];
    await wrapper.vm.$nextTick();

    const chips = wrapper
      .findAll(".pr-5")
      .filter(
        (chip) =>
          chip.text().includes("myLicence") ||
          chip.text().includes("New Licence"),
      );
    expect(chips).toHaveLength(2);

    const existingChip = chips.find((chip) =>
      chip.text().includes("myLicence"),
    );
    const newChip = chips.find((chip) => chip.text().includes("New Licence"));
    expect(existingChip).toBeDefined();
    expect(newChip).toBeDefined();
    // Existing licence uses bg-blue
    expect(existingChip.classes()).toContain("bg-blue");
    // New licence uses borderBlue
    expect(newChip.classes()).toContain("borderBlue");

    // Relation is displayed when defined
    expect(existingChip.text()).toContain("(supports)");
    // Literal "undefined" relation is hidden
    expect(newChip.text()).not.toContain("(undefined)");
    // Cover @click="showEditItem(index)" on the licence name
    const editSpy = vi.spyOn(wrapper.vm, "showEditItem");
    const licenceName = existingChip
      .findAll("div")
      .find((element) => element.text().includes("myLicence"));
    expect(licenceName).toBeDefined();

    await licenceName.trigger("click");
    expect(editSpy).toHaveBeenCalledWith(0);
    expect(wrapper.vm.edit.show).toBe(true);

    // Cover @click="removeLicenceLink(index)"
    const removeIcon = newChip
      .findAllComponents({ name: "VIcon" })
      .find((icon) => icon.text().includes("fa-times-circle"));
    expect(removeIcon).toBeDefined();

    await removeIcon.trigger("click");
    expect($store.state.record.sections.dataAccess.data.licences).toHaveLength(
      1,
    );
    expect(
      $store.state.record.sections.dataAccess.data.licences[0].licence.name,
    ).toBe("myLicence");
  });

  it("opens licence editor when pencil icon is clicked", async () => {
    $store.state.record.sections.dataAccess.data.licences = [
      {
        id: 222,
        relation: "supports",
        licence: {
          id: 123,
          name: "myLicence",
        },
      },
    ];

    await wrapper.vm.$nextTick();
    const editIcon = wrapper
      .findAllComponents({ name: "VIcon" })
      .find((icon) => icon.text().includes("fa-pen"));
    expect(editIcon).toBeDefined();

    await editIcon.trigger("click");
    expect(wrapper.vm.edit.show).toBe(true);
    expect(wrapper.vm.edit.id).toBe(0);
    expect(wrapper.vm.edit.template).toEqual({
      relation: "supports",
      target: 222,
      licence: {
        id: 123,
        name: "myLicence",
      },
    });
  });

  it("opens new licence dialog and updates dialog v-model", async () => {
    const addChip = wrapper
      .findAll(".shadowChip")
      .find((chip) => chip.text().includes("Add a new licence"));

    expect(addChip).toBeDefined();

    await addChip.trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.edit.show).toBe(true);
    expect(wrapper.vm.edit.id).toBeNull();

    const dialog = wrapper.findComponent({ name: "VDialog" });

    expect(dialog.exists()).toBe(true);
    expect(dialog.props("modelValue")).toBe(true);

    dialog.vm.$emit("update:modelValue", false);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.edit.show).toBe(false);
  });

  it("updates licence selection and form validation in edit dialog", async () => {
    $store.state.record.sections.dataAccess.data.licences = [
      {
        id: 222,
        relation: "supports",
        licence: {
          id: 123,
          name: "myLicence",
        },
      },
    ];

    await wrapper.vm.$nextTick();

    wrapper.vm.showEditItem(0);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.edit.show).toBe(true);

    const dialog = wrapper.find('[data-test="v-dialog"]');

    expect(dialog.exists()).toBe(true);

    const form = wrapper.findComponent({ name: "VForm" });

    expect(form.exists()).toBe(true);

    form.vm.$emit("update:modelValue", true);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.formValid.link).toBe(true);

    const autocomplete = wrapper
      .findAllComponents({ name: "VAutocomplete" })
      .find(
        (component) => component.props("label") === "Select the Licence name",
      );

    expect(autocomplete).toBeDefined();

    const selectedLicence = {
      id: 456,
      name: "New Licence",
    };

    autocomplete.vm.$emit("update:modelValue", selectedLicence);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.edit.template.licence).toEqual(selectedLicence);
  });

  it("covers relation v-model, dialog cancel and exhaustive switch", async () => {
    wrapper.vm.showEditItem(0);

    await wrapper.vm.$nextTick();

    const relation = wrapper
      .findAllComponents({ name: "VAutocomplete" })
      .find((input) => input.props("label") === "Select the Licence relation");

    expect(relation).toBeDefined();

    relation.vm.$emit("update:modelValue", "Supports");

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.edit.template.relation).toBe("Supports");

    const cancel = wrapper
      .findAll("button.bg-error")
      .find((button) => button.text().trim() === "Cancel");

    expect(cancel).toBeDefined();

    await cancel.trigger("click");

    expect(wrapper.vm.edit.show).toBe(false);

    const exhaustive = wrapper.findComponent({ name: "VSwitch" });

    expect(exhaustive.exists()).toBe(true);

    exhaustive.vm.$emit("update:modelValue", false);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.fields.exhaustiveLicences).toBe(false);
  });

  it("renders Edit when editing the second licence", async () => {
    $store.state.record.sections.dataAccess.data.licences = [
      {
        id: 111,
        relation: "supports",
        licence: { id: 1, name: "Licence A" },
      },
      {
        id: 222,
        relation: "supports",
        licence: { id: 2, name: "Licence B" },
      },
    ];

    wrapper.vm.showEditItem(1);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.edit.id).toBe(1);

    const title = wrapper.find(".bg-green.text-white");

    expect(title.text()).toContain("fas fa-plus-circle  Add a new licence");
  });

  it("covers creator toggle, form validation and new licence inputs", async () => {
    wrapper.vm.showEditItem(0);

    await wrapper.vm.$nextTick();

    const createToggle = wrapper.find("button.bg-green.mt-2.ml-2");

    expect(createToggle.exists()).toBe(true);

    await createToggle.trigger("click");

    expect(wrapper.vm.showCreator).toBe(true);

    const forms = wrapper.findAllComponents({ name: "VForm" });

    expect(forms.length).toBeGreaterThanOrEqual(2);

    forms[1].vm.$emit("update:modelValue", true);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.formValid.licence).toBe(true);

    const nameField = wrapper
      .findAllComponents({ name: "VTextField" })
      .find((component) => component.props("label") === "Licence's name");

    const urlField = wrapper
      .findAllComponents({ name: "VTextField" })
      .find((component) => component.props("label") === "Licence's URL");

    expect(nameField).toBeDefined();
    expect(urlField).toBeDefined();

    nameField.vm.$emit("update:modelValue", "New Licence");

    urlField.vm.$emit("update:modelValue", "https://example.org/licence");

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.newLicence).toEqual({
      name: "New Licence",
      url: "https://example.org/licence",
    });
  });

  it("covers Create new licence and Cancel button clicks", async () => {
    wrapper.vm.showEditItem(0);
    await wrapper.vm.$nextTick();

    // Open the new licence form
    const openCreator = wrapper.get("button.bg-green.mt-2.ml-2");

    await openCreator.trigger("click");

    expect(wrapper.vm.showCreator).toBe(true);

    // Set valid licence details
    await wrapper.setData({
      newLicence: {
        name: "Example Licence",
        url: "https://example.org/licence",
      },
      formValid: {
        link: false,
        licence: true,
      },
    });

    // Cover @click="createNewLicence()"
    const createButton = wrapper
      .findAll("button.bg-success")
      .find((button) => button.text().trim() === "Create new licence");

    expect(createButton).toBeDefined();
    expect(createButton.attributes("disabled")).toBeUndefined();

    await createButton.trigger("click");

    expect(wrapper.vm.showCreator).toBe(false);

    expect(wrapper.vm.edit.template.licence).toEqual({
      name: "Example Licence",
      url: "https://example.org/licence",
    });

    // Reopen the form to cover Cancel
    await openCreator.trigger("click");

    expect(wrapper.vm.showCreator).toBe(true);

    // Cover @click="showCreator = false"
    const cancelButton = wrapper
      .findAll("button.bg-error")
      .find((button) => button.text().trim() === "Cancel");

    expect(cancelButton).toBeDefined();

    await cancelButton.trigger("click");

    expect(wrapper.vm.showCreator).toBe(false);
  });

  it("covers Submit licence link button click", async () => {
    wrapper.vm.showEditItem();

    await wrapper.vm.$nextTick();

    await wrapper.setData({
      formValid: {
        link: true,
        licence: false,
      },
      edit: {
        show: true,
        id: null,
        template: {
          licence: {
            id: 123,
            name: "myLicence",
          },
          relation: "Supports",
          target: null,
        },
      },
      showCreator: false,
    });

    const submitButton = wrapper
      .findAll("button.bg-success")
      .find((button) => button.text().includes("licence link"));

    expect(submitButton).toBeDefined();
    expect(submitButton.attributes("disabled")).toBeUndefined();

    await submitButton.trigger("click");

    expect(wrapper.vm.edit.show).toBe(false);
    expect(wrapper.vm.currentLicences.at(-1).relation).toBe("supports");
  });
});
