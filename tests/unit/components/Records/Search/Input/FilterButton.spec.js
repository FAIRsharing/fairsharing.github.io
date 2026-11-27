import { shallowMount } from "@vue/test-utils";
import { reactive } from "vue";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import FilterButton from "@/components/Records/Search/Input/FilterButton.vue";
import searchFiltersStore from "@/store/searchFilters.js";
import {
  VBtnStub,
  VIconStub,
  VTooltipStub,
} from "../../../../../stubs/index.js";

const vuetify = createVuetify();

let $route = reactive({ name: "search", query: {} });

const $router = {
  push: vi.fn(),
};

const $store = new Vuex.Store({
  modules: {
    searchFilters: searchFiltersStore,
  },
});

describe("FilterButton.vue", function () {
  let wrapper;
  let anotherWrapper;
  const wrappers = [];
  const mountFilter = (options) => {
    const instance = shallowMount(FilterButton, options);
    wrappers.push(instance);
    return instance;
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    $route.query = {};
    $store.state.searchFilters.filterButtons = [];
    wrapper = mountFilter({
      vuetify,
      stubs: { VBtn: VBtnStub, VIcon: VIconStub, VTooltip: VTooltipStub },
      props: {
        item: {
          active: false,
          filterName: "isMaintained",
          title: "Maintained",
          value: true,
        },
        isFirstItem: false,
        mdScreens: false,
        itemParentIndex: 0,
        multipleItems: false,
      },
      mocks: { $store, $router, $route },
    });

    await wrapper.vm.$nextTick();
  });

  afterEach(() => {
    wrappers.splice(0).forEach((instance) => instance.unmount());
    vi.unstubAllGlobals();
    vuetify.display.update();
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("FilterButton");
  });

  it("can check selectFilter method", () => {
    let selectedItem = {
      active: false,
      filterName: "isMaintained",
      title: "MAINTAINED",
      value: true,
    };
    $store.state.searchFilters.filterButtons = [
      {
        data: [
          { active: true, filterName: "isMaintained", title: "All" },
          {
            active: false,
            filterName: "isMaintained",
            title: "MAINTAINED",
            value: true,
          },
        ],
        curator_only: true,
      },
    ];
    wrapper.vm.selectFilter(selectedItem);
    expect($router.push).toHaveBeenCalledTimes(1);
    expect($router.push).toHaveBeenCalledWith({
      name: "search",
      query: { isMaintained: "true", page: 1 },
    });
    expect($store.state.searchFilters.filterButtons[0].data[1].active).toBe(
      true,
    );
  });

  it("can check applyFilter function", () => {
    anotherWrapper = mountFilter({
      vuetify,
      stubs: { VBtn: VBtnStub, VIcon: VIconStub, VTooltip: VTooltipStub },
      props: {
        item: { active: true, filterName: "isMaintained", title: "All" },
        isFirstItem: false,
        mdScreens: false,
        itemParentIndex: 0,
        multipleItems: false,
        doubleItems: true,
      },
      mocks: { $store, $router, $route },
    });
    anotherWrapper.vm.$route.query = { isMaintained: "false" };
    let selectedItem = {
      active: false,
      filterName: "isMaintained",
      title: "Maintained",
      value: true,
    };
    anotherWrapper.vm.applyFilters(selectedItem);

    anotherWrapper.vm.$route.query = { isMaintained: "true" };
    selectedItem = {
      active: false,
      filterName: "isMaintained",
      title: "Maintained",
      value: true,
    };
    anotherWrapper.vm.applyFilters(selectedItem);

    selectedItem = { active: false, filterName: "isMaintained", title: "All" };
    anotherWrapper.vm.applyFilters(selectedItem);

    anotherWrapper.vm.$route.query = { isMaintained: "true" };
    selectedItem = { active: false, filterName: "isMaintained", title: "All" };
    anotherWrapper.vm.applyFilters(selectedItem);
  });

  it("sets button labels correctly via the checkCurrentParameters function", () => {
    wrapper.vm.checkCurrentParameters("all", null, undefined);
    expect(wrapper.vm.itemModified.active).toEqual(true);
    wrapper.vm.checkCurrentParameters("ismaintained", "true", undefined);
    expect(wrapper.vm.itemModified.active).toEqual(false);
    wrapper.vm.checkCurrentParameters("ismaintained", "true", true);
    expect(wrapper.vm.itemModified.active).toEqual(true);
  });

  it("updates the active button when route parameters change", async () => {
    expect(wrapper.vm.itemModified.active).toBe(false);
    $route.query.isMaintained = "true";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.itemModified.active).toBe(true);
    expect(wrapper.get("button").attributes("variant")).toBe("flat");
    $route.query.isMaintained = "false";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.itemModified.active).toBe(false);
    expect(wrapper.get("button").attributes("variant")).toBe("outlined");
  });

  it("selects a filter through its rendered button and updates the store", async () => {
    $store.state.searchFilters.filterButtons = [
      {
        data: [{ title: "All", active: true }, { ...wrapper.vm.itemModified }],
      },
    ];
    await wrapper.get("button").trigger("click");
    expect($router.push).toHaveBeenCalledWith({
      name: "search",
      query: { isMaintained: "true", page: 1 },
    });
    expect(
      $store.state.searchFilters.filterButtons[0].data.map(
        (item) => item.active,
      ),
    ).toEqual([false, true]);
  });

  it("renders ALL as an icon and applies layout classes from props", async () => {
    wrapper.vm.itemModified.title = "ALL";
    await wrapper.setProps({
      isFirstItem: true,
      mdScreens: true,
      doubleItems: false,
    });
    expect(wrapper.get("button").classes()).toContain("first-child");
    expect(wrapper.get("button").classes()).toContain(
      "button-style-md-screens",
    );
    expect(wrapper.get('[data-test="v-icon"]').text()).toContain("fas fa-sync");
    await wrapper.setProps({ isFirstItem: false, multipleItems: true });
    expect(wrapper.get("button").classes()).toContain("flex-1");
    expect(wrapper.get("button").classes()).toContain("buttons-md-style");
    await wrapper.setProps({ isFirstItem: true, doubleItems: true });
    expect(wrapper.get("button").classes()).not.toContain("first-child");
  });

  it("enables tooltips when present and disables them on small screens", async () => {
    expect(wrapper.findComponent(VTooltipStub).attributes("disabled")).toBe(
      "true",
    );
    wrapper.vm.itemModified.tooltip = "Maintained resources";
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("Maintained resources");
    expect(wrapper.findComponent(VTooltipStub).attributes("disabled")).toBe(
      "false",
    );
    vi.stubGlobal("innerWidth", 400);
    vuetify.display.update();
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(VTooltipStub).attributes("disabled")).toBe(
      "true",
    );
  });

  it("encodes filter values while preserving unrelated route parameters", () => {
    $route.query = { q: "biology", page: 7 };
    wrapper.vm.applyFilters({ filterName: "countries", value: "A & B" });
    expect($router.push).toHaveBeenCalledWith({
      name: "search",
      query: { q: "biology", countries: "A%20%26%20B", page: 1 },
    });
    expect($route.query).toEqual({ q: "biology", page: 7 });
    wrapper.vm.checkCurrentParameters("match all terms", null, undefined);
    expect(wrapper.vm.itemModified.active).toBe(true);
  });
});
