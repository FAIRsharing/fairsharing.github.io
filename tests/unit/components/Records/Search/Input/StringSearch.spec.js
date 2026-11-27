import { shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import {
  VBtnStub,
  VCheckboxArrayStub,
  VFormStub,
  VIconStub,
  VTextFieldStub,
} from "../../../../../stubs/index.js";

import StringSearch from "@/components/Records/Search/Input/StringSearch";

const $router = {
  push: vi.fn(),
};
const $route = { path: "/search", query: {} };

const vuetify = createVuetify();

describe("StringSearch.vue", () => {
  const wrappers = [];
  const stubs = {
    VForm: VFormStub,
    VTextField: VTextFieldStub,
    VBtn: VBtnStub,
    VIcon: VIconStub,
    VCheckbox: VCheckboxArrayStub,
    AdvancedSearch: true,
  };
  const getWrapper = (props = {}) => {
    const instance = shallowMount(StringSearch, {
      props,
      global: { plugins: [vuetify], mocks: { $router, $route }, stubs },
    });
    wrappers.push(instance);
    return instance;
  };

  let wrapper;
  let wrapper2;

  beforeEach(() => {
    vi.clearAllMocks();
    $route.query = {};
    wrapper = getWrapper();
    wrapper2 = getWrapper();
  });

  afterEach(() => wrappers.splice(0).forEach((instance) => instance.unmount()));

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
        stubs,
      },
    });

    wrappers.push(wrapperWithQuery);
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

  it("updates the search field and form model, then searches on submit", async () => {
    const field = wrapper.get('input[data-test="v-text-field"]');
    await field.setValue("genomics!");
    wrapper.findComponent(VFormStub).vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.searchTerm).toBe("genomics!");
    expect(wrapper.vm.formValid).toBe(false);
    await wrapper.get("form").trigger("submit");
    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: { q: "genomics " },
    });
    expect(VFormStub.methods.resetValidation).toHaveBeenCalled();
  });

  it("searches through the normal Search button and forwards the term to advanced search", async () => {
    await wrapper.get('input[data-test="v-text-field"]').setValue("genomics");
    expect(
      wrapper
        .findComponent({ name: "AdvancedSearch" })
        .attributes("advanced-search-term"),
    ).toBe("genomics");
    await wrapper.get("button.search-btn").trigger("click");
    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: { q: "genomics" },
    });
  });

  it("only clears the search when AdvancedSearch requests it", async () => {
    await wrapper.setData({ searchTerm: "Keep me" });
    const advanced = wrapper.findComponent({ name: "AdvancedSearch" });
    advanced.vm.$emit("clear-search-field", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.searchTerm).toBe("Keep me");
    advanced.vm.$emit("clear-search-field", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.searchTerm).toBeNull();
  });

  it("uses a custom search path and placeholder", async () => {
    wrapper = getWrapper({
      searchPath: "/custom-search",
      placeholder: "Search resources",
    });
    expect(wrapper.get("input").attributes("placeholder")).toBe(
      "Search resources",
    );
    await wrapper.get("input").setValue("biology");
    await wrapper.get("button").trigger("click");
    expect($router.push).toHaveBeenCalledWith({
      path: "/custom-search",
      query: { q: "biology" },
    });
  });

  it("updates home registry choices through checkboxes and searches the selected registries", async () => {
    wrapper = getWrapper({ showHomeSearch: true });
    expect(wrapper.findComponent({ name: "AdvancedSearch" }).exists()).toBe(
      false,
    );
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(4);
    await wrapper.get('input[aria-label="standards"]').setValue(false);
    expect(wrapper.vm.selectedRegistries.map((item) => item.value)).toEqual([
      "database",
      "policy",
      "collection",
    ]);
    await wrapper.get('input[data-test="v-text-field"]').setValue("biology");
    await wrapper.get("button.home-page-search-btn").trigger("click");
    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: {
        q: "biology",
        fairsharingRegistry: "database,policy,collection",
        searchAnd: false,
      },
    });
  });
});
