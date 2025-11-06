import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import SearchBlock from "@/components/Home/SearchBlock";

const vuetify = new Vuetify();

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
});
