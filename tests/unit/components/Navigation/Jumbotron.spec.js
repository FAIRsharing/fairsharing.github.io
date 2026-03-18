import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";

import Jumbotron from "@/components/Navigation/Jumbotron";

const vuetify = createVuetify();
let $route = { path: "/", name: "Home" };

describe("Jumbotron.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Jumbotron, {
      global: {
        plugins: [vuetify],
        mocks: { $route },
        stubs: {
          "router-link": true,
          "router-view": true,
          "vue-particles": true, // This silences the warning
        },
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Jumbotron");
  });

  it("can handle sub-search routes", () => {
    $route = {
      path: "/search",
      name: "search",
      query: {
        fairsharingRegistry: "collection",
      },
    };
    wrapper = shallowMount(Jumbotron, {
      global: {
        plugins: [vuetify],
        mocks: { $route },
        stubs: {
          "router-link": true,
          "router-view": true,
          "vue-particles": true, // This silences the warning
        },
      },
    });
    expect(wrapper.vm.$route.path).toEqual("/search");
  });

  it("can handle a no route case", () => {
    $route = {
      path: "",
      name: "",
    };
    wrapper = shallowMount(Jumbotron, {
      global: {
        plugins: [vuetify],
        mocks: { $route },
        stubs: {
          "router-link": true,
          "router-view": true,
          "vue-particles": true, // This silences the warning
        },
      },
    });
    expect(wrapper.vm.$route.path).toEqual("");
  });

  it("can handle an unknown route case", () => {
    $route = {
      path: "/test",
      name: "test",
    };
    wrapper = shallowMount(Jumbotron, {
      global: {
        plugins: [vuetify],
        mocks: { $route },
        stubs: {
          "router-link": true,
          "router-view": true,
          "vue-particles": true, // This silences the warning
        },
      },
    });
    expect(wrapper.vm.$route.path).toEqual("/test");
  });
});
