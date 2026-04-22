import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { createVuetify } from "vuetify";

import TooltipComponent from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/UtilComponents/TooltipComponent.vue";

const vuetify = createVuetify();

describe("TooltipComponent.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(TooltipComponent, {
      vuetify,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("TooltipComponent");
  });
});
