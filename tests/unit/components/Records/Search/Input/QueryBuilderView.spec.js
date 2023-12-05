import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import QueryBuilderView from "@/components/Records/Search/Input/QueryBuilderView";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/search", query: {} };

let vuetify = new Vuetify();

describe("QueryBuilderView.vue", () => {
  let wrapper = shallowMount(QueryBuilderView, {
    mocks: { $router, $route },
    vuetify,
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("QueryBuilderView");
  });
});
