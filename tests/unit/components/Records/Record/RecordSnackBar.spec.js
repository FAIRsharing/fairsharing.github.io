import { shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import RecordSnackBar from "@/components/Records/Record/RecordSnackBar.vue";

describe("RecordSnackBar.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RecordSnackBar);
  });

  afterEach(() => wrapper.unmount());

  it("defaults to an informational snackbar with no message or model", () => {
    const snackbar = wrapper.findComponent({ name: "VSnackbar" });
    expect(snackbar.props("modelValue")).toBeNull();
    expect(snackbar.props("color")).toBe("info");
    expect(wrapper.get("span.text-center").text()).toBe("");
  });

  it.each([true, false])("forwards model=%s to the snackbar", async (model) => {
    await wrapper.setProps({ model });
    expect(
      wrapper.findComponent({ name: "VSnackbar" }).props("modelValue"),
    ).toBe(model);
  });

  it("updates the message, colour and model when the parent changes props", async () => {
    await wrapper.setProps({
      model: true,
      message: "Record saved successfully",
      type: "success",
    });
    const snackbar = wrapper.findComponent({ name: "VSnackbar" });
    expect(snackbar.props("modelValue")).toBe(true);
    expect(snackbar.props("color")).toBe("success");
    expect(wrapper.get("span.text-center").text()).toBe(
      "Record saved successfully",
    );

    await wrapper.setProps({
      model: false,
      message: "Save failed",
      type: "error",
    });
    expect(snackbar.props("modelValue")).toBe(false);
    expect(snackbar.props("color")).toBe("error");
    expect(wrapper.get("span.text-center").text()).toBe("Save failed");
  });

  it("renders markup in messages as plain text", async () => {
    const message = "<strong>Record saved</strong>";
    await wrapper.setProps({ model: true, message });
    expect(wrapper.get("span.text-center").text()).toBe(message);
    expect(wrapper.find("strong").exists()).toBe(false);
  });
});
