import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import RegistryType from "@/components/Records/Search/Input/QueryBuilderComponents/RegistryType";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/search", query: {} };

let vuetify = new Vuetify();

describe("RegistryType.vue", () => {
  let wrapper = shallowMount(RegistryType, {
    mocks: { $router, $route },
    vuetify,
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("RegistryType");
  });
});
