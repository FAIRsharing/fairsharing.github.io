import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import AdvancedSearch from "@/components/Records/Search/Input/AdvancedSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/search", query: {} };

let vuetify = new Vuetify();

describe("AdvancedSearch.vue", () => {
  let wrapper = shallowMount(AdvancedSearch, {
    mocks: { $router, $route },
    vuetify,
  });


  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("AdvancedSearch");
  });

});
