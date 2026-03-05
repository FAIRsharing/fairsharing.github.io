import { shallowMount  } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import icons from "@/plugins/icons";
import Community from "@/views/Static/Community/Community.vue";

const VueScrollTo = require("vue-scrollto");

let $route = {
  name: "Community",
  hash: "#governance",
};

const push = jest.fn();
const $router = {
  push: jest.fn(),
};
const pushState = jest.spyOn(window.history, "pushState").mockImplementation(() => {});

describe("Community.vue", function () {
  let wrapper;
  const vuetify = createVuetify({ icons: icons });
  beforeEach(() => {
    wrapper = shallowMount(Community, {
      vuetify,
      mocks: { $route, $router },
      stubs: ["router-link"],
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Community");
    // wrapper.vm.$route.hash = '#anotherAnchor'
    $route.hash = "#anotherAnchor";
    wrapper = shallowMount(Community, {
      vuetify,
      mocks: { $route },
      stubs: ["router-link"],
    });
    expect(wrapper.vm.applyCss).toBe(false);
  });

  it("can check jumpToAnchor method", () => {
    const anchor = document.createElement("div");
    anchor.id = "newAnchor";
    anchor.scrollIntoView = jest.fn();
    document.body.appendChild(anchor);
    wrapper.vm.currentAnchor = "";
    wrapper.vm.jumpToAnchor("newAnchor");
    expect(pushState).toHaveBeenCalledWith(null, null, "#newAnchor");
    wrapper.vm.jumpToAnchor("newAnchor");
    expect(wrapper.vm.currentAnchor).not.toBe("");
    anchor.remove();
  });

  afterAll(() => {
    pushState.mockRestore();
  });
});
