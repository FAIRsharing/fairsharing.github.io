import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import Subject from "@/components/Records/Search/Input/QueryBuilderComponents/Subject";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/search", query: {} };

let vuetify = new Vuetify();

describe("Subject.vue", () => {
  let wrapper = shallowMount(Subject, {
    mocks: { $router, $route },
    vuetify,
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("Subject");
  });
});
