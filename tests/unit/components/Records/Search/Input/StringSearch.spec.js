import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { defineComponent, h } from "vue";

import StringSearch from "@/components/Records/Search/Input/StringSearch";

const $router = {
  push: vi.fn(),
};
let $route = { path: "/search", query: {} };

const vuetify = createVuetify();

const textFieldStub = defineComponent({
  name: "VTextField",
  // Explicitly declaring 'prefix' tells the stub how to handle it safely
  props: ["modelValue", "prefix", "label", "rules"],
  emits: ["update:modelValue"],
  setup(_, { slots }) {
    return () => h("div", slots.default?.());
  },
});

describe("StringSearch.vue", () => {
  const getWrapper = (props = {}) =>
    shallowMount(StringSearch, {
      mocks: { $router, $route },
      vuetify,
      props,
      global: {
        stubs: {
          "v-form": {
            template: "<form><slot /></form>",
            methods: {
              resetValidation: vi.fn(),
              validate: vi.fn().mockReturnValue(true),
            },
          },
          "v-text-field": textFieldStub,
          VTextField: textFieldStub,
        },
      },
    });

  let wrapper = getWrapper();
  let wrapper2 = getWrapper();

  beforeEach(() => {
    $router.push.mockClear();
    wrapper = getWrapper();
    wrapper2 = getWrapper();
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("StringSearch");
  });

  it("can pass the search term to the correct route", () => {
    wrapper.vm.$refs.form.resetValidation = vi.fn();
    wrapper.vm.searchString();
    expect($router.push).toHaveBeenCalledTimes(1);
    wrapper.vm.searchTerm = "testString";
    wrapper.vm.searchString();
    expect($router.push).toHaveBeenCalledTimes(2);
    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: { q: "testString" },
    });
  });

  it("can check responsiveHeight", () => {
    wrapper.vm.$vuetify.display.mdAndDown = true;
    wrapper.vm.$vuetify.display.md = true;
    wrapper.vm.$vuetify.display.lg = false;
    wrapper.vm.$vuetify.display.xl = false;
    expect(wrapper.vm.responsiveHeight).toStrictEqual({
      "style-sm-xs": true,
      "style-md": true,
      "style-lg": false,
      "style-xl": false,
    });
  });

  it("can check responsiveHeightTextBox", () => {
    wrapper.vm.$vuetify.display.xl = true;
    expect(wrapper.vm.responsiveHeightTextBox).toBe(50);
  });

  it("can pass the search term to the correct route for homePage searchBox function", () => {
    wrapper = getWrapper({ showHomeSearch: true });
    wrapper2 = getWrapper();
    wrapper.vm.$refs.form.resetValidation = vi.fn().mockReturnValue(true);
    wrapper2.vm.$refs.form.resetValidation = vi.fn().mockReturnValue(true);

    wrapper.vm.registries = [
      { label: "standards", value: "standard" },
      { label: "databases", value: "database" },
      { label: "policies", value: "policy" },
      { label: "collections", value: "collection" },
    ];
    wrapper.vm.selectedRegistries = [
      { label: "standards", value: "standard" },
      {
        label: "databases",
        value: "database",
      },
      { label: "policies", value: "policy" },
      { label: "collections", value: "collection" },
    ];

    wrapper.vm.searchTerm = null;

    wrapper.vm.searchStringHomePage();
    // this won't have been called with a null search string
    expect($router.push).toHaveBeenCalledTimes(0);

    wrapper.vm.searchTerm = "testStringHome";
    wrapper.vm.searchStringHomePage();
    expect($router.push).toHaveBeenCalledTimes(2);
    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: { q: "testStringHome" },
    });

    wrapper2.vm.searchTerm = "testStringHome";
    wrapper2.vm.selectedRegistries = [
      { label: "standards", value: "standard" },
    ];
    wrapper2.vm.searchStringHomePage();
    expect($router.push).toHaveBeenCalledTimes(3);
    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: {
        q: "testStringHome",
        fairsharingRegistry: "standard",
        searchAnd: false,
      },
    });
    wrapper2.vm.searchTerm = "another test string";
    wrapper2.vm.selectedRegistries = [
      { label: "standards", value: "standard" },
    ];
    wrapper2.vm.searchStringHomePage();
    expect($router.push).toHaveBeenCalledTimes(4);
  });

  it("appends terms when relevant prop is set", () => {
    wrapper = getWrapper({ addSearchTerms: true });
    wrapper.vm.searchTerm = "testString";
    wrapper.vm.$refs.form.resetValidation = vi.fn();
    wrapper.vm.searchString();
    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: { q: "testString" },
    });
  });
});
