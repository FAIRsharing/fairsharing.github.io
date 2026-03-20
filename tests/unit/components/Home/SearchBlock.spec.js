import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { createVuetify } from "vuetify";

import SearchBlock from "@/components/Home/SearchBlock";

const vuetify = createVuetify();

describe("BlockSearch.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SearchBlock, {
      vuetify,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SearchBlock");
  });

  it("can check advancedSearchTerm method", () => {
    wrapper.vm.advancedSearchTerm("test");
    expect(wrapper.vm.advancedSearchValue).toBe("test");
  });
});
