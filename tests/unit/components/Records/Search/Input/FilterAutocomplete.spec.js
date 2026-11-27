import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import ExpansionPanel from "@/components/Records/Search/Input/FilterAutocomplete.vue";
import recordsStore from "@/store/recordSearch.js";
import uiController from "@/store/uiController.js";

import {
  VBtnStub,
  VComboboxStub,
  VListItemSlotsStub,
  VTooltipStub,
} from "../../../../../stubs/index.js";

import getGrants from "../../../../../fixtures/getGrants.json";

const vuetify = createVuetify();

const $store = new Vuex.Store({
  modules: {
    records: recordsStore,
    uiController: uiController,
  },
});

let $route = {
  name: "standards",
  query: {
    grants: "123",
    page: "1",
  },
};

const $router = {
  push: vi.fn(),
};

describe("FilterAutocomplete.vue", function () {
  // complex fake data needs to be moved to fixtures/
  let wrapper;
  let fake_GetFilter_Grants_Response = getGrants;
  beforeEach(async () => {
    vi.clearAllMocks();
    $route.name = "standards";
    $route.query = { grants: "123", page: "1" };
    $store.state.records.facets = [];
    vi.stubGlobal("innerWidth", 1280);
    vuetify.display.update();
    wrapper = shallowMount(ExpansionPanel, {
      vuetify,
      stubs: {
        VCombobox: VComboboxStub,
        VBtn: VBtnStub,
        VListItem: VListItemSlotsStub,
        VTooltip: VTooltipStub,
      },
      mocks: { $store, $route, $router },
      props: {
        filter: {
          filterName: "grants",
        },
        lastItem: true,
      },
    });

    await wrapper.vm.$nextTick();
  });

  afterEach(() => {
    wrapper.unmount();
    vi.unstubAllGlobals();
    vuetify.display.update();
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("FilterAutocomplete");
  });

  it("check getValues computed", () => {
    $store.state.records.facets.push(fake_GetFilter_Grants_Response);
    const filterNameLocal = "grants";
    expect(wrapper.vm.getFilter(filterNameLocal).values).toEqual(
      getGrants.buckets,
    );
    expect(wrapper.vm.getValues).toEqual(getGrants.buckets);
  });

  it("can check cleanString returns properly", () => {
    let term = "hosein_mirian";
    let returnedValue;

    returnedValue = wrapper.vm.cleanString(term);
    expect(returnedValue).toBe("hosein mirian");

    term = "hoseinmirian";
    returnedValue = wrapper.vm.cleanString(term);
    expect(returnedValue).toBe("hoseinmirian");
  });

  it("can reset searchBox ", () => {
    let selectedItem = { filterSelected: { grants: "a" } };
    wrapper.vm.reset(selectedItem);
    expect(selectedItem.filterSelected).toStrictEqual({});
  });

  it("can check applyFilters", () => {
    wrapper.vm.$route.name = "search";
    wrapper.vm.$route.query = {};
    wrapper.vm.applyFilters();
    expect($router.push).toHaveBeenCalledTimes(0);

    wrapper.vm.selectedValues = [{ key: "value1" }];
    wrapper.vm.applyFilters();
    expect($router.push).toHaveBeenCalledTimes(1);
    expect($router.push).toHaveBeenCalledWith({
      name: "search",
      query: { grants: "value1", page: 1 },
    });

    wrapper.vm.selectedValues = [{ key: "value 2" }, { key: "value 3" }];
    wrapper.vm.applyFilters();
    expect($router.push).toHaveBeenCalledTimes(2);
    expect($router.push).toHaveBeenCalledWith({
      name: "search",
      query: { grants: "value%202,value%203", page: 1 },
    });

    wrapper.vm.$route.query = { grants: "value1" };
    wrapper.vm.selectedValues = [];
    wrapper.vm.applyFilters();
    expect($router.push).toHaveBeenCalledTimes(3);
    expect($router.push).toHaveBeenCalledWith({
      name: "search",
      query: { page: 1 },
    });

    wrapper.vm.$route.query = { grants: "value1,value%202" };
    wrapper.vm.selectedValues = [{ key: "val3" }, { key: "value1" }];
    wrapper.vm.applyFilters();
    expect($router.push).toHaveBeenCalledTimes(4);
    expect($router.push).toHaveBeenCalledWith({
      name: "search",
      query: { grants: "value1,value%202,val3", page: 1 },
    });

    wrapper.vm.$route.query = { grants: "agrants,newGrants" };
    wrapper.vm.selectedValues = [{ key: "agrants" }, { key: "newGrants" }];
    wrapper.vm.applyFilters();
    expect($router.push).toHaveBeenCalledTimes(4);
  });

  it("renders bucket labels, counts and selected chips through scoped slots", async () => {
    $store.state.records.facets = [
      {
        ...getGrants,
        buckets: [
          { key: "research_grant", doc_count: 12 },
          { key: "", doc_count: 0 },
        ],
      },
    ];
    await wrapper.setData({
      selectedValues: [{ key: "research_grant", doc_count: 12 }],
    });
    expect(
      wrapper.findAll(".filterValueCount").map((count) => count.text()),
    ).toEqual(["12", "0"]);
    expect(wrapper.text()).toContain("research grant");
    expect(wrapper.findAllComponents({ name: "VChip" })).toHaveLength(1);
    expect(
      wrapper
        .findAllComponents({ name: "VCheckboxBtn" })
        .every((checkbox) => checkbox.props("readonly")),
    ).toBe(true);
    expect(wrapper.findComponent(VTooltipStub).text()).toBe("research grant");
  });

  it("applies the selected values from the Apply button, preserving other filters", async () => {
    $route.name = "search";
    $route.query = { q: "biology", page: "5" };
    wrapper
      .findComponent(VComboboxStub)
      .vm.$emit("update:modelValue", [{ key: "grant A" }]);
    await wrapper.vm.$nextTick();
    await wrapper
      .findAll("button")
      .find((button) => button.text() === "Apply")
      .trigger("click");
    expect($router.push).toHaveBeenCalledWith({
      name: "search",
      query: { q: "biology", grants: "grant%20A", page: 1 },
    });
    expect(wrapper.vm.selectedValues).toEqual([]);
    expect($route.query).toEqual({ q: "biology", page: "5" });
  });

  it("scrolls the focused filter into view and resets selection on clear", async () => {
    await wrapper.setProps({
      filter: { filterName: "grants", filterSelected: { grants: "old" } },
    });
    await wrapper.setData({ selectedValues: [{ key: "old" }] });
    await wrapper.get('input[aria-label="Search options"]').trigger("focus");
    expect(wrapper.vm.$scrollTo).toHaveBeenCalledWith(
      "#grantsAutocompleteList",
      450,
      { container: "#scrollable-holder", easing: "ease-in" },
    );
    await wrapper.get('[data-test="clear-combobox"]').trigger("click");
    expect(wrapper.vm.selectedValues).toEqual([]);
    expect(wrapper.props("filter").filterSelected).toEqual({});
  });

  it.each([[undefined], [null], ["invalid"]])(
    "returns no options for invalid bucket values: %s",
    async (buckets) => {
      $store.state.records.facets = [{ filterName: "grants", buckets }];
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.getValues).toEqual([]);
    },
  );

  it("formats item titles and hides filters without a filter name", async () => {
    expect(
      wrapper.vm.itemProps({ key: "research_grant", doc_count: 3 }),
    ).toEqual({ key: "research_grant", title: "Research grant", subtitle: 3 });
    await wrapper.setProps({ filter: {} });
    expect(wrapper.find("v-expansion-panel-stub").exists()).toBe(false);
  });

  it("stacks the filter controls on smaller screens", async () => {
    expect(wrapper.get(".d-flex").classes()).not.toContain("flex-column");
    vi.stubGlobal("innerWidth", 400);
    vuetify.display.update();
    await wrapper.vm.$nextTick();
    expect(wrapper.get(".d-flex").classes()).toContain("flex-column");
  });
});
