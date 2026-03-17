import { shallowMount  } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { createVuetify } from "vuetify";

import CategoryBlock from "@/components/Home/CategoryBlock";
import icons from "@/plugins/icons";
const vuetify = createVuetify({ icons: icons });


describe("CategoryBlock.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CategoryBlock, {
      vuetify,
      stubs: ["router-link"],
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("CategoryBlock");
  });
});
