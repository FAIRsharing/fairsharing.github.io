import { shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import Loaders from "@/components/Navigation/Loaders.vue";

describe("Loaders.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Loaders);
  });

  afterEach(() => wrapper.unmount());

  it("renders the loading message in its hidden text row", () => {
    expect(wrapper.get("h2").text()).toContain("Loading your content.");
    expect(wrapper.get("h2").text()).toContain("Please wait ...");
    expect(wrapper.get(".d-none").find("h2").exists()).toBe(true);
  });

  it("renders a scalable DNA loader with continuously animated circles", () => {
    const svg = wrapper.get("svg.lds-dna");
    expect(svg.attributes("viewBox")).toBe("0 0 100 100");
    expect(svg.attributes("preserveAspectRatio")).toBe("xMidYMid");
    const circles = svg.findAll("circle");
    expect(circles.length).toBeGreaterThan(1);
    for (const circle of circles) {
      const animations = circle.findAll("animate");
      expect(
        animations.map((animation) => animation.attributes("attributeName")),
      ).toEqual(["r", "cy", "fill"]);
      for (const animation of animations) {
        expect(animation.attributes("repeatCount")).toBe("indefinite");
        expect(animation.attributes("dur")).toBe("2s");
      }
    }
  });
});
