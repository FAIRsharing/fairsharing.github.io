import { createLocalVue, shallowMount } from "@vue/test-utils";
import linkify from "vue-linkify";
import VueSanitize from "vue-sanitize";
import Vuetify from "vuetify";

import icons from "@/plugins/icons";
import Community from "@/views/Static/Community/Community.vue";

const VueScrollTo = require("vue-scrollto");
const localVue = createLocalVue();
localVue.use(VueSanitize);
localVue.use(VueScrollTo);

let $route = {
  name: "Community",
  hash: "#governance",
};

const push = jest.fn();
const $router = {
  push: jest.fn(),
};

describe("Community.vue", function () {
  let wrapper;
  localVue.directive("linkified", linkify);
  const vuetify = new Vuetify({ icons: icons });
  beforeEach(() => {
    wrapper = shallowMount(Community, {
      localVue,
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
      localVue,
      vuetify,
      mocks: { $route },
      stubs: ["router-link"],
    });
    expect(wrapper.vm.applyCss).toBe(false);
  });

  it("can check jumpToAnchor method", () => {
    wrapper.vm.currentAnchor = "";
    wrapper.vm.$router.push = push;
    wrapper.vm.jumpToAnchor("newAnchor");
    expect(push).toHaveBeenCalledWith({ hash: "newAnchor" });
    wrapper.vm.jumpToAnchor("newAnchor");
    expect(wrapper.vm.currentAnchor).not.toBe("");
  });
});
