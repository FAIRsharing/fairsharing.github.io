import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import additionalInformationFixture from "@/../tests/fixtures/additionalInformation.json";
import EditAdditionalInfo from "@/components/Editor/AdditionalInformation/EditAdditionalInfo.vue";
import RestClient from "@/lib/Client/RESTClient.js";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
import userStore from "@/store/users.js";
import {
  VAutocompleteStub,
  VBtnStub,
  VCheckBoxStub,
  VOverlayStub,
  VTextFieldStub,
  VTooltipStub,
} from "../../../../stubs/index.js";
import { VIconStub } from "../../../../stubs/VIconStub.js";

const sinon = require("sinon");

const mockSortObj = (obj) => obj;
const $store = new Vuex.Store({
  modules: {
    record: recordStore,
    users: userStore,
    editor: editorStore,
  },
});
$store.state.users.user = function () {
  return { credentials: { token: "123" } };
};
let $route = { params: { id: "123" } };
const $router = { push: vi.fn() };
const $scrollTo = vi.fn();
const template = {
  url: {
    type: "string",
    format: "uri",
    minLength: 1,
    description: "The URL at which the named data process can be found.",
  },
  anotherField: {},
};

let editAdditionalInfo;

describe("EditAdditionalInfo.vue", function () {
  let wrapper;

  beforeAll(() => {
    editAdditionalInfo = {
      name: "v-form",
      props: ["modelValue"],
      emits: ["update:modelValue"],
      template: "<form><slot /></form>",
      methods: {
        validate: () => true,
      },
      data() {
        return {};
      },
    };
  });

  beforeEach(() => {
    $store.state.record.sections.additionalInformation = {
      data: JSON.parse(JSON.stringify(additionalInformationFixture.data)),
      initialData: JSON.parse(
        JSON.stringify(additionalInformationFixture.data),
      ),
      error: false,
      message: null,
      changes: 0,
    };
    $store.state.editor.allowedFields = additionalInformationFixture.schema;
    wrapper = shallowMount(EditAdditionalInfo, {
      global: {
        plugins: [$store],
        mocks: { $route, $router, $scrollTo, sortObj: mockSortObj },
        stubs: {
          VCard: {
            template: "<div><slot /></div>",
          },

          VCardText: {
            template: "<div><slot /></div>",
          },

          VCardActions: {
            template: "<div><slot /></div>",
          },
          "router-link": true,
          "v-form": editAdditionalInfo,
          VTextField: VTextFieldStub,
          "v-text-field": VTextFieldStub,
          VTooltip: VTooltipStub,
          VIcon: VIconStub,
          VBtn: VBtnStub,
          VOverlay: VOverlayStub,
          VCheckBox: VCheckBoxStub,
          VAutocomplete: VAutocompleteStub,
        },
      },
    });
    $router.push.mockClear();
    $scrollTo.mockClear();
  });

  it("can be mounted without allowed fields", () => {
    expect(wrapper.vm.$options.name).toMatch("EditAdditionalInfo");
  });

  it("can be mounted with allowed fields", () => {
    $store.state.editor.allowedFields = additionalInformationFixture.schema;
    expect(wrapper.vm.$options.name).toMatch("EditAdditionalInfo");
  });

  it("sets isPolicy to TRUE when id includes 'policy'", () => {
    $store.state.editor.allowedFields = { id: "policy" };
    const policyWrapper = shallowMount(EditAdditionalInfo, {
      global: {
        plugins: [$store],
        mocks: { $route, $router, $scrollTo, sortObj: mockSortObj },
        stubs: { "router-link": true, "v-form": editAdditionalInfo },
      },
    });
    expect(policyWrapper.vm.isPolicy).toBe(true);
  });

  it("can show/hide an overlay", () => {
    wrapper.vm.showOverlay(1, "abc", { schema: "schema" }, template, []);
    expect(wrapper.vm.overlay).toStrictEqual({
      show: true,
      id: 1,
      fieldName: "abc",
      template: template,
      fields: { schema: "schema" },
      required: [],
    });
    wrapper.vm.showOverlay(1, "abc", { schema: "schema" }, { abc: {} }, [
      "abc",
    ]);
    expect(wrapper.vm.rules("abc", ["abc"]).length).toBe(1);
    wrapper.vm.hideOverlay();
    expect(wrapper.vm.overlay).toStrictEqual({
      show: false,
      id: null,
      fieldName: null,
      fields: null,
      template: null,
    });
  });

  it("can add and remove an item", () => {
    wrapper.vm.overlay.fieldName = "contacts";
    wrapper.vm.overlay.id = 1;
    wrapper.vm.fieldValue = null;
    wrapper.vm.addItem();
    expect(wrapper.vm.fields.contacts[1]).toBe(null);
    wrapper.vm.removeItem("contacts", 1);
    expect(wrapper.vm.fields.contacts[1]).toBe(undefined);
    wrapper.vm.overlay.fieldName = "testField";
    wrapper.vm.overlay.id = null;
    wrapper.vm.addItem();
    expect(wrapper.vm.fields["testField"]).toStrictEqual([null]);
    wrapper.vm.overlay.fieldName = "contacts";
    wrapper.vm.addItem();
    expect(wrapper.vm.fields.contacts[1]).toBe(null);
  });

  it("can save the record", async () => {
    const btn = { textContent: "Save and continue" };
    vi.spyOn(console, "warn").mockImplementation(() => {});
    $store.state.editor.allowedFields = additionalInformationFixture.schema;
    let restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({ data: "Hello !" });
    await wrapper.vm.saveRecord(true, btn);
    expect(wrapper.vm.message.error).toBe(false);
    expect(wrapper.vm.message.value).toBe("Record successfully updated!");
    restStub.restore();

    restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({ data: { error: "I am an error" } });
    await wrapper.vm.saveRecord(true, btn);
    expect($store.state.record.sections.additionalInformation.error).toBe(true);
    expect($store.state.record.sections.additionalInformation.message).toBe(
      "I am an error",
    );
    restStub.restore();

    vi.clearAllMocks();
  });

  it("handles save and exit with redirect", async () => {
    const btn = { textContent: "Save and exit" };
    const restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({ data: "Hello !" });
    await wrapper.vm.saveRecord(true, btn);
    expect(wrapper.vm.message.error).toBe(false);
    expect($router.push).toHaveBeenCalledWith({ path: "/123" });
    restStub.restore();
  });

  it("can react to fields changing value", async () => {
    wrapper.vm.fields.dataset_citation = "no";
    wrapper.vm.submitChanges(wrapper.vm.fields);
    expect($store.state.record.sections.additionalInformation.changes).toBe(1);
  });

  it("sorts object fields so URL is shown last", () => {
    expect(
      wrapper.vm.sortObject({ url: "fun", name: "more fun" }),
    ).toStrictEqual({ name: "more fun", url: "fun" });
  });

  it("can check rules() method", async () => {
    await wrapper.setData({
      overlay: {
        show: true,
        id: null,
        fieldName: "test",
        fields: {
          website: "",
          name: "",
        },
        required: ["website", "name"],
        template: {
          website: { format: "uri" },
          name: { format: "string" },
        },
      },
    });

    const bothRules = wrapper.vm.rules("website", ["website", "other"]);
    expect(bothRules).toHaveLength(2);
    expect(bothRules[0]("not a url")).toBe("Invalid URL.");
    expect(bothRules[1]("")).toBe("Required");

    // CASE 2: Only URI rule
    const uriOnly = wrapper.vm.rules("website", ["other"]);
    expect(uriOnly).toHaveLength(1);
    expect(uriOnly[0]("not a url")).toBe("Invalid URL.");

    // CASE 3: Only Required rule (and handles format being undefined)
    const requiredOnly = wrapper.vm.rules("name", ["name"]);
    expect(requiredOnly).toHaveLength(1);
    expect(requiredOnly[0]("")).toBe("Required");

    // CASE 4: No rules (not a URI and not required)
    const noRules = wrapper.vm.rules("name", ["other"]);
    expect(noRules).toHaveLength(0);

    // CASE 5: Required is null (covers the 'required &&' check)
    const nullRequired = wrapper.vm.rules("name", null);
    expect(nullRequired).toHaveLength(0);
  });

  it("handles formValid form v-model updates", async () => {
    await wrapper.setData({ formValid: false });
    const form = wrapper.findComponent({ name: "v-form" });
    expect(form.props("modelValue")).toBe(false);
    await form.vm.$emit("update:modelValue", true);
    expect(wrapper.vm.formValid).toBe(true);
  });

  describe("getFields()", () => {
    it("returns empty object if allowedFields or properties are missing (Guard Clause)", () => {
      // Case A: allowedFields is null
      $store.state.editor.allowedFields = null;
      expect(wrapper.vm.getFields("string")).toEqual({});

      // Case B: allowedFields exists but properties is undefined
      $store.state.editor.allowedFields = { id: "test" };
      expect(wrapper.vm.getFields("string")).toEqual({});
    });

    it("returns fields that match the type AND have no enum (Standard Match)", () => {
      $store.state.editor.allowedFields = {
        properties: {
          // Should match 'array'
          targetField: { type: "array", description: "matches" },
          // Should NOT match (wrong type)
          otherField: { type: "string" },
          // Should NOT match (has enum, so it fails the !enum check)
          enumField: { type: "array", enum: ["a", "b"] },
        },
      };

      const result = wrapper.vm.getFields("array");

      expect(result).toHaveProperty("targetField");
      expect(result).not.toHaveProperty("otherField");
      expect(result).not.toHaveProperty("enumField");
    });

    it("returns fields if type is 'string' AND it has an enum (Enum Branch)", () => {
      $store.state.editor.allowedFields = {
        properties: {
          // Should match (type is string + has enum)
          statusField: { type: "string", enum: ["Active", "Inactive"] },
          // Should match (type is string + no enum -> hits the FIRST if block)
          textField: { type: "string" },
          // Current implementation matches any enum value when type === "string"
          numberField: { type: "integer", enum: [1, 2] },
        },
      };

      const result = wrapper.vm.getFields("string");

      // Hits 'else if (type === "string" && ...enum)'
      expect(result).toHaveProperty("statusField");
      // Hits 'if (...type === type && !...enum)'
      expect(result).toHaveProperty("textField");
      // Current behavior includes enum fields regardless of their own type
      expect(result).toHaveProperty("numberField");
    });

    it("ignores fields that have an enum but are NOT strings", () => {
      // This covers the specific gap where the first IF fails (has enum)
      // and the ELSE IF fails (type is not string)
      $store.state.editor.allowedFields = {
        properties: {
          // Logic: type matches 'integer', but !enum is false.
          // Then else-if checks type === 'string', which is false.
          badEnum: { type: "integer", enum: [1, 2, 3] },
        },
      };

      const result = wrapper.vm.getFields("integer");
      expect(result).toEqual({});
    });
  });

  it("renders array subfields including champion registry Yes and No values", async () => {
    //Test case for line 97 <span v-if="subfieldName === 'in_champion_registry'">
    // Define an array field with a valid schema.

    $store.state.editor.allowedFields = {
      id: "test",
      properties: {
        contacts: {
          type: "array",
          description: "Contact information",
          items: {
            $ref: "#/definitions/contact",
          },
        },
      },
      definitions: {
        contact: {
          properties: {
            name: {
              type: "string",
            },
            in_champion_registry: {
              type: "boolean",
            },
          },
          required: [],
        },
      },
    };

    // Populate the array with records covering both boolean outcomes.
    $store.state.record.sections.additionalInformation.data.contacts = [
      {
        name: "Contact A",
        in_champion_registry: true,
      },
      {
        name: "Contact B",
        in_champion_registry: false,
      },
    ];

    await wrapper.vm.$nextTick();

    const text = wrapper.text();

    // True branch: champion registry is true.
    expect(text).toContain("Yes");

    // False branch: champion registry is false.
    expect(text).toContain("No");

    // Non-boolean subfield branch.
    expect(text).toContain("Contact A");
    expect(text).toContain("Contact B");
  });

  it("covers createItem click with required and optional fields", async () => {
    const properties = {
      name: {
        type: "string",
      },
      in_champion_registry: {
        type: "boolean",
      },
    };

    $store.state.editor.allowedFields = {
      id: "test",
      properties: {
        contacts: {
          type: "array",
          description: "Contact information",
          items: {
            $ref: "#/definitions/contact",
          },
        },
      },
      definitions: {
        contact: {
          properties,
          required: ["name"],
        },
      },
    };

    await wrapper.vm.$nextTick();

    const createIcon = wrapper
      .findAll('[data-test="v-icon"]')
      .find((icon) => icon.text().includes("fa-plus-circle"));

    expect(createIcon).toBeDefined();

    await createIcon.trigger("click");

    expect(wrapper.vm.overlay.show).toBe(true);
    expect(wrapper.vm.overlay.fieldName).toBe("contacts");
    expect(wrapper.vm.overlay.id).toBeNull();

    expect(wrapper.vm.overlay.template).toEqual(properties);
    expect(wrapper.vm.overlay.required).toEqual(["name"]);

    expect(wrapper.vm.overlay.fields).toEqual({
      name: "",
      in_champion_registry: false,
    });
  });

  it("removes an array item when the Delete button is clicked", async () => {
    $store.state.editor.allowedFields = {
      id: "test",
      properties: {
        contacts: {
          type: "array",
          description: "Contact information",
          items: {
            $ref: "#/definitions/contact",
          },
        },
      },
      definitions: {
        contact: {
          properties: {
            name: {
              type: "string",
            },
          },
          required: [],
        },
      },
    };

    $store.state.record.sections.additionalInformation.data.contacts = [
      { name: "Contact A" },
      { name: "Contact B" },
    ];

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.fields.contacts).toHaveLength(2);
    const deleteButtons = wrapper
      .findAll("button.bg-error")
      .filter((button) => button.text().includes("fa-trash"));
    expect(deleteButtons).toHaveLength(2);
    await deleteButtons[0].trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.fields.contacts).toHaveLength(1);
    expect(wrapper.vm.fields.contacts[0]).toEqual({
      name: "Contact B",
    });
  });

  it("renders enum fields when the schema contains enum type fields", async () => {
    const enumField = {
      type: "enum",
      description: "Test enum field",
    };

    $store.state.editor.allowedFields = {
      id: "test",
      properties: {
        test_status: enumField,
      },
    };

    await wrapper.vm.$nextTick();

    expect(Object.keys(wrapper.vm.getFields("enum"))).toHaveLength(1);

    expect(wrapper.text()).toContain("BASE FIELDS:");

    const fieldInputs = wrapper.findAllComponents({
      name: "FieldInput",
    });

    const enumInput = fieldInputs.find(
      (field) => field.props("fieldName") === "test_status",
    );

    expect(enumInput).toBeDefined();

    expect(enumInput.props("fieldProps")).toEqual(enumField);
  });

  it("saves the record when Save and continue button is clicked", async () => {
    const restStub = sinon.stub(RestClient.prototype, "executeQuery");

    restStub.resolves({
      data: "Hello !",
    });

    try {
      const saveButton = wrapper
        .findAll("button.bg-primary")
        .find((button) => button.text().trim() === "Save and continue");

      expect(saveButton).toBeDefined();

      await saveButton.trigger("click");

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.continueLoader).toBe(false);
      expect(wrapper.vm.exitLoader).toBe(false);

      expect($scrollTo).toHaveBeenCalledWith("#mainHeader");

      expect($router.push).not.toHaveBeenCalled();
    } finally {
      restStub.restore();
    }
  });

  it("saves the record when Save and exit button is clicked", async () => {
    const restStub = sinon.stub(RestClient.prototype, "executeQuery");

    restStub.resolves({
      data: "Hello !",
    });

    try {
      const exitButton = wrapper
        .findAll("button.bg-primary")
        .find((button) => button.text().trim() === "Save and exit");
      expect(exitButton).toBeDefined();

      await exitButton.trigger("click");
      await flushPromises();
      expect(wrapper.vm.continueLoader).toBe(false);
      expect(wrapper.vm.exitLoader).toBe(false);
      expect($router.push).toHaveBeenCalledWith({
        path: "/123",
      });
    } finally {
      restStub.restore();
    }
  });

  it("updates overlay.show through v-overlay v-model", async () => {
    wrapper.vm.createItem(
      "contacts",
      {
        name: {
          type: "string",
        },
      },
      [],
    );

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.overlay.show).toBe(true);

    const overlay = wrapper.findComponent({
      name: "VOverlay",
    });

    expect(overlay.exists()).toBe(true);
    expect(overlay.props("modelValue")).toBe(true);

    overlay.vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.overlay.show).toBe(false);
  });

  it("updates subFormValid through overlay form v-model", async () => {
    wrapper.vm.createItem(
      "contacts",
      {
        name: {
          type: "string",
        },
      },
      [],
    );

    await wrapper.vm.$nextTick();
    const form = wrapper.findComponent("#editAdditionalInformationOverlay");

    expect(form.exists()).toBe(true);
    expect(form.props("modelValue")).toBe(false);

    form.vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.subFormValid).toBe(true);

    form.vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.subFormValid).toBe(false);
  });

  it("updates checkbox, text field and autocomplete values in overlay", async () => {
    await wrapper.setData({
      overlay: {
        show: true,
        id: 0,
        fieldName: "contacts",
        fields: {
          in_champion_registry: false,
          name: "",
          status: "active",
        },
        required: ["name"],
        template: {
          in_champion_registry: {
            type: "boolean",
            description: "Champion registry status",
          },
          name: {
            type: "string",
            description: "Contact name",
          },
          status: {
            type: "string",
            enum: ["active", "inactive"],
            description: "Contact status",
          },
        },
      },
    });
    await wrapper.vm.$nextTick();

    // Checkbox v-model
    const checkbox = wrapper.findComponent({
      name: "VCheckbox",
    });

    expect(checkbox.exists()).toBe(true);
    checkbox.vm.$emit("update:modelValue", true);

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.overlay.fields.in_champion_registry).toBe(true);

    // Text field v-model
    const textField = wrapper
      .findAllComponents({ name: "VTextField" })
      .find((field) => field.props("label") === "name");
    expect(textField).toBeDefined();

    textField.vm.$emit("update:modelValue", "Test Contact");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.overlay.fields.name).toBe("Test Contact");

    // Autocomplete v-model
    const autocomplete = wrapper.findComponent({
      name: "VAutocomplete",
    });
    expect(autocomplete.exists()).toBe(true);

    autocomplete.vm.$emit("update:modelValue", "inactive");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.overlay.fields.status).toBe("inactive");
  });

  it("handles Submit item and Cancel button clicks in overlay", async () => {
    const overlayData = {
      show: true,
      id: null,
      fieldName: "contacts",
      fields: {
        name: "Test Contact",
      },
      required: ["name"],
      template: {
        name: {
          type: "string",
        },
      },
    };

    // Open overlay and enable Submit button
    await wrapper.setData({
      overlay: structuredClone(overlayData),
      subFormValid: true,
    });

    await wrapper.vm.$nextTick();

    const overlay = wrapper.find('[data-test="v-overlay"]');

    expect(overlay.exists()).toBe(true);

    // Cover @click="addItem()"
    const submitButton = overlay.find("button.bg-success");

    expect(submitButton.exists()).toBe(true);
    expect(submitButton.attributes("disabled")).toBeUndefined();

    await submitButton.trigger("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.overlay.show).toBe(false);

    expect(wrapper.vm.fields.contacts).toContainEqual({
      name: "Test Contact",
    });

    // Reopen overlay to test Cancel
    await wrapper.setData({
      overlay: structuredClone(overlayData),
      subFormValid: true,
    });

    await wrapper.vm.$nextTick();

    // Cover @click="hideOverlay()"
    const cancelButton = wrapper.find(
      '[data-test="v-overlay"] button.bg-error',
    );

    expect(cancelButton.exists()).toBe(true);

    await cancelButton.trigger("click");

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.overlay.show).toBe(false);
    expect(wrapper.vm.overlay.fieldName).toBeNull();
    expect(wrapper.vm.overlay.fields).toBeNull();
  });
});
