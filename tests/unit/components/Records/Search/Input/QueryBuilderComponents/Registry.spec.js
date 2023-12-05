import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import Registry from "@/components/Records/Search/Input/QueryBuilderComponents/Registry";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/search", query: {} };

let vuetify = new Vuetify();

describe("Registry.vue", () => {
  let wrapper = shallowMount(Registry, {
    mocks: { $router, $route },
    vuetify,
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Registry");
  });
});
