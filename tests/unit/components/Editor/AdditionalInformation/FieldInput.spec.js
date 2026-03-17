import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FieldInput from "@/components/Editor/AdditionalInformation/FieldInput.vue";
import { createStore } from "vuex";

// 1. Mock External Utils and Mixins
vi.mock("@/utils/rules.js", () => ({
  isUrl: vi.fn(() => "is-url-rule"),
}));

describe("FieldInput.vue", () => {
  let wrapper;
  let store;
  let mutations;
  let state;

  // Helper to create the store with dynamic initial data
  const createVuexStore = (initialData = {}) => {
    mutations = {
      setAdditionalInformation: vi.fn(),
    };
    state = {
      sections: {
        additionalInformation: {
          data: initialData,
        },
      },
    };
    return createStore({
      modules: {
        record: {
          namespaced: true,
          state,
          mutations,
          getters: {
            getSection: (state) => (key) => state.sections[key],
          },
        },
      },
    });
  };

  // Helper factory for mounting
  const mountComponent = (props = {}, data = {}) => {
    store = createVuexStore(data);
    return mount(FieldInput, {
      global: {
        plugins: [store],
        stubs: {
          VTooltip: {
            template:
              "<div><slot name='activator' :props='{}'></slot><slot></slot></div>",
          },
          VIcon: { template: "<span class='v-icon'><slot></slot></span>" },
          VTextField: {
            template:
              "<input class='v-text-field' :value='modelValue' @input='$emit(\"update:modelValue\", $event.target.value)' />",
            props: ["modelValue", "rules", "label"],
          },
          VAutocomplete: {
            template:
              "<select class='v-autocomplete' :value='modelValue' @change='$emit(\"update:modelValue\", $event.target.value)'></select>",
            props: ["modelValue", "items", "label"],
          },
          VSwitch: {
            template:
              "<div class='v-switch' @click='$emit(\"update:modelValue\", \"yes\")'><slot name='label'></slot></div>",
            props: ["modelValue", "trueValue", "falseValue"],
          },
        },
      },
      props: {
        fieldName: "testField",
        id: 1,
        ...props,
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- RENDERING & PROPS ---

  it("does not render if fieldName is missing", () => {
    wrapper = mountComponent({ fieldName: null });
    expect(wrapper.find("div").exists()).toBe(false);
  });

  it("renders tooltip if description is provided", () => {
    wrapper = mountComponent({
      fieldProps: { description: "Help text", type: "string" },
    });
    expect(wrapper.text()).toContain("Help text");
    expect(wrapper.find(".v-icon").exists()).toBe(true);
  });

  // --- COMPUTED PROPERTIES ---

  describe("getName computed property", () => {
    it("returns cleaned fieldName if subfieldName is missing", () => {
      wrapper = mountComponent({ fieldProps: {} });
      expect(wrapper.vm.getName).toBe("testField");
    });

    it("returns cleaned subfieldName if it exists", () => {
      wrapper = mountComponent({ subfieldName: "sub", fieldProps: {} });
      expect(wrapper.vm.getName).toBe("sub");
    });
  });

  describe("rules computed property", () => {
    it("adds isUrl rule if format is uri", () => {
      wrapper = mountComponent({
        fieldProps: { format: "uri", type: "string" },
      });
      expect(wrapper.vm.rules).toContain("is-url-rule");
    });

    it("returns empty rules for standard strings", () => {
      wrapper = mountComponent({ fieldProps: { type: "string" } });
      expect(wrapper.vm.rules).toHaveLength(0);
    });
  });

  describe("isSwitch computed property", () => {
    it("returns true for exact yes/no enum", () => {
      wrapper = mountComponent({ fieldProps: { enum: ["yes", "no"] } });
      expect(wrapper.vm.isSwitch).toBe(true);
    });

    it("returns true for unordered no/yes enum", () => {
      wrapper = mountComponent({ fieldProps: { enum: ["no", "yes"] } });
      expect(wrapper.vm.isSwitch).toBe(true);
    });

    it("returns false for other enums", () => {
      wrapper = mountComponent({ fieldProps: { enum: ["a", "b"] } });
      expect(wrapper.vm.isSwitch).toBe(false);
    });

    it("returns false if enum is missing", () => {
      wrapper = mountComponent({ fieldProps: { type: "string" } });
      expect(wrapper.vm.isSwitch).toBe(false);
    });
  });

  // --- METHODS (target & fieldCheck) ---

  describe("target() method", () => {
    it("initializes null if data is missing and no subfield", () => {
      wrapper = mountComponent({ fieldProps: {} }, {}); // Empty store data
      const result = wrapper.vm.target();
      expect(result).toBe(null);
      // It should have mutated the store data object directly (simulated in method)
      expect(
        store.state.record.sections.additionalInformation.data.testField,
      ).toBe(null);
    });

    it("initializes empty object if data is missing and subfield exists", () => {
      wrapper = mountComponent({ subfieldName: "sub", fieldProps: {} }, {});
      const result = wrapper.vm.target();
      expect(result).toBe(undefined); // undefined because created {} but key 'sub' doesn't exist yet
      expect(
        store.state.record.sections.additionalInformation.data.testField,
      ).toEqual({});
    });

    it("returns existing data", () => {
      wrapper = mountComponent({ fieldProps: {} }, { testField: "Value" });
      expect(wrapper.vm.target()).toBe("Value");
    });

    it("returns existing nested data", () => {
      wrapper = mountComponent(
        { subfieldName: "sub", fieldProps: {} },
        { testField: { sub: "NestedValue" } },
      );
      expect(wrapper.vm.target()).toBe("NestedValue");
    });
  });

  describe("fieldCheck() method", () => {
    it("returns field data if it is defined", () => {
      wrapper = mountComponent({ fieldProps: {} }, { testField: "Existing" });
      expect(wrapper.vm.fieldCheck()).toBe("Existing");
    });

    it("returns fallback object structure if undefined", () => {
      // target() is evaluated during render and initializes the parent field as {}.
      wrapper = mountComponent({ subfieldName: "subKey", fieldProps: {} }, {});

      const result = wrapper.vm.fieldCheck();
      expect(result).toStrictEqual({});
    });
  });

  // --- TEMPLATE INTERACTION & MUTATIONS ---

  it("renders v-text-field and emits change", async () => {
    wrapper = mountComponent({ fieldProps: { type: "string" } }); // No enum

    const input = wrapper.find(".v-text-field");
    expect(input.exists()).toBe(true);

    await input.trigger("input"); // Triggers @update:model-value mock

    expect(mutations.setAdditionalInformation).toHaveBeenCalledWith(
      expect.anything(),
      {
        fieldName: "testField",
        fieldValue: "",
        subfieldName: null,
      },
    );
  });

  it("renders v-autocomplete and emits change", async () => {
    wrapper = mountComponent({ fieldProps: { enum: ["a", "b"] } }); // Enum but not switch

    const select = wrapper.find(".v-autocomplete");
    expect(select.exists()).toBe(true);

    await select.trigger("change");

    expect(mutations.setAdditionalInformation).toHaveBeenCalled();
  });

  // --- SWITCH CASE COVERAGE ---

  it("renders Switch 1 (No subfield) and handles labels", async () => {
    // 1. Setup: Yes/No enum, no subfield, value is 'yes'
    wrapper = mountComponent(
      { fieldProps: { enum: ["yes", "no"] } },
      { testField: "yes" },
    );

    const switchComp = wrapper.find(".v-switch");
    expect(switchComp.exists()).toBe(true);

    // Test Label logic inside switch: <span v-if="fields[fieldName]">
    expect(wrapper.text()).toContain("yes");

    // Trigger update
    await switchComp.trigger("click");
    expect(mutations.setAdditionalInformation).toHaveBeenCalledWith(
      expect.anything(),
      { fieldName: "testField", fieldValue: "yes", subfieldName: null },
    );
  });

  it("renders Switch 1 (No subfield) Label 'no' case", () => {
    // Setup: Value is null/false
    wrapper = mountComponent(
      { fieldProps: { enum: ["yes", "no"] } },
      { testField: null },
    );
    // Should render "no" in the label
    expect(wrapper.text()).toContain("no");
  });

  it("renders Switch 2 (With subfield) and handles labels", async () => {
    // Setup: Yes/No enum, WITH subfield
    wrapper = mountComponent(
      { subfieldName: "sub", fieldProps: { enum: ["yes", "no"] } },
      { testField: { sub: "yes" } },
    );

    const switchComp = wrapper.find(".v-switch");
    expect(switchComp.exists()).toBe(true);

    // Test Label logic: <span v-if="fields[fieldName][subfieldName]">
    expect(wrapper.text()).toContain("yes");

    // Trigger update
    await switchComp.trigger("click");
    expect(mutations.setAdditionalInformation).toHaveBeenCalledWith(
      expect.anything(),
      { fieldName: "testField", fieldValue: "yes", subfieldName: "sub" },
    );
  });

  it("renders Switch 2 (With subfield) Label 'no' case", () => {
    wrapper = mountComponent(
      { subfieldName: "sub", fieldProps: { enum: ["yes", "no"] } },
      { testField: { sub: null } },
    );
    // <span v-else class="ml-1"> no </span>
    expect(wrapper.text()).toContain("no");
  });
});
