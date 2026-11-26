import { shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createVuetify } from "vuetify";

import TooltipComponent from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/UtilComponents/TooltipComponent.vue";
import {
  VIconStub,
  VTooltipStub,
} from "../../../../../../../../stubs/index.js";

const vuetify = createVuetify();

describe("TooltipComponent.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TooltipComponent, {
      vuetify,
      stubs: { VTooltip: VTooltipStub, VIcon: VIconStub },
    });
  });

  afterEach(() => wrapper.unmount());

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("TooltipComponent");
  });

  it("renders the default white question icon inside the tooltip activator", () => {
    const icon = wrapper.get('[data-test="v-icon"]');
    expect(icon.text()).toContain("fas fa-question-circle");
    expect(icon.classes()).toContain("text-white");
    expect(wrapper.findComponent(VTooltipStub).attributes("location")).toBe(
      "bottom",
    );
    expect(wrapper.props("toolTipText")).toBeNull();
  });

  it("renders and updates help text and icon colour from props", async () => {
    await wrapper.setProps({
      toolTipText: "Choose an access method",
      textColour: "text-blue",
    });
    expect(
      wrapper.get('[data-test="v-tooltip"] span:not([data-test])').text(),
    ).toBe("Choose an access method");
    expect(wrapper.get('[data-test="v-icon"]').classes()).toContain(
      "text-blue",
    );
    expect(wrapper.get('[data-test="v-icon"]').classes()).not.toContain(
      "text-white",
    );
    await wrapper.setProps({
      toolTipText: "Updated help",
      textColour: "text-error",
    });
    expect(wrapper.text()).toContain("Updated help");
    expect(wrapper.text()).not.toContain("Choose an access method");
    expect(wrapper.get('[data-test="v-icon"]').classes()).toContain(
      "text-error",
    );
  });
});
