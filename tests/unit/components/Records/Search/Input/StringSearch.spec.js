import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { defineComponent, h } from "vue";

import StringSearch from "@/components/Records/Search/Input/StringSearch";

const $router = {
  push: vi.fn(),
};
const $route = { path: "/search", query: {} };

const vuetify = createVuetify();

const textFieldStub = defineComponent({
  name: "VTextField",
  props: {
    modelValue: {
      type: [String, Number, Object],
      default: "",
    },
    prefix: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  setup(_, { slots }) {
    return () => h("div", slots.default?.());
  },
});

describe("StringSearch.vue", () => {
  const getWrapper = (props = {}) =>
    shallowMount(StringSearch, {
      props,
      global: {
        plugins: [vuetify],
        mocks: { $router, $route },
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
          AdvancedSearch: true,
          "v-btn": true,
          "v-icon": true,
          "v-checkbox": true,
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
    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: {},
    });

    wrapper.vm.searchTerm = "testString";
    wrapper.vm.searchString();

    expect($router.push).toHaveBeenCalledTimes(2);
    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: { q: "testString" },
    });
  });

  it("sanitises the search term before routing", () => {
    wrapper.vm.$refs.form.resetValidation = vi.fn();
    wrapper.vm.searchTerm = "test-string!";

    wrapper.vm.searchString();

    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: { q: "test string " },
    });
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
      { label: "databases", value: "database" },
      { label: "policies", value: "policy" },
      { label: "collections", value: "collection" },
    ];

    wrapper.vm.searchTerm = null;

    wrapper.vm.searchStringHomePage();

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

  it("preserves the existing route query when appending terms", () => {
    const wrapperWithQuery = shallowMount(StringSearch, {
      props: { addSearchTerms: true },
      global: {
        plugins: [vuetify],
        mocks: {
          $router,
          $route: {
            path: "/search",
            query: { page: 2, fairsharingRegistry: "standard" },
          },
        },
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
          AdvancedSearch: true,
          "v-btn": true,
          "v-icon": true,
          "v-checkbox": true,
        },
      },
    });

    wrapperWithQuery.vm.searchTerm = "testString";
    wrapperWithQuery.vm.$refs.form.resetValidation = vi.fn();

    wrapperWithQuery.vm.searchString();

    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: {
        page: 2,
        fairsharingRegistry: "standard",
        q: "testString",
      },
    });
  });
});
