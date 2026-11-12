import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Contact from "@/components/Editor/GeneralInformation/Contact.vue";
import recordStore from "@/store/recordData.js";
import {
  VBtnStub,
  VFormStub,
  VIconStub,
  VOverlayStub,
  VTextFieldStub,
  VTooltipStub,
} from "../../../../stubs";

let contact = {
  contact_name: "jean",
  contact_email: "jean@test.com",
  contact_orcid: "0000-",
};
recordStore.state.sections = {
  generalInformation: {
    data: {
      metadata: {
        contacts: [contact],
      },
    },
    initialData: {
      metadata: {
        contacts: [{ field: "nothere" }],
      },
    },
  },
};
const $store = new Vuex.Store({
  modules: {
    record: recordStore,
  },
});

let wrapper;
const formValidation = {
  ...VFormStub,
  methods: { validate: vi.fn(() => true) },
};
const slotStub = { template: "<div><slot /></div>" };

describe("Editor -> Contact.vue", () => {
  beforeEach(() => {
    $store.state.record.sections.generalInformation.data.metadata.contacts = [
      structuredClone(contact),
    ];
    $store.state.record.sections.generalInformation.initialData.metadata.contacts =
      [{ field: "nothere" }];
    formValidation.methods.validate.mockClear();
    wrapper = shallowMount(Contact, {
      global: {
        plugins: [$store],
        stubs: {
          VForm: formValidation,
          VOverlay: VOverlayStub,
          VTextField: VTextFieldStub,
          VTooltip: VTooltipStub,
          VIcon: VIconStub,
          VBtn: VBtnStub,
          VChipGroup: slotStub,
          VChip: slotStub,
          VSpacer: true,
          VCard: slotStub,
          VCardTitle: slotStub,
          VCardText: slotStub,
          VCardActions: slotStub,
        },
      },
    });
  });

  afterEach(async () => {
    await flushPromises();
    wrapper.unmount();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("Contact");
    wrapper.vm.rules.isRequired();
    wrapper.vm.rules.isEmail();
    wrapper.vm.rules.isOrcid("0000");
    let contacts = [
      {
        contact_name: "jean",
        contact_email: "jean@test.com",
        contact_orcid: "0000-0000",
      },
    ];
    wrapper.vm.contacts = contacts;
    expect(
      wrapper.vm.getSection("generalInformation").data.metadata.contacts,
    ).toStrictEqual(contacts);
    expect(wrapper.vm.isNew({ field: "avc" })).toBe(true);
  });

  it("can create a new contact", () => {
    wrapper.vm.createNewContact();
    expect(wrapper.vm.submitted).toBe(false);
    expect(wrapper.vm.menu).toStrictEqual({
      show: true,
      label: "Create new contact point",
      index: null,
      content: {
        contact_name: null,
        contact_email: null,
        contact_orcid: null,
      },
    });
    wrapper.vm.formValid = true;
    wrapper.vm.menu.content = contact;
    wrapper.vm.addItem();
    expect(wrapper.vm.submitted).toBe(true);
  });

  it("can remove an existing contact", () => {
    wrapper.vm.contacts = [contact];
    wrapper.vm.removeContact(0);
    expect(wrapper.vm.contacts.length).toBe(0);
  });

  it("can edit an existing contact", () => {
    wrapper.vm.editContact(
      {
        contact_name: null,
        contact_email: null,
        contact_orcid: null,
      },
      0,
    );
    expect(wrapper.vm.menu).toStrictEqual({
      show: true,
      label: "Apply changes to contact point",
      index: 0,
      content: {
        contact_name: null,
        contact_email: null,
        contact_orcid: null,
      },
    });
    wrapper.vm.formValid = true;
    wrapper.vm.menu.content = contact;
    wrapper.vm.addItem();
    expect(wrapper.vm.submitted).toBe(true);
  });

  it("can add the contact", () => {
    wrapper.vm.addItem();
    expect(wrapper.vm.submitted).toBe(false);
  });

  it("handles formValid form v-model updates", async () => {
    await wrapper.setData({ formValid: false });
    expect(wrapper.vm.formValid).toBe(false);
    wrapper.findComponent(formValidation).vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.formValid).toBe(true);
  });

  it("renders saved and new contacts with optional ORCID values", async () => {
    const saved = { ...contact, contact_orcid: "0000-0000-0000-0001" };
    $store.state.record.sections.generalInformation.initialData.metadata.contacts =
      [saved];
    wrapper.vm.contacts = [
      saved,
      { ...contact, contact_name: "New", contact_orcid: "" },
    ];
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".bg-blue")).toHaveLength(1);
    expect(wrapper.findAll(".borderBlue")).toHaveLength(1);
    expect(wrapper.text()).toContain(
      "jean (jean@test.com): 0000-0000-0000-0001",
    );
    expect(wrapper.find(".borderBlue").text()).toContain("New (jean@test.com)");
    expect(wrapper.vm.isNew({ ...saved })).toBe(false);
  });

  it("creates a contact through the form fields and submit event", async () => {
    await wrapper.find(".shadowChip").trigger("click");
    await flushPromises();
    expect(formValidation.methods.validate).toHaveBeenCalledTimes(1);
    expect(
      wrapper.find("button.bg-success").attributes("disabled"),
    ).toBeDefined();
    await wrapper.find('[aria-label="Contact Name"]').setValue("Alice");
    await wrapper
      .find('[aria-label="Contact Email"]')
      .setValue("alice@example.org");
    await wrapper
      .find('[aria-label="Contact ORCID"]')
      .setValue("0000-0000-0000-0001");
    wrapper.findComponent(formValidation).vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    await wrapper.find("form").trigger("submit");
    expect(wrapper.vm.contacts).toHaveLength(2);
    expect(wrapper.vm.contacts[1]).toEqual({
      contact_name: "Alice",
      contact_email: "alice@example.org",
      contact_orcid: "0000-0000-0000-0001",
    });
    expect(wrapper.vm.menu.show).toBe(false);
    expect(wrapper.vm.submitted).toBe(true);
    expect(formValidation.methods.validate).toHaveBeenCalledTimes(1);
  });

  it("edits a nonzero contact index without changing the original before saving", async () => {
    wrapper.vm.contacts = [
      structuredClone(contact),
      { ...contact, contact_name: "Second" },
    ];
    await wrapper.vm.$nextTick();
    await wrapper
      .findAllComponents(VIconStub)
      .filter((icon) => icon.text() === "fas fa-pen")
      .at(1)
      .trigger("click");
    await flushPromises();
    await wrapper.find('[aria-label="Contact Name"]').setValue("Updated");
    expect(wrapper.vm.contacts[1].contact_name).toBe("Second");
    wrapper.findComponent(formValidation).vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    await wrapper.find("button.bg-success").trigger("click");
    expect(wrapper.vm.contacts.map((c) => c.contact_name)).toEqual([
      "jean",
      "Updated",
    ]);
    expect(wrapper.vm.menu.show).toBe(false);
  });

  it("opens editing from the contact label and cancels without saving", async () => {
    const label = wrapper
      .findAll("span")
      .find((el) => el.text() === "jean (jean@test.com): 0000-");
    await label.trigger("click");
    await flushPromises();
    await wrapper
      .find('[aria-label="Contact Email"]')
      .setValue("changed@example.org");
    await wrapper.find("button.bg-error").trigger("click");
    expect(wrapper.vm.contacts[0].contact_email).toBe("jean@test.com");
    expect(wrapper.vm.menu.show).toBe(false);
    expect(wrapper.vm.submitted).toBe(false);
  });

  it("removes a contact through its remove icon", async () => {
    await wrapper
      .findAllComponents(VIconStub)
      .find((icon) => icon.text() === "fas fa-times-circle")
      .trigger("click");
    expect(wrapper.vm.contacts).toEqual([]);
    expect(wrapper.findAll(".borderBlue")).toHaveLength(0);
  });

  it("does not append invalid or already submitted contacts", () => {
    wrapper.vm.createNewContact();
    wrapper.vm.addItem();
    expect(wrapper.vm.contacts).toHaveLength(1);
    expect(wrapper.vm.menu.show).toBe(true);
    wrapper.vm.formValid = true;
    wrapper.vm.menu.content = { ...contact, contact_name: "Once" };
    wrapper.vm.addItem();
    wrapper.vm.addItem();
    expect(wrapper.vm.contacts.map((c) => c.contact_name)).toEqual([
      "jean",
      "Once",
    ]);
  });

  it("exposes required, email and optional ORCID validation rules", () => {
    expect(wrapper.vm.rules.isRequired()("")).toBe("Required");
    expect(wrapper.vm.rules.isRequired()("Alice")).toBe(true);
    expect(wrapper.vm.rules.isEmail()("invalid")).toBe("Invalid e-mail.");
    expect(wrapper.vm.rules.isEmail()("alice@example.org")).toBe(true);
    expect(wrapper.vm.rules.isOrcid(false)("")).toBe(true);
    expect(wrapper.vm.rules.isOrcid(false)("invalid")).toBe(
      "Doesn't look like a valid ORCID ID.",
    );
  });

  it("closes the overlay through its v-model without saving the draft", async () => {
    wrapper.vm.createNewContact();
    await flushPromises();
    wrapper.findComponent(VOverlayStub).vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.menu.show).toBe(false);
    expect(wrapper.vm.contacts).toHaveLength(1);
    expect(wrapper.find('[aria-label="Contact Name"]').exists()).toBe(false);
  });
});
