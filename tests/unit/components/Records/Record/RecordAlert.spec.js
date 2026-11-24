import { shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import RecordAlert from "@/components/Records/Record/RecordAlert.vue";

describe("RecordAlert.vue", () => {
  let wrapper;
  let safeHtml;

  beforeEach(() => {
    safeHtml = { mounted: vi.fn(), updated: vi.fn() };
    wrapper = shallowMount(RecordAlert, {
      global: { directives: { "safe-html": safeHtml } },
    });
  });

  afterEach(() => wrapper.unmount());

  it("defaults to an informational alert with no message", () => {
    const alert = wrapper.findComponent({ name: "VAlert" });
    expect(alert.props("type")).toBe("info");
    expect(alert.props("icon")).toBe("fas fa-circle-exclamation");
    expect(alert.props("density")).toBe("compact");
    const [element, binding] = safeHtml.mounted.mock.calls[0];
    expect(element).toBe(wrapper.get("#message-text").element);
    expect(binding.value).toBeNull();
  });

  it.each(["success", "warning", "error"])(
    "forwards the %s type and removes the informational icon",
    async (type) => {
      await wrapper.setProps({ type });
      const alert = wrapper.findComponent({ name: "VAlert" });
      expect(alert.props("type")).toBe(type);
      expect(alert.props("icon")).toBeNull();
    },
  );

  it("passes message changes to the safe-html directive and restores the info icon", async () => {
    const message = '<b>Record saved.</b> <a href="/123">View record</a>';
    await wrapper.setProps({ message, type: "success" });
    let [element, binding] = safeHtml.updated.mock.lastCall;
    expect(element).toBe(wrapper.get("#message-text").element);
    expect(binding.value).toBe(message);
    expect(binding.oldValue).toBeNull();

    await wrapper.setProps({ message: null, type: "info" });
    [element, binding] = safeHtml.updated.mock.lastCall;
    expect(binding.value).toBeNull();
    expect(binding.oldValue).toBe(message);
    expect(wrapper.findComponent({ name: "VAlert" }).props("icon")).toBe(
      "fas fa-circle-exclamation",
    );
  });
});
