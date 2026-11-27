import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import { makeInertStub, makeTextInputStub } from "../../stubs/index.js";

describe("legacy mounting stubs", () => {
  let wrapper;

  afterEach(() => {
    wrapper?.unmount();
  });

  it("renders default slots without forwarding unsafe control attributes", () => {
    wrapper = mount(makeInertStub("VSelect"), {
      attrs: { prefix: "Prefix", id: "not-forwarded" },
      slots: { default: "Selected content" },
    });

    expect(wrapper.attributes("data-test")).toBe("vselect");
    expect(wrapper.text()).toBe("Selected content");
    expect(wrapper.attributes()).not.toHaveProperty("prefix");
    expect(wrapper.attributes()).not.toHaveProperty("id");
  });

  it.each([
    ["VTextField", "input"],
    ["VTextarea", "textarea"],
  ])("preserves the %s input model and attributes", async (name, tag) => {
    wrapper = mount(makeTextInputStub(name, tag), {
      props: { modelValue: "Initial value" },
      attrs: { "aria-label": "Search text", disabled: true },
    });

    expect(wrapper.element.tagName.toLowerCase()).toBe(tag);
    expect(wrapper.element.value).toBe("Initial value");
    expect(wrapper.attributes("data-test")).toBe(name.toLowerCase());
    expect(wrapper.attributes("aria-label")).toBe("Search text");
    expect(wrapper.element.disabled).toBe(true);

    await wrapper.setProps({ modelValue: "Updated value" });
    expect(wrapper.element.value).toBe("Updated value");
    await wrapper.setValue("Entered value");
    expect(wrapper.emitted("update:modelValue")).toEqual([["Entered value"]]);
  });

  it.each([null, false, 0, ["tag"], { id: 1 }])(
    "accepts legacy model values without prop warnings: %j",
    (modelValue) => {
      const warnHandler = vi.fn();
      wrapper = mount(makeTextInputStub("VTextField"), {
        props: { modelValue },
        global: { config: { warnHandler } },
      });

      expect(wrapper.props("modelValue")).toEqual(modelValue);
      expect(warnHandler).not.toHaveBeenCalled();
      if (modelValue === null) expect(wrapper.element.value).toBe("");
    },
  );
});
