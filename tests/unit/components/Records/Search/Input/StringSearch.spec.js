import { shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";

import StringSearch from "@/components/Records/Search/Input/StringSearch";

const $router = {
  push: jest.fn(),
};
let $route = { path: "/search", query: {} };

let vuetify = new Vuetify();

describe("StringSearch.vue", () => {
  let wrapper = shallowMount(StringSearch, {
    mocks: { $router, $route },
    vuetify,
  });
  let wrapper2 = shallowMount(StringSearch, {
    mocks: { $router, $route },
    vuetify,
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("StringSearch");
  });

  it("can pass the search term to the correct route", () => {
    wrapper.vm.$refs["form"] = {
      validate: jest.fn(),
      resetValidation: jest.fn(),
    };
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
    vuetify.framework.breakpoint.mdAndDown = true;
    expect(wrapper.vm.responsiveHeight).toStrictEqual({
      "style-sm-xs": true,
      "style-md": true,
      "style-lg": false,
      "style-xl": false,
    });
  });

  it("can check responsiveHeightTextBox", () => {
    vuetify.framework.breakpoint.xlOnly = true;
    expect(wrapper.vm.responsiveHeightTextBox).toBe(50);
  });

  it("can pass the search term to the correct route for homePage searchBox function", () => {
    wrapper = shallowMount(StringSearch, {
      vuetify,
      propsData: {
        showHomeSearch: true,
      },
      mocks: { $router, $route },
    });

    wrapper.vm.$refs.form = {
      validate: jest.fn().mockImplementation(() => true),
      resetValidation: jest.fn().mockImplementation(() => true),
    };

    wrapper2.vm.$refs["form"] = {
      validate: jest.fn().mockImplementation(() => true),
      resetValidation: jest.fn().mockImplementation(() => true),
    };

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
    expect($router.push).toHaveBeenCalledTimes(2);

    wrapper.vm.searchTerm = "testStringHome";
    wrapper.vm.searchStringHomePage();
    expect($router.push).toHaveBeenCalledTimes(4);
    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: { q: "testStringHome" },
    });

    wrapper2.vm.searchTerm = "testStringHome";
    wrapper2.vm.selectedRegistries = [
      { label: "standards", value: "standard" },
    ];
    wrapper2.vm.searchStringHomePage();
    expect($router.push).toHaveBeenCalledTimes(5);
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
    expect($router.push).toHaveBeenCalledTimes(6);
  });

  it("appends terms when relevant prop is set", () => {
    wrapper = shallowMount(StringSearch, {
      propsData: {
        addSearchTerms: true,
      },
      mocks: { $router, $route },
      vuetify,
    });
    wrapper.vm.searchTerm = "testString";
    wrapper.vm.$refs["form"] = {
      validate: jest.fn(),
      resetValidation: jest.fn(),
    };
    wrapper.vm.searchString();
    expect($router.push).toHaveBeenCalledWith({
      path: "/search",
      query: { q: "testString" },
    });
  });
});
