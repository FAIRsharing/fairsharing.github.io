import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import additionalInformationFixture from "@/../tests/fixtures/additionalInformation.json";
import EditAdditionalInfo from "@/components/Editor/AdditionalInformation/EditAdditionalInfo.vue";
import RestClient from "@/lib/Client/RESTClient.js";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
import userStore from "@/store/users.js";

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
$store.state.record.sections.additionalInformation = {
  data: additionalInformationFixture.data,
  initialData: JSON.parse(JSON.stringify(additionalInformationFixture.data)),
  error: false,
  message: null,
  changes: 0,
};
let $route = { params: { id: "123" } };
const $router = { push: vi.fn() };
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
      render: () => {},
      methods: {
        validate: () => true,
      },
      data() {
        return {};
      },
    };
  });

  beforeEach(() => {
    wrapper = shallowMount(EditAdditionalInfo, {
      global: {
        plugins: [$store],
        mocks: { $route, $router, sortObj: mockSortObj },
      },
      stubs: { "router-link": true, "v-form": editAdditionalInfo },
    });
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
    expect(wrapper.vm.isPolicy).toBe(true);
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

  it("can create a new item", () => {
    wrapper.vm.createItem("fieldName", template);
    expect(wrapper.vm.overlay.template).toStrictEqual(template);
    expect(JSON.stringify(wrapper.vm.overlay.fields)).toStrictEqual(
      JSON.stringify({ url: null, anotherField: null }),
    );
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
    await wrapper.vm.saveRecord(true, btn);
    expect(wrapper.vm.message.error).toBe(false);
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
        template: {
          website: { format: "uri" },
          name: { format: "string" },
        },
      },
    });

    const bothRules = wrapper.vm.rules("website", ["website", "other"]);
    expect(bothRules).toHaveLength(2);
    expect(bothRules).toContain("Invalid URL");
    expect(bothRules).toContain("Field required");

    // CASE 2: Only URI rule
    const uriOnly = wrapper.vm.rules("website", ["other"]);
    expect(uriOnly).toHaveLength(1);
    expect(uriOnly[0]).toBe("Invalid URL");

    // CASE 3: Only Required rule (and handles format being undefined)
    const requiredOnly = wrapper.vm.rules("name", ["name"]);
    expect(requiredOnly).toHaveLength(1);
    expect(requiredOnly[0]).toBe("Field required");

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
          // Should NOT match (type is integer)
          numberField: { type: "integer", enum: [1, 2] },
        },
      };

      const result = wrapper.vm.getFields("string");

      // Hits 'else if (type === "string" && ...enum)'
      expect(result).toHaveProperty("statusField");
      // Hits 'if (...type === type && !...enum)'
      expect(result).toHaveProperty("textField");
      // Should be ignored
      expect(result).not.toHaveProperty("numberField");
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
});
