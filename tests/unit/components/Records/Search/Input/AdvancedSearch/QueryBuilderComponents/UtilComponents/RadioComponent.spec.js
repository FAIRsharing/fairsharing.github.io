import { afterEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import RadioComponent from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/UtilComponents/RadioComponent.vue";
import { createVuetify } from "vuetify";
import {
  VIconStub,
  VTooltipStub,
} from "../../../../../../../../stubs/index.js";

describe("RadioComponent.vue", () => {
  const vuetify = createVuetify();
  const wrappers = [];
  const createWrapper = (props = {}) => {
    const wrapper = mount(RadioComponent, {
      props: {
        ...props,
      },
      global: {
        plugins: [vuetify],
        stubs: {
          VTooltip: VTooltipStub,
          VIcon: VIconStub,
        },
      },
    });
    wrappers.push(wrapper);
    return wrapper;
  };

  afterEach(() => wrappers.splice(0).forEach((wrapper) => wrapper.unmount()));

  // describe("Computed Property: model", () => {
  //   it("getter: returns the itemValue prop", () => {
  //     const wrapper = createWrapper({ itemValue: "false" });
  //     expect(wrapper.vm.model).toBe("false");
  //   });
  //
  //   it("setter: emits 'input' event when assigned a new value programmatically", () => {
  //     const wrapper = createWrapper();
  //     wrapper.vm.model = "true";
  //     expect(wrapper.emitted().input).toBeTruthy();
  //     expect(wrapper.emitted().input[0]).toEqual(["true"]);
  //   });
  // });

  describe("Template Bindings & Events", () => {
    // it("passes the computed model to v-radio-group as modelValue", () => {
    //   const wrapper = createWrapper({ itemValue: "true" });
    //   const radioGroup = wrapper.findComponent({ name: "v-radio-group" });
    //   expect(radioGroup.props("modelValue")).toBe("true");
    // });

    it("emits 'update:modelValue' when v-radio-group updates", () => {
      const wrapper = createWrapper();
      const radioGroup = wrapper.findComponent({ name: "v-radio-group" });
      radioGroup.vm.$emit("update:modelValue", "false");
      expect(wrapper.emitted()["update:modelValue"]).toBeTruthy();
      expect(wrapper.emitted()["update:modelValue"][0]).toEqual(["false"]);
    });
  });

  it("defaults to no selected value and renders both labelled choices", () => {
    const wrapper = createWrapper();
    expect(
      wrapper.findComponent({ name: "VRadioGroup" }).props("modelValue"),
    ).toBeNull();
    expect(
      wrapper
        .findAll('input[type="radio"]')
        .map((input) => input.element.checked),
    ).toEqual([false, false]);
    expect(wrapper.text()).toContain("Yes");
    expect(wrapper.text()).toContain("No");
  });

  it.each(["true", "false"])(
    "emits the string value %s when its radio is selected",
    async (value) => {
      const wrapper = createWrapper();
      await wrapper.get(`input[value="${value}"]`).setValue(true);
      expect(wrapper.emitted("update:modelValue")).toEqual([[value]]);
      expect(wrapper.props("modelValue")).toBeNull();
    },
  );

  it("updates the checked choice when the parent changes modelValue", async () => {
    const wrapper = createWrapper({ modelValue: "true" });
    expect(wrapper.get('input[value="true"]').element.checked).toBe(true);
    expect(wrapper.get('input[value="false"]').element.checked).toBe(false);
    await wrapper.setProps({ modelValue: "false" });
    expect(wrapper.get('input[value="true"]').element.checked).toBe(false);
    expect(wrapper.get('input[value="false"]').element.checked).toBe(true);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("renders the help text and question icon in the prepend slot", () => {
    const wrapper = createWrapper({
      toolTipText: "Does the resource provide an API?",
    });
    expect(wrapper.text()).toContain("Does the resource provide an API?");
    expect(wrapper.get('[data-test="v-icon"]').text()).toContain(
      "fas fa-question-circle",
    );
  });
});
